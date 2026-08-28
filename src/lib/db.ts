import { getClientPromise } from "./mongodb";

// Atlas M0's shared TLS proxy occasionally rejects a handshake under load
// (ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR) even with a minimal connection pool.
// One retry after a short delay is enough to ride out that transient state;
// getClientPromise() returns a fresh connect() since the failed one clears itself.
export async function getDb() {
  try {
    const client = await getClientPromise();
    return client.db();
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const client = await getClientPromise();
    return client.db();
  }
}
