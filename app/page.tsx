"use client"

import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { GymEnquiryTable } from "@/components/gym-enquiry-table";
import { GymEnquiryForm } from "@/components/gym-enquiry-form";
import { AddVisitForm } from "@/components/add-visit-form";
import { useEffect, useState, useMemo } from "react";
import type { GymEnquiry, AdditionalVisit } from "@/lib/types";

export default function Home() {
  const { user, isLoaded } = useUser();
  const [enquiries, setEnquiries] = useState<GymEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVisitForEnquiryId, setEditingVisitForEnquiryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [leadQualityFilter, setLeadQualityFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      setEnquiries([]);
      setLoading(false);
      return;
    }
    const fetchEnquiries = async () => {
      const res = await fetch("/api/enquiries");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEnquiries(data);
      } else {
        setEnquiries([]);
      }
      setLoading(false);
    };
    fetchEnquiries();
  }, [user]);

  const handleAddEnquiry = async (newEnquiry: Omit<GymEnquiry, "id">) => {
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEnquiry),
    });
    const saved = await res.json();
    setEnquiries((prev) => [...prev, { ...newEnquiry, _id: saved.insertedId }]);
    setShowForm(false);
  };

  const handleAddVisitClick = (enquiryId: string) => {
    setEditingVisitForEnquiryId(enquiryId);
  };

  const handleSaveVisit = async (visitData: Omit<AdditionalVisit, "id">) => {
    if (editingVisitForEnquiryId) {
      const enquiry = enquiries.find((e) => e._id === editingVisitForEnquiryId);
      if (!enquiry) return;
      const updatedVisits = [...(enquiry.additionalVisits || []), visitData];
      await fetch(`/api/enquiries/${editingVisitForEnquiryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ additionalVisits: updatedVisits }),
      });
      setEnquiries((prev) =>
        prev.map((e) =>
          e._id === editingVisitForEnquiryId ? { ...e, additionalVisits: updatedVisits } : e
        )
      );
      setEditingVisitForEnquiryId(null);
    }
  };

  const handleCancelAddVisit = () => {
    setEditingVisitForEnquiryId(null);
  };

  const currentEnquiryForVisit = enquiries.find((e) => e._id === editingVisitForEnquiryId);

  const filteredEnquiries = useMemo(() => {
    let filtered = [...enquiries];
    if (leadQualityFilter !== "all") {
      filtered = filtered.filter((e) => e.leadQuality === leadQualityFilter);
    }
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter((e) => {
        const location = `${e.address} ${e.city} ${e.pinCode}`.toLowerCase();
        return (
          e.gymName.toLowerCase().includes(lower) ||
          e.ownerManagerName.toLowerCase().includes(lower) ||
          e.phoneNumber.toLowerCase().includes(lower) ||
          location.includes(lower)
        );
      });
    }
    return filtered;
  }, [enquiries, searchQuery, leadQualityFilter]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-4xl mx-auto">
        <header className="flex flex-col items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-center">Gym Enquiry Tracker</h1>
          <p className="text-lg text-muted-foreground text-center">
            Track and manage your gym's potential clients and visits with ease.
          </p>
          <SignedOut>
            <div className="flex gap-4 mt-4">
              <SignInButton>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-gray-200 text-gray-900 px-4 py-2 rounded">Sign Up</button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4 mt-4">
              <UserButton afterSignOutUrl="/" />
              <span className="text-lg font-medium">Welcome, {user?.firstName || user?.username || "User"}!</span>
            </div>
          </SignedIn>
        </header>
        <SignedIn>
          {loading ? (
            <p>Loading your enquiries...</p>
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
        </SignedIn>
        <SignedOut>
          <div className="mt-12 text-center text-muted-foreground">
            <p>Sign in to manage your gym enquiries and visits.</p>
          </div>
        </SignedOut>
      </div>
    </main>
  );
}
