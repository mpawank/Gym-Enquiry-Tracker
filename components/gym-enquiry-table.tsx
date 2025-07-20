"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { GymEnquiry } from "@/lib/types"
import { format } from "date-fns"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils" // Import cn for conditional class joining

interface GymEnquiryTableProps {
  enquiries: GymEnquiry[]
  onAddEnquiry: () => void
  onAddVisit: (enquiryId: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  leadQualityFilter: string
  onLeadQualityChange: (quality: string) => void
}

export function GymEnquiryTable({
  enquiries,
  onAddEnquiry,
  onAddVisit,
  searchQuery,
  onSearchChange,
  leadQualityFilter,
  onLeadQualityChange,
}: GymEnquiryTableProps) {
  const getIssueLevelColorClass = (level: string | undefined) => {
    switch (level?.toLowerCase()) {
      case "urgent":
        return "text-red-600 font-semibold"
      case "high":
        return "text-orange-500 font-medium"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      case "feature":
        return "text-blue-600"
      default:
        return "text-muted-foreground" // For null or undefined
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto my-8">
      <CardHeader className="flex flex-col space-y-4 pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle className="text-2xl font-bold">Gym Enquiries</CardTitle>
            <CardDescription>A list of all gym enquiries in your system.</CardDescription>
          </div>
          <Button onClick={onAddEnquiry} className="w-full md:w-auto">
            Add New Enquiry
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <Label htmlFor="search-input" className="sr-only">
              Search enquiries
            </Label>
            <Input
              id="search-input"
              placeholder="Search by gym name, owner, phone, or location..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-auto">
            <Label htmlFor="lead-quality-filter" className="text-sm font-medium leading-none mb-1 block">
              Lead Quality
            </Label>
            <Select onValueChange={onLeadQualityChange} value={leadQualityFilter}>
              <SelectTrigger id="lead-quality-filter" className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Qualities</SelectItem>
                <SelectItem value="Hot">Hot</SelectItem>
                <SelectItem value="Warm">Warm</SelectItem>
                <SelectItem value="Cold">Cold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {enquiries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery || leadQualityFilter !== "all"
              ? "No matching enquiries found with the current filters."
              : "No enquiries found. Click 'Add New Enquiry' to get started!"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Gym Name</TableHead>
                  <TableHead className="min-w-[200px]">Location</TableHead>
                  <TableHead className="min-w-[150px]">Google Landmark Link</TableHead>
                  <TableHead className="min-w-[150px]">Owner Name</TableHead>
                  <TableHead className="min-w-[100px]">Lead Type</TableHead>
                  <TableHead className="min-w-[100px]">Issue Level</TableHead>
                  <TableHead className="min-w-[250px]">Visits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.map((enquiry) => (
                  <TableRow key={enquiry._id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Link href={`/enquiries/${enquiry._id}`} className="text-blue-600 hover:underline">
                        {enquiry.gymName}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => enquiry._id && onAddVisit(enquiry._id)}
                        title={`Add new visit for ${enquiry.gymName}`}
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span className="sr-only">Add Visit</span>
                      </Button>
                    </TableCell>
                    <TableCell>{`${enquiry.address}, ${enquiry.city}, ${enquiry.pinCode}`}</TableCell>
                    <TableCell>
                      {enquiry.googleMapsLink ? (
                        enquiry.googleMapsLink.startsWith('http') ? (
                          <Link
                            href={enquiry.googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View on Map
                          </Link>
                        ) : (
                          <span className="text-red-600 text-sm">Invalid URL</span>
                        )
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{enquiry.ownerManagerName}</TableCell>
                    <TableCell>{enquiry.leadQuality}</TableCell>
                    <TableCell className={cn(getIssueLevelColorClass(enquiry.issueLevel))}>
                      {enquiry.issueLevel || "-"}
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4">
                        {enquiry.dateOfVisit && (
                          <li>
                            {enquiry.dateOfVisit instanceof Date 
                              ? format(enquiry.dateOfVisit, "PPP") 
                              : format(new Date(enquiry.dateOfVisit), "PPP")} ({enquiry.typeOfInteraction})
                          </li>
                        )}
                        {enquiry.additionalVisits?.map((visit, index) => (
                          <li key={index}>
                            {visit.date instanceof Date 
                              ? format(visit.date, "PPP") 
                              : format(new Date(visit.date), "PPP")} ({visit.type})
                          </li>
                        ))}
                        {!enquiry.dateOfVisit && !enquiry.additionalVisits?.length && <li>No visits recorded</li>}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
