"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

type RoomInfoContextValue = {
  roomId: string | null;
  userId: string | null;
};

const RoomInfoContext = createContext<RoomInfoContextValue | null>(null);

export function RoomInfoProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();

  const value = useMemo(() => {
    return {
      roomId: searchParams.get("room"),
      userId: searchParams.get("user")
    };
  }, [searchParams]);

  return (
    <RoomInfoContext.Provider value={value}>
      {children}
    </RoomInfoContext.Provider>
  );
}

export function useRoomInfo() {
  const ctx = useContext(RoomInfoContext);

  if (!ctx) {
    throw new Error("RoomInfo must be used inside RoomInfoProvider");
  }

  return ctx;
}