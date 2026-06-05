import { Button } from "@/components/Button";
import { useRoomInfo } from "@/components/providers/RoomInfoProvider";
import { useSocket } from "@/components/providers/SocketProvider";
import { GameIO, ServerData } from "@/shared/socket-types";
import { ui, uiPanel, uiGap, uiTitleWeak, uiTitle, uiBgSelected, uiRounded } from "@/lib/styles";
import { noText } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Players() {
    const { userId } = useRoomInfo();
    const { socket } = useSocket();
    const [game, setGame] = useState<GameIO>({
        gameState: "started",
        players: []
    });

    useEffect(() => {
        if (socket == undefined) {
            return;
        }
        function handleData({kind, data}: ServerData) {
            switch (kind) {
                case "set game":
                    setGame(data);
                    break;
            }
        }
        socket.on("send", handleData);
        return () => {
            socket.off("send", handleData);
        };
    }, [socket]);

    const isPlayer = game.players.some(player => player.userId === userId);

    let disabledJoin = game.gameState !== "started";
    let joinText = "";
    let joinHandler = () => { };
    if (isPlayer) {
        joinText = "Leave";
        joinHandler = () => socket.emit("send", { kind: "leave players" });
    } else {
        joinText = "Join";
        joinHandler = () => socket.emit("send", { kind: "join players" });
        if (game.players.length >= 4) {
            disabledJoin = true;
        }
    }

    let disabledStart = !isPlayer;
    let startText = "";
    let startHandler = () => { };
    switch (game.gameState) {
        case "started":
            if (game.players.length < 2) {
                disabledStart = true;
            }
            startText = "Start";
            startHandler = () => socket.emit("send", { kind: "start game" });
            break;
        case "playing":
            disabledStart = true;
        case "waiting":
            startText = "Continue";
            startHandler = () => socket.emit("send", { kind: "advance round" });
            break;
        case "finished":
            startText = "Finish";
            startHandler = () => socket.emit("send", { kind: "finish game" });
            break;
    }

    const activePlayerUserId = game.activePlayerIndex === undefined ? undefined : game.players[game.activePlayerIndex].userId;

    return (
        <div className={ui(uiPanel, "flex-1 flex flex-col", uiGap, "justify-between")}>
            <div className={ui("grid grid-cols-3", uiGap)}>
                <div className={ui(uiTitleWeak, "text-center")}>
                    Player
                </div>
                <div className={ui(uiTitleWeak, "text-center")}>
                    Score
                </div>
                <div className={ui(uiTitleWeak, "text-center")}>
                    Hand
                </div>

                {game.players.map(player => (
                    <div
                        key={player.userId}
                        className={ui("grid grid-cols-subgrid col-span-3", uiRounded, player.userId === activePlayerUserId && uiBgSelected)}
                    >
                        <div className={ui(uiTitle, "text-center")}>
                            {noText(player.userId)}
                        </div>

                        <div className={ui(uiTitle, "text-center")}>
                            {noText(player.score)}
                        </div>

                        <div className={ui(uiTitle, "text-center")}>
                            {noText(player.hand)}
                        </div>
                    </div>
                ))}
            </div>
            <div className={ui("grid grid-cols-2", uiGap)}>
                <Button onClick={joinHandler} disabled={disabledJoin}>
                    {joinText}
                </Button>
                <Button onClick={startHandler} disabled={disabledStart}>
                    {startText}
                </Button>
            </div>
        </div>
    );
}