"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "./date-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { GymEnquiry } from "@/lib/types"

interface GymEnquiryFormProps {
  onSubmit: (data: Omit<GymEnquiry, "id"> | GymEnquiry) => void
  onCancel: () => void
  initialData?: GymEnquiry // Optional prop for editing
  formTitle?: string
  formDescription?: string
}

export function GymEnquiryForm({
  onSubmit,
  onCancel,
  initialData,
  formTitle = "Gym Enquiry Tracking System",
  formDescription = "Track and manage potential clients for your gym management software.",
}: GymEnquiryFormProps) {
  const [formData, setFormData] = useState<Omit<GymEnquiry, "id"> | GymEnquiry>(
    initialData || {
      gymName: "",
      ownerManagerName: "",
      phoneNumber: "",
      emailAddress: "",
      website: "",
      address: "",
      city: "",
      pinCode: "",
      googleMapsLink: "",
      dateOfFirstContact: undefined,
      sourceOfLead: "",
      typeOfInteraction: "",
      visited: false,
      dateOfVisit: undefined,
      nextFollowUpDate: undefined,
      revisitRequired: false,
      dateOfRevisit: undefined,
      leadQuality: "",
      clientRequirements: "",
      objections: "",
      notesRemarks: "",
      additionalVisits: [], // Initialize as empty array
      issueLevel: "Medium", // Default value for new field
      issueDate: undefined, // Default value for new field
      issueStatus: "Open", // Default value for new field
    },
  )

  // Update form data if initialData changes (e.g., when switching from view to edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleDateChange = (id: string, date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [id]: date,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{formTitle}</CardTitle>
        <CardDescription>{formDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Basic Gym Information */}
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">🔐 Basic Gym Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gymName">Gym Name</Label>
                <Input
                  id="gymName"
                  value={formData.gymName}
                  onChange={handleChange}
                  placeholder="e.g., Fitness Hub Gym"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ownerManagerName">Owner/Manager Name</Label>
                <Input
                  id="ownerManagerName"
                  value={formData.ownerManagerName}
                  onChange={handleChange}
                  placeholder="e.g., Jane Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="e.g., +1234567890"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  placeholder="e.g., info@gym.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website (if any)</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="e.g., https://www.gym.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={formData.address} onChange={handleChange} placeholder="e.g., 123 Main St" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={handleChange} placeholder="e.g., New York" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pinCode">Pin Code</Label>
                <Input id="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="e.g., 10001" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="googleMapsLink">Google Maps Link / GPS Coordinates</Label>
              <Input
                id="googleMapsLink"
                value={formData.googleMapsLink}
                onChange={handleChange}
                placeholder="e.g., https://maps.app.goo.gl/..."
              />
            </div>
          </div>

          {/* Interaction & Visit Details */}
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">📅 Interaction & Visit Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dateOfFirstContact">Date of First Contact</Label>
                <DatePicker
                  date={formData.dateOfFirstContact}
                  setDate={(date) => handleDateChange("dateOfFirstContact", date)}
                  placeholder="Select date"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sourceOfLead">Source of Lead</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("sourceOfLead", value)}
                  value={formData.sourceOfLead}
                >
                  <SelectTrigger id="sourceOfLead">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                    <SelectItem value="Facebook Ad">Facebook Ad</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="typeOfInteraction">Type of Interaction</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("typeOfInteraction", value)}
                  value={formData.typeOfInteraction}
                >
                  <SelectTrigger id="typeOfInteraction">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Call">Call</SelectItem>
                    <SelectItem value="Visit">Visit</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Demo">Demo</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="visited"
                  checked={formData.visited}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "visited", type: "checkbox", checked },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                />
                <Label htmlFor="visited">Visited?</Label>
              </div>
              {formData.visited && (
                <div className="grid gap-2">
                  <Label htmlFor="dateOfVisit">Date of Visit</Label>
                  <DatePicker
                    date={formData.dateOfVisit}
                    setDate={(date) => handleDateChange("dateOfVisit", date)}
                    placeholder="Select visit date"
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="nextFollowUpDate">Next Follow-up Date</Label>
                <DatePicker
                  date={formData.nextFollowUpDate}
                  setDate={(date) => handleDateChange("nextFollowUpDate", date)}
                  placeholder="Select follow-up date"
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="revisitRequired"
                  checked={formData.revisitRequired}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "revisitRequired", type: "checkbox", checked },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                />
                <Label htmlFor="revisitRequired">Revisit Required?</Label>
              </div>
              {formData.revisitRequired && (
                <div className="grid gap-2">
                  <Label htmlFor="dateOfRevisit">Date of Revisit</Label>
                  <DatePicker
                    date={formData.dateOfRevisit}
                    setDate={(date) => handleDateChange("dateOfRevisit", date)}
                    placeholder="Select revisit date"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Notes & Remarks */}
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">📝 Notes & Remarks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="leadQuality">Lead Quality</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("leadQuality", value)}
                  value={formData.leadQuality}
                >
                  <SelectTrigger id="leadQuality">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hot">Hot</SelectItem>
                    <SelectItem value="Warm">Warm</SelectItem>
                    <SelectItem value="Cold">Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="issueLevel">Issue Level</Label>
                <Select onValueChange={(value) => handleSelectChange("issueLevel", value)} value={formData.issueLevel}>
                  <SelectTrigger id="issueLevel">
                    <SelectValue placeholder="Select issue level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Feature">Feature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* New Issue Date Field */}
              <div className="grid gap-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <DatePicker
                  date={formData.issueDate}
                  setDate={(date) => handleDateChange("issueDate", date)}
                  placeholder="Select issue date"
                />
              </div>
              {/* New Issue Status Field */}
              <div className="grid gap-2">
                <Label htmlFor="issueStatus">Issue Status</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("issueStatus", value)}
                  value={formData.issueStatus}
                >
                  <SelectTrigger id="issueStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientRequirements">Client Requirements (Customization, specific features, etc.)</Label>
              <Textarea
                id="clientRequirements"
                value={formData.clientRequirements}
                onChange={handleChange}
                placeholder="Enter client's specific needs..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="objections">Objections (Price, Features, Already Using Another Software, etc.)</Label>
              <Textarea
                id="objections"
                value={formData.objections}
                onChange={handleChange}
                placeholder="Enter any objections raised by the client..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notesRemarks">Notes/Remarks (Free text for observations)</Label>
              <Textarea
                id="notesRemarks"
                value={formData.notesRemarks}
                onChange={handleChange}
                placeholder="Add any additional observations or notes..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" className="flex-1">
              {initialData ? "Update Enquiry" : "Submit Enquiry"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
