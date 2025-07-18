// app/api/enquiries/route.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  const client = await clientPromise
  const db = client.db("gym-tracker")
  const enquiries = await db.collection("enquiries").find().toArray()

  const formattedEnquiries = enquiries.map((enquiry) => ({
    ...enquiry,
    id: enquiry._id.toString(), 
    _id: undefined,
  }))

  return NextResponse.json(formattedEnquiries)
}

export async function POST(req: Request) {
  const body = await req.json()
  const client = await clientPromise
  const db = client.db("gym-tracker")
  const result = await db.collection("enquiries").insertOne(body)
  return NextResponse.json({ insertedId: result.insertedId })
}
