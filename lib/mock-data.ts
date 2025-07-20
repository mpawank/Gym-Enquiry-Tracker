import type { GymEnquiry, AdditionalVisit } from "./types"

// Make this array mutable for demonstration purposes
export let mockEnquiries: GymEnquiry[] = [
  {
   _id: "1",
    gymName: "Powerhouse Gym",
    ownerManagerName: "John Smith",
    phoneNumber: "111-222-3333",
    emailAddress: "john@powerhouse.com",
    website: "https://www.powerhousegym.com",
    address: "123 Fitness Ave",
    city: "Metropolis",
    pinCode: "10001",
    googleMapsLink: "https://maps.app.goo.gl/example1",
    dateOfFirstContact: new Date("2024-01-15"),
    sourceOfLead: "Walk-in",
    typeOfInteraction: "Visit",
    visited: true,
    dateOfVisit: new Date("2024-01-15"),
    nextFollowUpDate: new Date("2024-01-22"),
    revisitRequired: false,
    dateOfRevisit: undefined,
    leadQuality: "Hot",
    clientRequirements: "Looking for full gym management suite, integrated access control.",
    objections: "None",
    notesRemarks: "Very interested, sent proposal. Follow-up crucial.",
    issueLevel: "High",
    issueDate: new Date("2024-01-15"), // Added issue date
    issueStatus: "Open", // Added issue status
    additionalVisits: [
      {
        date: new Date("2024-01-18"),
        type: "Call",
        notes: "Followed up on proposal, client reviewing.",
        nextVisitDate: new Date("2024-01-25"),
      },
      {
        date: new Date("2024-01-20"),
        type: "Email",
        notes: "Sent pricing details and feature breakdown.",
        nextVisitDate: new Date("2024-01-28"),
      },
    ],
  },
  {
    _id: "2",
    gymName: "Urban Fitness",
    ownerManagerName: "Sarah Connor",
    phoneNumber: "444-555-6666",
    emailAddress: "sarah@urbanfit.com",
    website: "https://www.urbanfitness.com",
    address: "456 City Rd",
    city: "Gotham",
    pinCode: "20002",
    googleMapsLink: "https://maps.app.goo.gl/example2",
    dateOfFirstContact: new Date("2024-02-01"),
    sourceOfLead: "Facebook Ad",
    typeOfInteraction: "Email",
    visited: false,
    dateOfVisit: undefined,
    nextFollowUpDate: new Date("2024-02-08"),
    revisitRequired: true,
    dateOfRevisit: new Date("2024-02-15"),
    leadQuality: "Warm",
    clientRequirements: "Needs membership management and booking system, but on a tight budget.",
    objections: "Price is a bit high, concerned about implementation time.",
    notesRemarks: "Scheduled a demo for next week. Emphasize cost-effectiveness.",
    issueLevel: "Medium",
    issueDate: new Date("2024-02-03"), // Added issue date
    issueStatus: "In Progress", // Added issue status
    additionalVisits: [
      {
        date: new Date("2024-02-05"),
        type: "Demo",
        notes: "Conducted online demo, showed basic features.",
        nextVisitDate: new Date("2024-02-10"),
      },
    ],
  },
  {
    _id: "3",
    gymName: "Zenith Athletics",
    ownerManagerName: "Michael Jordan",
    phoneNumber: "777-888-9999",
    emailAddress: "mike@zenith.com",
    website: "https://www.zenithathletics.com",
    address: "789 Peak Blvd",
    city: "Olympus",
    pinCode: "30003",
    googleMapsLink: "https://maps.app.goo.gl/example3",
    dateOfFirstContact: new Date("2024-03-10"),
    sourceOfLead: "Referral",
    typeOfInteraction: "Call",
    visited: true,
    dateOfVisit: new Date("2024-03-12"),
    nextFollowUpDate: new Date("2024-03-20"),
    revisitRequired: false,
    dateOfRevisit: undefined,
    leadQuality: "Hot",
    clientRequirements: "Looking for a robust CRM and reporting features.",
    objections: "None",
    notesRemarks: "Referred by existing client. Very promising lead.",
    issueLevel: "Urgent",
    issueDate: new Date("2024-03-10"), // Added issue date
    issueStatus: "Open", // Added issue status
    additionalVisits: [],
  },
]

export function getEnquiryById(id: string): GymEnquiry | undefined {
  return mockEnquiries.find((e) => e._id === id)
}

export function addEnquiry(newEnquiry: Omit<GymEnquiry, "id">): GymEnquiry {
  const id = (
    mockEnquiries.length > 0
      ? Math.max(...mockEnquiries.map((e) => parseInt(e.id))) + 1
      : 1
  ).toString()

  const enquiryWithId: GymEnquiry = { id, ...newEnquiry }
  mockEnquiries.push(enquiryWithId)
  return enquiryWithId
}

export function updateEnquiry(updatedEnquiry: GymEnquiry): GymEnquiry | undefined {
  const index = mockEnquiries.findIndex((e) => e._id === updatedEnquiry._id)
  if (index !== -1) {
    mockEnquiries[index] = updatedEnquiry
    return mockEnquiries[index]
  }
  return undefined
}

export function deleteEnquiry(id: string): boolean {
  const initialLength = mockEnquiries.length
  mockEnquiries = mockEnquiries.filter((e) => e._id !== id)
  return mockEnquiries.length < initialLength
}

export function addVisitToEnquiry(enquiryId: string, visit: AdditionalVisit): GymEnquiry | undefined {
  const enquiry = getEnquiryById(enquiryId)
  if (enquiry) {
    enquiry.additionalVisits = [...(enquiry.additionalVisits || []), visit]
    return updateEnquiry(enquiry)
  }
  return undefined
}
