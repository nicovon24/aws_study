import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI environment variable");

// Cached on the global object so both dev hot-reloads and warm serverless
// invocations reuse the same connection pool instead of opening a new one
// on every request.
const globalForMongo = global as unknown as { _mongoClientPromise?: Promise<MongoClient> };

function connect(): Promise<MongoClient> {
  // maxPoolSize 1 + minPoolSize 0: each serverless instance opens at most one
  // connection and doesn't keep it idle between invocations. Atlas M0's shared
  // TLS proxy has very limited concurrent-handshake capacity, and with many
  // cold serverless instances connecting at once it responds with
  // ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR instead of a clean connection refusal.
  // family: 4 forces IPv4 — Vercel's runtime resolving Atlas hosts over IPv6
  // is a separate known trigger for the same error mid-handshake.
  const promise = new MongoClient(uri!, {
    maxPoolSize: 1,
    minPoolSize: 0,
    family: 4,
    serverSelectionTimeoutMS: 5000,
  }).connect();
  // If the connection attempt fails, drop the cached promise so the next
  // request retries instead of reusing the same rejected promise forever.
  promise.catch(() => {
    if (globalForMongo._mongoClientPromise === promise) globalForMongo._mongoClientPromise = undefined;
  });
  return promise;
}

const clientPromise = globalForMongo._mongoClientPromise ?? connect();
globalForMongo._mongoClientPromise = clientPromise;

// Re-reads the cached promise each call (not a fixed reference) so that if a
// prior connection attempt failed and cleared the cache, callers retrying
// after a failure pick up a fresh connect() instead of the same dead promise.
export function getClientPromise(): Promise<MongoClient> {
  return globalForMongo._mongoClientPromise ?? (globalForMongo._mongoClientPromise = connect());
}

export default clientPromise;
