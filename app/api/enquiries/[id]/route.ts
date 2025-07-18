// app/api/enquiries/[id]/route.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await req.json()

  try {
    const client = await clientPromise
    const db = client.db("gym-tracker")

    // Convert string ID to ObjectId
    const _id = new ObjectId(id)

    // Perform the update
    const result = await db.collection("enquiries").updateOne(
      { _id },
      {
        $set: {
          additionalVisits: body.visits, // ⚠️ your frontend sends this as `visits`
        },
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "Enquiry not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, updatedId: id })
  } catch (error) {
    console.error("Update failed:", error)
    return NextResponse.json({ success: false, message: "Update error", error }, { status: 500 })
  }
}
