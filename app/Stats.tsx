import { useSocket } from "@/components/providers/SocketProvider";
import { GameIO, ServerData } from "@/shared/socket-types";
import { ui, uiPanel, uiGap, uiTitleWeak, uiTitle, uiRounded, uiP } from "@/lib/styles";
import { noText } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Stats() {
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

    return (
        <div className={ui(uiPanel, "flex flex-col", uiGap)}>
            <div className={ui("grid grid-cols-2", uiGap)}>
                <div className={ui(uiTitleWeak, "text-center")}>
                    Pile
                </div>
                <div className={ui(uiTitle, "text-center")}>
                    {noText(game.pile)}
                </div>
            </div>
            <div className={ui("grid grid-cols-2", uiGap)}>
                <div className={ui(uiTitleWeak, "text-center")}>
                    Round
                </div>
                <div className={ui(uiTitle, "text-center")}>
                    {noText(game.round)}
                </div>
            </div>
        </div>
    );
}