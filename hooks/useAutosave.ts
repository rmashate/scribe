"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AutosaveOptions {
  data: { title: string; content: string };
  postId: string;
  interval?: number; // milliseconds
  onSave?: () => void;
  onError?: (error: Error) => void;
}

export function useAutosave({
  data,
  postId,
  interval = 30000, // 30 seconds default
  onSave,
  onError,
}: AutosaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const lastSavedData = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentDataString = JSON.stringify(data);

  // Track if data has changed since last save
  useEffect(() => {
    if (currentDataString !== lastSavedData.current) {
      setHasUnsavedChanges(true);
    }
  }, [currentDataString]);

  const save = useCallback(async () => {
    if (!data.title.trim()) return;
    if (currentDataString === lastSavedData.current) return;

    setIsSaving(true);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to autosave");
      }

      lastSavedData.current = currentDataString;
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      onSave?.();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error("Autosave failed"));
    } finally {
      setIsSaving(false);
    }
  }, [data, postId, currentDataString, onSave, onError]);

  // Set up autosave interval
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (hasUnsavedChanges && data.title.trim()) {
      timeoutRef.current = setTimeout(() => {
        save();
      }, interval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, data.title, interval, save]);

  // Initialize lastSavedData on mount
  useEffect(() => {
    lastSavedData.current = currentDataString;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    save,
  };
}
