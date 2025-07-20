export type AdditionalVisit = {
  date: Date
  type: string // e.g., Call, Visit, Email, Demo, WhatsApp
  notes?: string
  nextVisitDate?: Date // New field for next follow-up date for this specific visit
}

export type GymEnquiry = {
  _id?: string
  id?: string
  gymName: string
  ownerManagerName: string
  phoneNumber: string
  emailAddress: string
  website?: string
  address: string
  city: string
  pinCode: string
  googleMapsLink?: string
  dateOfFirstContact: Date | undefined
  sourceOfLead: string
  typeOfInteraction: string // This is the initial interaction type
  visited: boolean
  dateOfVisit?: Date // Initial visit date
  nextFollowUpDate?: Date // Overall next follow-up date for the enquiry
  revisitRequired: boolean
  dateOfRevisit?: Date
  leadQuality: string
  clientRequirements?: string
  objections?: string
  notesRemarks?: string
  additionalVisits?: AdditionalVisit[] // For subsequent visits
  issueLevel: string // Urgent, High, Medium, Low, Feature
  issueDate?: Date // New field: Date when the issue was identified
  issueStatus: string // New field: Open, In Progress, Resolved, Closed
}
