"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useFavorites, useReviewed } from "@/hooks";
import { usePersistedState } from "./usePersistedState";
import type { StudyPriority } from "@/lib/types";

const ALL_PRIORITIES: StudyPriority[] = [1, 2, 3];

export type StudyFilters = {
  onlyFavorites: boolean;
  setOnlyFavorites: React.Dispatch<React.SetStateAction<boolean>>;
  onlyUnreviewed: boolean;
  setOnlyUnreviewed: React.Dispatch<React.SetStateAction<boolean>>;
  priorities: Set<StudyPriority>;
  setPriorities: (next: Set<StudyPriority>) => void;
  favSignedIn: boolean;
  revSignedIn: boolean;
  /** True when the item passes every active filter. */
  matches: (itemKey: string, priority: StudyPriority) => boolean;
  /** True when anything is narrowed down from the default. */
  anyActive: boolean;
  reset: () => void;
};

/**
 * The favorites/reviewed/priority filter set shared by the catalog and the map,
 * persisted per view in localStorage. `Set` can't round-trip through JSON, so
 * priorities are stored as a sorted array.
 */
export function useStudyFilters(scope: string): StudyFilters {
  const { isFavorite, signedIn: favSignedIn } = useFavorites();
  const { isReviewed, signedIn: revSignedIn } = useReviewed();

  const [onlyFavorites, setOnlyFavorites] = usePersistedState(`filters:${scope}:favorites`, false);
  const [onlyUnreviewed, setOnlyUnreviewed] = usePersistedState(`filters:${scope}:unreviewed`, false);
  const [priorityList, setPriorityList] = usePersistedState<StudyPriority[]>(
    `filters:${scope}:priorities`,
    ALL_PRIORITIES,
  );

  // A signed-out user can't have favorites or reviewed marks, so those filters
  // would silently hide everything.
  useEffect(() => {
    if (!favSignedIn) setOnlyFavorites(false);
  }, [favSignedIn, setOnlyFavorites]);

  useEffect(() => {
    if (!revSignedIn) setOnlyUnreviewed(false);
  }, [revSignedIn, setOnlyUnreviewed]);

  const priorities = useMemo(() => new Set(priorityList), [priorityList]);

  // Stable across renders: the map's layout effect re-runs whenever this changes.
  const matches = useCallback(
    (itemKey: string, priority: StudyPriority) =>
      (!onlyFavorites || isFavorite(itemKey)) &&
      (!onlyUnreviewed || !isReviewed(itemKey)) &&
      priorities.has(priority),
    [onlyFavorites, onlyUnreviewed, priorities, isFavorite, isReviewed],
  );

  return {
    onlyFavorites,
    setOnlyFavorites,
    onlyUnreviewed,
    setOnlyUnreviewed,
    priorities,
    setPriorities: (next) => setPriorityList([...next].sort()),
    favSignedIn,
    revSignedIn,
    matches,
    anyActive: onlyFavorites || onlyUnreviewed || priorityList.length < ALL_PRIORITIES.length,
    reset: () => {
      setOnlyFavorites(false);
      setOnlyUnreviewed(false);
      setPriorityList(ALL_PRIORITIES);
    },
  };
}
