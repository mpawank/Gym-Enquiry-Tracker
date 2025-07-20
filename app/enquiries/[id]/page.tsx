"use client"

import React from "react"
import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteEnquiry, updateEnquiry } from "@/lib/enquiry"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GymEnquiryForm } from "@/components/gym-enquiry-form"
import type { GymEnquiry } from "@/lib/types"

interface GymDetailsPageProps {
  params: Promise<{ id: string }>
}

export default function GymDetailsPage({ params }: GymDetailsPageProps) {
  const { id } = use(params) // ✅ unwrap the Promise
  const router = useRouter()
  const [enquiry, setEnquiry] = useState<GymEnquiry | undefined>(undefined)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  

  useEffect(() => {
    async function fetchEnquiry() {
      if (!id) return // Don't fetch if id is undefined
      
      setIsLoading(true)
      setError(null)
      
      try {
        const res = await fetch(`/api/enquiries/${id}`)
        if (res.ok) {
          const data = await res.json()
          // Convert date strings to Date objects
          const processedData = {
            ...data,
            dateOfFirstContact: data.dateOfFirstContact ? new Date(data.dateOfFirstContact) : undefined,
            dateOfVisit: data.dateOfVisit ? new Date(data.dateOfVisit) : undefined,
            nextFollowUpDate: data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : undefined,
            dateOfRevisit: data.dateOfRevisit ? new Date(data.dateOfRevisit) : undefined,
            issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
            additionalVisits: data.additionalVisits?.map((visit: any) => ({
              ...visit,
              date: new Date(visit.date),
              nextVisitDate: visit.nextVisitDate ? new Date(visit.nextVisitDate) : undefined,
            })) || [],
          }
          setEnquiry(processedData)
        } else {
          setEnquiry(undefined)
          setError("Failed to fetch enquiry")
        }
      } catch (err) {
        setError("An error occurred while fetching the enquiry")
        setEnquiry(undefined)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEnquiry()
  }, [id, isEditing])

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
        <Card className="w-full max-w-2xl mx-auto my-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
            <CardDescription>Fetching enquiry details...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
        <Card className="w-full max-w-2xl mx-auto my-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              <Link href="/">
                <Button variant="outline">Back to Enquiries</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (!enquiry && !isEditing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
        <Card className="w-full max-w-2xl mx-auto my-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Enquiry Not Found</CardTitle>
            <CardDescription>The gym enquiry with id "{id}" could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>Back to Enquiries</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  const handleDelete = async () => {
    if (enquiry && enquiry._id) {
      try {
        const res = await fetch(`/api/enquiries/${enquiry._id}`, {
          method: "DELETE",
        })
        if (res.ok) {
          router.push("/")
        } else {
          console.error("Failed to delete enquiry")
        }
      } catch (err) {
        console.error("Error deleting enquiry:", err)
      }
    }
  }

  const handleUpdateEnquiry = async (updatedData: Omit<GymEnquiry, "_id"> | GymEnquiry) => {
    if (enquiry && enquiry._id) {
      const res = await fetch(`/api/enquiries/${enquiry._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
      if (res.ok) {
        const data = await res.json()
        // Convert date strings to Date objects
        const processedData = {
          ...data,
          dateOfFirstContact: data.dateOfFirstContact ? new Date(data.dateOfFirstContact) : undefined,
          dateOfVisit: data.dateOfVisit ? new Date(data.dateOfVisit) : undefined,
          nextFollowUpDate: data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : undefined,
          dateOfRevisit: data.dateOfRevisit ? new Date(data.dateOfRevisit) : undefined,
          issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
          additionalVisits: data.additionalVisits?.map((visit: any) => ({
            ...visit,
            date: new Date(visit.date),
            nextVisitDate: visit.nextVisitDate ? new Date(visit.nextVisitDate) : undefined,
          })) || [],
        }
        setEnquiry(processedData)
        setIsEditing(false)
      }
    }
  }

  // Combine initial visit and additional visits for the table
  const allVisits = []
  if (enquiry?.visited && enquiry.dateOfVisit) {
    allVisits.push({
      date: enquiry.dateOfVisit,
      type: enquiry.typeOfInteraction,
      notes: "Initial contact/visit",
      nextVisitDate: enquiry.nextFollowUpDate, // Use the overall next follow-up for initial visit
    })
  }
  if (enquiry?.additionalVisits) {
    allVisits.push(...enquiry.additionalVisits)
  }

  if (isEditing && enquiry) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 bg-gray-50">
        <GymEnquiryForm
          initialData={enquiry}
          onSubmit={handleUpdateEnquiry}
          onCancel={() => setIsEditing(false)}
          formTitle={`Edit Enquiry: ${enquiry.gymName}`}
          formDescription="Update the details for this gym enquiry."
        />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 bg-gray-50">
      <Card className="w-full max-w-4xl mx-auto my-8">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">{enquiry?.gymName} Details</CardTitle>
            <CardDescription>Comprehensive information for this gym enquiry.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
              Edit Enquiry
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  Delete Enquiry
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the {enquiry?.gymName} enquiry and remove
                    its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Enquiries
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Basic Gym Information */}
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">🔐 Basic Gym Information</h3>
            <p>
              <strong>Owner/Manager:</strong> {enquiry?.ownerManagerName || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {enquiry?.phoneNumber || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {enquiry?.emailAddress || "N/A"}
            </p>
            {enquiry?.website && (
              <p>
                <strong>Website:</strong>{" "}
                <Link
                  href={enquiry.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {enquiry.website}
                </Link>
              </p>
            )}
            <p>
              <strong>Location:</strong>{" "}
              {enquiry?.address && enquiry?.city && enquiry?.pinCode
                ? `${enquiry.address}, ${enquiry.city}, ${enquiry.pinCode}`
                : "N/A"}
            </p>
            {enquiry?.googleMapsLink && (
              <p>
                <strong>Google Maps:</strong>{" "}
                {enquiry.googleMapsLink.startsWith('http') ? (
                  <Link
                    href={enquiry.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on Map
                  </Link>
                ) : (
                  <span className="text-muted-foreground">Invalid URL format</span>
                )}
              </p>
            )}
          </div>

          {/* Interaction & Visit Details */}
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">📅 Interaction & Visit Details</h3>
            <p>
              <strong>Date of First Contact:</strong>{" "}
              {enquiry?.dateOfFirstContact && enquiry.dateOfFirstContact instanceof Date 
                ? format(enquiry.dateOfFirstContact, "PPP") 
                : "N/A"}
            </p>
            <p>
              <strong>Source of Lead:</strong> {enquiry?.sourceOfLead || "N/A"}
            </p>
            <p>
              <strong>Next Follow-up Date (Overall):</strong>{" "}
              {enquiry?.nextFollowUpDate && enquiry.nextFollowUpDate instanceof Date 
                ? format(enquiry.nextFollowUpDate, "PPP") 
                : "N/A"}
            </p>
            <p>
              <strong>Revisit Required:</strong> {enquiry?.revisitRequired ? "Yes" : "No"}
              {enquiry?.revisitRequired && enquiry.dateOfRevisit && enquiry.dateOfRevisit instanceof Date && (
                <span> ({format(enquiry.dateOfRevisit, "PPP")})</span>
              )}
            </p>
          </div>

          {/* Notes & Remarks */}
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">📝 Notes & Remarks</h3>
            <p>
              <strong>Lead Quality:</strong> {enquiry?.leadQuality || "N/A"}
            </p>
            <p>
              <strong>Issue Level:</strong> {enquiry?.issueLevel || "N/A"}
            </p>
            <p>
              <strong>Issue Date:</strong> {enquiry?.issueDate && enquiry.issueDate instanceof Date 
                ? format(enquiry.issueDate, "PPP") 
                : "N/A"}
            </p>
            <p>
              <strong>Issue Status:</strong> {enquiry?.issueStatus || "N/A"}
            </p>
            <p>
              <strong>Client Requirements:</strong> {enquiry?.clientRequirements || "N/A"}
            </p>
            <p>
              <strong>Objections:</strong> {enquiry?.objections || "N/A"}
            </p>
            <p>
              <strong>Notes/Remarks:</strong> {enquiry?.notesRemarks || "N/A"}
            </p>
          </div>

          {/* All Visits Table */}
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">All Visits History</h3>
            {allVisits.length === 0 ? (
              <p className="text-muted-foreground">No visits recorded for this enquiry.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Date</TableHead>
                      <TableHead className="min-w-[100px]">Type</TableHead>
                      <TableHead className="min-w-[150px]">Next Follow-up</TableHead>
                      <TableHead className="min-w-[200px]">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allVisits
                      .sort((a, b) => {
                        if (!(a.date instanceof Date) || !(b.date instanceof Date)) return 0
                        return a.date.getTime() - b.date.getTime()
                      }) // Sort by date
                      .map((visit, index) => (
                        <TableRow key={index}>
                          <TableCell>{visit.date instanceof Date ? format(visit.date, "PPP") : "Invalid Date"}</TableCell>
                          <TableCell>{visit.type}</TableCell>
                          <TableCell>{visit.nextVisitDate && visit.nextVisitDate instanceof Date 
                            ? format(visit.nextVisitDate, "PPP") 
                            : "N/A"}</TableCell>
                          <TableCell>{visit.notes || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
