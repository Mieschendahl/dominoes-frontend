// Room.tsx

"use client";

import { Button } from "@/components/Button";
import { useRoomInfo } from "@/components/providers/RoomInfoProvider";
import { useNotification } from "@/components/providers/NotificationProvider";
import { getInviteUrl } from "@/lib/utils";
import {
  ui,
  uiNotification,
  uiIcon,
  uiPanel,
  uiGap,
  uiTitleWeak,
  uiTitle,
} from "@/lib/styles";
import { Check } from "lucide-react";
import { Login, LOGIN_KEY } from "./Login";
import { useDialog } from "@/components/providers/DialogProvider";

export function Room() {
  const { roomId, userId } = useRoomInfo();
  const { showNotification } = useNotification();
  const { openDialog } = useDialog();

  const handleInvite = async () => {
    const inviteUrl = getInviteUrl(window.location.href);

    await navigator.clipboard.writeText(inviteUrl);

    showNotification(
      <div className={ui(uiPanel, uiNotification)}>
        <Check className={uiIcon} />
        copied invite link
      </div>
    );
  };

  const handleEdit = async () => {
    openDialog(<Login />, { key: LOGIN_KEY });
  };

  return (
    <div className={ui(uiPanel, "flex flex-col", uiGap)}>
      <div className={ui("grid grid-cols-2", uiGap)}>
        <div className={ui(uiTitleWeak, "text-center")}>Room</div>
        <div className={ui(uiTitleWeak, "text-center")}>User</div>
      </div>

      <div className={ui("grid grid-cols-2", uiGap)}>
        <div className={ui(uiTitle, "truncate text-center")}>
          {roomId}
        </div>

        <div className={ui(uiTitle, "truncate text-center")}>
          {userId}
        </div>
      </div>

      <div className={ui("grid grid-cols-2", uiGap)}>
        <Button onClick={handleInvite}>
          Invite
        </Button>
        <Button onClick={handleEdit}>
          Edit
        </Button>
      </div>
    </div>
  );
}