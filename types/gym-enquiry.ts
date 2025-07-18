export interface GymEnquiry {
  id: string
  gymName: string
  ownerManagerName: string
  phoneNumber: string
  emailAddress: string
  website: string
  address: string
  city: string
  pinCode: string
  googleMapsLink: string
  dateOfFirstContact: Date | undefined
  sourceOfLead: string
  typeOfInteraction: string
  visited: boolean
  dateOfVisit: Date | undefined
  nextFollowUpDate: Date | undefined
  revisitRequired: boolean
  dateOfRevisit: Date | undefined
  leadQuality: string
  clientRequirements: string
  objections: string
  notesRemarks: string
}
