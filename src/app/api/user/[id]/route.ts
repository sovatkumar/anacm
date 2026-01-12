import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

interface Params {
  id: string;
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise();
    const db = client.db();
    const collection = db.collection("user");

    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid user ID" }), { status: 400 });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const client = await clientPromise();
    const db = client.db();
    const collection = db.collection("user");

    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid user ID" }), { status: 400 });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "User updated successfully" }), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
