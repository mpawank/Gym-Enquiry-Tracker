"use client"

import { useEffect, useState, useMemo } from "react"
import { GymEnquiryForm } from "@/components/gym-enquiry-form"
import { GymEnquiryTable } from "@/components/gym-enquiry-table"
import { AddVisitForm } from "@/components/add-visit-form"
import type { GymEnquiry, AdditionalVisit } from "@/lib/types"

export default function Home() {
  const [enquiries, setEnquiries] = useState<GymEnquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVisitForEnquiryId, setEditingVisitForEnquiryId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [leadQualityFilter, setLeadQualityFilter] = useState("all")

  // ✅ Fetch Enquiries from API
  useEffect(() => {
    const fetchEnquiries = async () => {
      const res = await fetch("/api/enquiries")
      const data = await res.json()
      setEnquiries(data)
      setLoading(false)
    }
    fetchEnquiries()
  }, [])

  // ✅ Add new enquiry to DB
  const handleAddEnquiry = async (newEnquiry: Omit<GymEnquiry, "id">) => {
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEnquiry),
    })
    const saved = await res.json()
    setEnquiries((prev) => [...prev, { ...newEnquiry, _id: saved.insertedId }])
    setShowForm(false)
  }

  // ✅ Handle add visit locally or via PUT (based on your data model)
  const handleAddVisitClick = (enquiryId: string) => {
    setEditingVisitForEnquiryId(enquiryId)
  }

  const handleSaveVisit = async (visitData: Omit<AdditionalVisit, "id">) => {
  if (editingVisitForEnquiryId) {
    const enquiry = enquiries.find((e) => e._id === editingVisitForEnquiryId)
    if (!enquiry) return

    const updatedVisits = [...(enquiry.additionalVisits || []), visitData]

    // Update on the server
    await fetch(`/api/enquiries/${editingVisitForEnquiryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ additionalVisits: updatedVisits }), // ✅ Correct key name
    })

    // Update local state
    setEnquiries((prev) =>
      prev.map((e) =>
        e._id === editingVisitForEnquiryId ? { ...e, additionalVisits: updatedVisits } : e
      )
    )

    setEditingVisitForEnquiryId(null)
  }
}


  const handleCancelAddVisit = () => {
    setEditingVisitForEnquiryId(null)
  }

  const currentEnquiryForVisit = enquiries.find((e) => e._id === editingVisitForEnquiryId)

  // ✅ Apply Filters
  const filteredEnquiries = useMemo(() => {
    let filtered = [...enquiries]

    if (leadQualityFilter !== "all") {
      filtered = filtered.filter((e) => e.leadQuality === leadQualityFilter)
    }

    if (searchQuery) {
      const lower = searchQuery.toLowerCase()
      filtered = filtered.filter((e) => {
        const location = `${e.address} ${e.city} ${e.pinCode}`.toLowerCase()
        return (
          e.gymName.toLowerCase().includes(lower) ||
          e.ownerManagerName.toLowerCase().includes(lower) ||
          e.phoneNumber.toLowerCase().includes(lower) ||
          location.includes(lower)
        )
      })
    }

    return filtered
  }, [enquiries, searchQuery, leadQualityFilter])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
      {loading ? (
        <p>Loading...</p>
      ) : showForm ? (
        <GymEnquiryForm
          onSubmit={handleAddEnquiry}
          onCancel={() => setShowForm(false)}
          formTitle="Add New Gym Enquiry"
          formDescription="Enter the details for a new potential client."
        />
      ) : editingVisitForEnquiryId && currentEnquiryForVisit ? (
        <AddVisitForm
          gymName={currentEnquiryForVisit.gymName}
          onSubmit={handleSaveVisit}
          onCancel={handleCancelAddVisit}
        />
      ) : (
        <GymEnquiryTable
          enquiries={filteredEnquiries}
          onAddEnquiry={() => setShowForm(true)}
          onAddVisit={handleAddVisitClick}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          leadQualityFilter={leadQualityFilter}
          onLeadQualityChange={setLeadQualityFilter}
        />
      )}
    </main>
  )
}
