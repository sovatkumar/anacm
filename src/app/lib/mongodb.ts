import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env");
}

declare global {
  var _mongo: {
    client: MongoClient | null;
    promise: Promise<MongoClient> | null;
  } | undefined;
}

let cached = global._mongo;

if (!cached) {
  cached = global._mongo = {
    client: null,
    promise: null,
  };
}

export default async function getMongoClient() {
  if (cached!.client) {
    return cached!.client;
  }

  if (!cached!.promise) {
    const client = new MongoClient(uri);
    cached!.promise = client.connect();
  }

  cached!.client = await cached!.promise;
  return cached!.client;
}
