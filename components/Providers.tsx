"use client";

import { Suspense } from "react";
import { DialogProvider } from "./providers/DialogProvider";
import { GameProvider } from "./providers/GameProvider";
import { NotificationProvider } from "./providers/NotificationProvider";
import { RoomInfoProvider } from "./providers/RoomInfoProvider";
import { SocketProvider } from "./providers/SocketProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={null}>
            <RoomInfoProvider>
                <NotificationProvider>
                    <DialogProvider>
                        <SocketProvider>
                            <GameProvider>
                                {children}
                            </GameProvider>
                        </SocketProvider>
                    </DialogProvider>
                </NotificationProvider>
            </RoomInfoProvider>
        </Suspense>
    );
}