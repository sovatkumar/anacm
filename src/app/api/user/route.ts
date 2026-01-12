import clientPromise from '@/app/lib/mongodb';

export async function POST(req: any) {
  try {
    const body = await req.json();
    const { name, email, phone, zipRanges } = body;
    if (!name || !email || !phone || !zipRanges || !Array.isArray(zipRanges) || zipRanges.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid required fields" }),
        { status: 400 }
      );
    }
    for (const range of zipRanges) {
      if (
        typeof range.start !== "number" ||
        typeof range.end !== "number" ||
        range.start > range.end
      ) {
        return new Response(
          JSON.stringify({ error: "Invalid ZIP range format" }),
          { status: 400 }
        );
      }
    }

    const client = await clientPromise();
    const db = client.db();
    const collection = db.collection("user");
    await collection.insertOne({
      name,
      email,
      phone,
      zipRanges,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ success: true, message: "User created successfully" }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Add user Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to add user" }),
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const client = await clientPromise();
    const db = client.db();
    const collection = db.collection("user");
    const { searchParams } = new URL(req.url);
    const zip = Number(searchParams.get("zip"));

    if (!zip) {
      return new Response(
        JSON.stringify({ error: "ZIP query parameter is required" }),
        { status: 400 }
      );
    }
    const users: any = await collection
      .find({
        zipRanges: {
          $elemMatch: {
            start: { $lte: zip },
            end: { $gte: zip },
          },
        },
      })
      .project({ _id: 0, email: 1, phone: 1,name:1 })
      .toArray();

    if (users.length === 0) {
      return new Response(
        JSON.stringify({ message: "No users found for this ZIP", data: [] }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: `Found ${users.length} user(s) for ZIP ${zip}`,
        data: users,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fetch Users Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch users", details: error.message }),
      { status: 500 }
    );
  }
}
