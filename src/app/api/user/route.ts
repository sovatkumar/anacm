import clientPromise from '@/app/lib/mongodb';

export async function POST(req:any) {
  try {
    const body = await req.json();
    const { name, email, zip, phone } = body;
    if (!name || !email || !zip || !phone) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('user');
    await collection.insertOne({
      name,
      email,
      zip,
      phone,
      createdAt: new Date()
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Add Dispute Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to add dispute' }), { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("user");

    const { searchParams } = new URL(req.url);
    const zip = searchParams.get("zip");

    if (!zip) {
      return new Response(
        JSON.stringify({ error: "ZIP query parameter is required" }),
        { status: 400 }
      );
    }

    const users: any = await collection
      .find({ zip })
      .project({ _id: 0, email: 1, phone: 1 })
      .toArray();

    if (users.length === 0) {
      return new Response(
        JSON.stringify({ message: "Invalid zip code", data: [] }),
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