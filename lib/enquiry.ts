import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

// Get all enquiries
export async function getAllEnquiries() {
  const client = await clientPromise
  const db = client.db("gym-tracker")
  const enquiries = await db.collection("enquiries").find().sort({ createdAt: -1 }).toArray()
  return enquiries
}

// Get a single enquiry by ID
export async function getEnquiryById(id: string) {
  try {
    const client = await clientPromise
    const db = client.db("gym-tracker")
    const enquiry = await db.collection("enquiries").findOne({ id })
    return enquiry
  } catch (error) {
    return null
  }
}

// Create a new enquiry
export async function addEnquiry(data: any) {
  const client = await clientPromise
  const db = client.db("gym-tracker")
  const objectId = new ObjectId()
  const result = await db.collection("enquiries").insertOne({
    ...data,
    _id: objectId,
    id: objectId.toHexString(), // store id as string
    createdAt: new Date()
  })
  const insertedEnquiry = await db.collection("enquiries").findOne({ id: objectId.toHexString() })
  return insertedEnquiry
}

// Update an enquiry by ID
export async function updateEnquiry(id: string, data: any) {
  const client = await clientPromise
  const db = client.db("gym-tracker")
  const result = await db.collection("enquiries").findOneAndUpdate(
    { id },
    { $set: data },
    { returnDocument: "after" }
  )
  return result ? result.value : null
}

// Delete an enquiry
export async function deleteEnquiry(id: string) {
  const client = await clientPromise
  const db = client.db("gym-tracker")
  const result = await db.collection("enquiries").deleteOne({ id })
  return result.deletedCount === 1
}
