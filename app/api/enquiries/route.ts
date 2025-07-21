// app/api/enquiries/route.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise
  const db = client.db("gym-tracker")
  const enquiries = await db.collection("enquiries").find({ userId }).toArray()

  const formattedEnquiries = enquiries.map((enquiry) => ({
    ...enquiry,
    _id: enquiry._id.toString(),
  }))

  return NextResponse.json(formattedEnquiries)
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json()
  const client = await clientPromise
  const db = client.db("gym-tracker")

  const result = await db.collection("enquiries").insertOne({ ...body, userId })

  return NextResponse.json({ insertedId: result.insertedId.toString() })
}
