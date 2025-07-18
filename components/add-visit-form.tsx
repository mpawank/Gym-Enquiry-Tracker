"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "./date-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AdditionalVisit } from "@/lib/types"

interface AddVisitFormProps {
  gymName: string
  onSubmit: (visit: Omit<AdditionalVisit, "id">) => void
  onCancel: () => void
}

export function AddVisitForm({ gymName, onSubmit, onCancel }: AddVisitFormProps) {
  const [visitData, setVisitData] = useState<Omit<AdditionalVisit, "id">>({
    date: new Date(),
    type: "",
    notes: "",
    nextVisitDate: undefined, // Initialize new field
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setVisitData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setVisitData((prev) => ({
      ...prev,
      type: value,
    }))
  }

  const handleDateChange = (id: keyof AdditionalVisit, date: Date | undefined) => {
    setVisitData((prev) => ({
      ...prev,
      [id]: date,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!visitData.type || !visitData.date) {
      alert("Please select a visit type and date.")
      return
    }
    onSubmit(visitData)
  }

  return (
    <Card className="w-full max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Add New Visit for {gymName}</CardTitle>
        <CardDescription>Record a new interaction with this gym.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date of Visit</Label>
            <DatePicker
              date={visitData.date}
              setDate={(date) => handleDateChange("date", date)}
              placeholder="Select visit date"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type of Interaction</Label>
            <Select onValueChange={handleSelectChange} value={visitData.type}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Call">Call</SelectItem>
                <SelectItem value="Visit">Visit</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Demo">Demo</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nextVisitDate">Next Follow-up Date (for this visit)</Label>
            <DatePicker
              date={visitData.nextVisitDate}
              setDate={(date) => handleDateChange("nextVisitDate", date)}
              placeholder="Select next follow-up date"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes/Remarks</Label>
            <Textarea
              id="notes"
              value={visitData.notes}
              onChange={handleChange}
              placeholder="Add any specific notes about this visit..."
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Add Visit
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
