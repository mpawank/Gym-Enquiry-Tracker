import mongoose, { Schema, models, model } from "mongoose";

const EnquirySchema = new Schema(
  {
    /* ─ Basic Gym Info ─ */
    gymName: String,
    ownerManagerName: String,
    phoneNumber: String,
    emailAddress: String,
    website: String,
    address: String,
    city: String,
    pinCode: String,
    googleMapsLink: String,

    /* ─ Interaction & Visit ─ */
    dateOfFirstContact: Date,
    sourceOfLead: String,
    typeOfInteraction: String,
    visited: Boolean,
    dateOfVisit: Date,
    nextFollowUpDate: Date,
    revisitRequired: Boolean,
    dateOfRevisit: Date,

    /* ─ Notes & Issue Tracking ─ */
    leadQuality: String,
    clientRequirements: String,
    objections: String,
    notesRemarks: String,

    /* ─ NEW Issue-tracking fields ─ */
    issueLevel: { type: String, default: "Medium" },
    issueDate: Date,
    issueStatus: { type: String, default: "Open" },

    /* ─ Optional array of extra visits ─ */
    additionalVisits: [
      {
        date: Date,
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

export const Enquiry = models.Enquiry || model("Enquiry", EnquirySchema);
