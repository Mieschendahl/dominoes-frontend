"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Info } from "lucide-react";
import { socket, type AppSocket } from "../../lib/socket";
import { useRoomInfo } from "./RoomInfoProvider";
import { ui, uiIcon, uiNotification, uiPanel } from "../../lib/styles";
import { useNotification } from "./NotificationProvider";
import { useRouter } from "next/navigation";
import { JoinRoomCbIO } from "@/shared/socket-types";


type SocketContextValue = {
  socket: AppSocket;
  connected: boolean;
};

const SocketContext = createContext<SocketContextValue>({
  socket,
  connected: socket.connected,
});

type SocketProviderProps = {
  children: ReactNode;
};

export function SocketProvider({ children }: SocketProviderProps) {
  const { roomId, userId } = useRoomInfo();
  const { showNotification } = useNotification();
  const router = useRouter();
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    if (roomId == null || userId == null) {
      return;
    }

    function handleConnect() {
      setConnected(true);

      socket.emit(
        "sendCb",
        {
          kind: "join room",
          data: {
            roomId: roomId ?? "",
            userId: userId ?? ""
          }
        },
        ({kind, data}) => {
          if (kind !== "join room") {
            return;
          }
          const {accepted, reason} = data;

          if (!accepted) {
            const { searchParams } = new URL(window.location.href);
            const roomParam = searchParams.get("room");
            const params = new URLSearchParams();
            if (roomParam !== null) {
              params.set("room", roomParam);
            }
            router.replace(`/?${params.toString()}`);
            showNotification(
              <div className={ui(uiPanel, uiNotification)}>
                <Info className={uiIcon} />
                {reason}
              </div>
            );
          }
        }
      );
    }

    function handleDisconnect() {
      setConnected(false);
    }

    // function handleStartGame({}: startGameS) {
    //   openDialog(
    //     <div className={ui("$pad")}>
    //       <TriangleAlert className={uiIcon} />
    //       {reason}
    //     </div>
    //   );
    // }

    // socket.on("startGame", handleStartGame);
    // socket.on("advanceRound", handleStartGame);
    // socket.on("finishGame", handleStartGame);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.connect();
    return () => {
      // socket.off("startGame", handleStartGame);
      // socket.off("advanceRound", handleStartGame);
      // socket.off("finishGame", handleStartGame);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, [roomId, userId, showNotification]);

  const value = useMemo(
    () => ({
      socket,
      connected,
    }),
    [connected]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}