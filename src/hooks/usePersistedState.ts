"use client";

import { useEffect, useState } from "react";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    // Private mode, blocked storage, or corrupt JSON.
    return fallback;
  }
}

/**
 * `useState` backed by localStorage, so filters survive a refresh and later
 * visits.
 *
 * The value can't be read during the first render — the server has no
 * localStorage, and returning something different on the client would break
 * hydration. So it's applied in a mount effect, and `hydratedKey` is state
 * rather than a ref on purpose: the write effect must stay off for the whole
 * commit that reads, otherwise it would run with the default still in `value`
 * and overwrite what was stored.
 */
export function usePersistedState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initial);
  const [hydratedKey, setHydratedKey] = useState<string | null>(null);

  useEffect(() => {
    setValue(read(key, initial));
    setHydratedKey(key);
    // `initial` is intentionally not a dependency: a caller passing a fresh
    // object/array literal each render would otherwise re-hydrate forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (hydratedKey !== key) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Nothing to do — the filter still works for this render.
    }
  }, [key, value, hydratedKey]);

  return [value, setValue];
}
