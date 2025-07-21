import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { auth } from "@clerk/nextjs/server"

async function getUserIdOr401() {
  const { userId } = await auth();
  if (!userId) throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return userId;
}

export async function GET(req: Request, context: any) {
  try {
    const userId = await getUserIdOr401();
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
    if (enquiry.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(enquiry)
  } catch (err) {
    return err instanceof Response ? err : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const userId = await getUserIdOr401();
    const params = await context.params
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const body = await req.json()
    const { _id, ...updateData } = body

    const client = await clientPromise
    const db = client.db("gym-tracker")

    // Only update if the enquiry belongs to the user
    const result = await db.collection("enquiries").updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { ...updateData, userId } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Enquiry not found or forbidden" }, { status: 404 })
    }

    const updatedEnquiry = await db
      .collection("enquiries")
      .findOne({ _id: new ObjectId(id) })

    return NextResponse.json(updatedEnquiry)
  } catch (err) {
    return err instanceof Response ? err : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const userId = await getUserIdOr401();
    const params = await context.params
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("gym-tracker")

    // Only delete if the enquiry belongs to the user
    const result = await db.collection("enquiries").deleteOne({ _id: new ObjectId(id), userId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Enquiry not found or forbidden" }, { status: 404 })
    }

    return NextResponse.json({ message: "Enquiry deleted" })
  } catch (err) {
    return err instanceof Response ? err : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
