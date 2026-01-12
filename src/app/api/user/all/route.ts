import getMongoClient from "@/app/lib/mongodb";

export async function GET() {
  try {
    const client = await getMongoClient();
    const db = client.db();
    const collection = db.collection("user");

    const users = await collection
      .find({})
      .project({
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        zip: 1,
        zipRanges: 1
      })
      .toArray();

    if (!users.length) {
      return new Response(
        JSON.stringify({ message: "No users found", data: [] }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: `Found ${users.length} user(s)`,
        data: users
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fetch All Users Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch users",
        details: error.message
      }),
      { status: 500 }
    );
  }
}
