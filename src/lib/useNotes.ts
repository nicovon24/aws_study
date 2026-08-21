"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const KEY = "aws-map:notes";
const SAVE_DELAY = 500;

/**
 * Per-service notes, persisted to localStorage and written back debounced so
 * typing does not hit storage on every keystroke.
 */
export function useNotes() {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read after mount only: localStorage does not exist during server render.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setNotes(JSON.parse(raw));
    } catch {
      /* corrupt or unavailable storage — start empty */
    }
  }, []);

  const setNote = useCallback((id: string, value: string) => {
    setNotes((prev) => {
      const next = { ...prev, [id]: value };
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        try {
          window.localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          /* quota or private mode — notes stay in memory for this session */
        }
      }, SAVE_DELAY);
      return next;
    });
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return { notes, setNote };
}
