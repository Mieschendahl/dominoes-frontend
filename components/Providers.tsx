"use client";

import { DialogProvider } from "./providers/DialogProvider";
import { GameProvider } from "./providers/GameProvider";
import { NotificationProvider } from "./providers/NotificationProvider";
import { RoomInfoProvider } from "./providers/RoomInfoProvider";
import { SocketProvider } from "./providers/SocketProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
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
    );
}