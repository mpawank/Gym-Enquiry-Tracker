import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params // Await the params Promise
    const client = await clientPromise
    const db = client.db("gym-tracker")

    const enquiry = await db
      .collection("enquiries")
      .findOne({ _id: new ObjectId(id) })

    if (!enquiry) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    return NextResponse.json(enquiry)
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
