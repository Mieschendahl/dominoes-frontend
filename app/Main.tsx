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
    <div className={ui("min-h-full w-max min-w-full max-h-screen flex items-stretch justify-between", uiP)}>
      <div></div>
      <div className={ui("flex min-w-400 max-w-400 justify-center min-h-300", uiGap)}>
        <div className={ui("flex-1 flex flex-col", uiGap, "overflow-hidden justify-end")}>
          <Room></Room>
          <Chat></Chat>
          <div className={ui("min-h-100 flex flex-col", uiGap)}>
            <Stats></Stats>
            <Players></Players>
          </div>
        </div>
        <div className={ui("flex-2 flex flex-col", uiGap, "overflow-hidden")}>
          <div className={ui("flex-1 flex items-stretch", uiGap)}>
            <BoardPanel></BoardPanel>
          </div>
          <div className={ui("min-h-100 max-h-100 flex items-stretch")}>
            <HandPanel></HandPanel>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}