import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function GET(req: Request, context: any) {
  const params = await context.params
  const { id } = params

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db("gym-tracker")

  const enquiry = await db.collection("enquiries").findOne({ _id: new ObjectId(id) })

  if (!enquiry) {
    return NextResponse.json({ message: "Enquiry not found" }, { status: 404 })
  }

  return NextResponse.json(enquiry)
}

export async function PUT(req: Request, context: any) {
  const params = await context.params
  const { id } = params

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  const body = await req.json()

  // Remove _id from the update data since it's immutable
  const { _id, ...updateData } = body

  const client = await clientPromise
  const db = client.db("gym-tracker")

  const result = await db.collection("enquiries").updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ message: "Enquiry not found" }, { status: 404 })
  }

  // Return the updated enquiry
  const updatedEnquiry = await db
    .collection("enquiries")
    .findOne({ _id: new ObjectId(id) })

  return NextResponse.json(updatedEnquiry)
}

export async function DELETE(req: Request, context: any) {
  const params = await context.params
  const { id } = params

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db("gym-tracker")

  const result = await db.collection("enquiries").deleteOne({ _id: new ObjectId(id) })

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "Enquiry not found" }, { status: 404 })
  }

  return NextResponse.json({ message: "Enquiry deleted" })
}
