"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "./useDebouncedValue";

type Status = "idle" | "saving" | "saved";

/** Signed-in user's single note for a service. Loads on mount, autosaves 600ms after typing stops. */
export function useNote(serviceKey: string | null) {
  const { status: sessionStatus } = useSession();
  const signedIn = sessionStatus === "authenticated";
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const debounced = useDebouncedValue(content, 600);
  const loadedFor = useRef<string | null>(null);

  useEffect(() => {
    setContent("");
    setStatus("idle");
    loadedFor.current = null;
    if (!signedIn || !serviceKey) return;
    fetch(`/api/notes/${encodeURIComponent(serviceKey)}`)
      .then((r) => r.json())
      .then((data: { content: string }) => {
        loadedFor.current = serviceKey;
        setContent(data.content);
      });
  }, [serviceKey, signedIn]);

  useEffect(() => {
    // Skip the save that would otherwise fire right after the initial load.
    if (!signedIn || !serviceKey || loadedFor.current !== serviceKey) return;
    setStatus("saving");
    fetch(`/api/notes/${encodeURIComponent(serviceKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: debounced }),
    })
      .then(() => setStatus("saved"))
      .catch(() => setStatus("idle"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return { content, setContent, status, signedIn };
}
