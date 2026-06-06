"use client";

import { SubmitEvent, useState } from "react";
import { Info } from "lucide-react";
import { useNotification } from "@/components/providers/NotificationProvider";
import { useDialog } from "@/components/providers/DialogProvider";
import { useRouter } from "next/navigation";
import { useRoomInfo } from "@/components/providers/RoomInfoProvider";
import { ui, uiNotification, uiIcon, uiGap, uiTitle, uiInput, uiTextTiny, uiPanel, uiBigPanel } from "@/lib/styles";
import { Button } from "@/components/Button";
import { StyledText } from "@/components/StyledText";

export const LOGIN_KEY = "room login";

export function Login() {
  const { roomId: _roomId, userId: _userId } = useRoomInfo();
  const [roomId, setRoomId] = useState(_roomId ?? "");
  const [userId, setUserId] = useState(_userId ?? "");
  const { closeDialog } = useDialog();
  const router = useRouter();
  const { showNotification } = useNotification();

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const trimmedRoom = roomId.trim();
    const trimmedUser = userId.trim();

    if (trimmedRoom && trimmedUser) {
      const params = new URLSearchParams();
      params.set("room", trimmedRoom);
      params.set("user", trimmedUser);

      router.replace(`/?${params.toString()}`);
      closeDialog(LOGIN_KEY);
    } else {
      showNotification(
        <div className={ui(uiPanel, uiNotification)}>
          <Info className={uiIcon} />
          room or user not set
        </div>
      );
    }
  }

  return (
    <div className={ui("flex flex-col min-w-50 items-center", uiGap, uiBigPanel)}>
      <div className={"flex flex-col items-center"}>
        <div className={uiTitle}>
          <StyledText value="Welcome to $tyle{blue}{Dominoes}" />
        </div>
        <div className={uiTextTiny}>
          Choose a room and user to play
        </div>
      </div>

      <form onSubmit={handleSubmit} className={ui("flex flex-col items-stretch w-full", uiGap)}>
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room"
          className={uiInput}
        />

        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User"
          className={uiInput}
        />

        <Button submit>
          Play
        </Button>
      </form>
    </div>
  );
}