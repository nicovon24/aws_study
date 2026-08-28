import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI environment variable");

// Cached across hot reloads in dev so each edit doesn't open a new connection.
const globalForMongo = global as unknown as { _mongoClientPromise?: Promise<MongoClient> };

const clientPromise =
  globalForMongo._mongoClientPromise ?? new MongoClient(uri).connect();

if (process.env.NODE_ENV === "development") {
  globalForMongo._mongoClientPromise = clientPromise;
}

export default clientPromise;
