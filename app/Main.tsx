"use client";

import { useDialog } from "@/components/providers/DialogProvider";
import { useRoomInfo } from "@/components/providers/RoomInfoProvider";
import { useEffect } from "react";
import { Login, LOGIN_KEY } from "./Login";
import { ui, uiP, uiGap } from "@/lib/styles";
import { Room } from "./Room";
import { Players } from "./Players";
import { HandPanel } from "./Hand";
import { BoardPanel } from "./Board";
import { Stats } from "./Stats";
import { Chat } from "./Chat";

export default function Main() {
  const { openDialog } = useDialog();
  const { roomId, userId } = useRoomInfo();

  useEffect(() => {
    if (!roomId || !userId) {
      openDialog(<Login />, { key: LOGIN_KEY });
    }
  }, [roomId, userId, openDialog]);

  return (
    <div className={ui("w-lvw h-lvh grid place-items-center")}>
      <div className={ui("flex justify-center h-full max-h-300 min-h-150 w-200 p-5", uiGap)}>
        <div className={ui("flex-1 flex flex-col", uiGap, "overflow-hidden justify-end")}>
          <Room></Room>
          <Chat></Chat>
          <Stats></Stats>
          <Players></Players>
        </div>
        <div className={ui("flex-2 flex flex-col", uiGap, "overflow-hidden")}>
          <div className={ui("flex-1 flex items-stretch min-h-0 h-full", uiGap)}>
            <BoardPanel></BoardPanel>
          </div>
          <div className={ui("flex items-stretch h-45")}>
            <HandPanel></HandPanel>
          </div>
        </div>
      </div>
    </div>
  );
}