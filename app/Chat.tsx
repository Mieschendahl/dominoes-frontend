import { Button } from "@/components/Button";
import { useRoomInfo } from "@/components/providers/RoomInfoProvider";
import { useSocket } from "@/components/providers/SocketProvider";
import { GameIO, MessageIO, ServerData } from "@/shared/socket-types";
import { ui, uiPanel, uiGap, uiTitleWeak, uiTitle, uiBgSelected, uiRounded, uiTextTiny, uiGapItems, uiText } from "@/lib/styles";
import { useEffect, useState } from "react";
import { Scrollable } from "@/components/Scrollable";
import { CLASS_TOKEN_MAP, StyledText } from "@/components/StyledText";
import { Popover } from "@/components/Popover";

const EMOTES = [
    "Hi",
    "Yo",
    "Nice move!",
    "Good Game!",
    "It's a trap!",
    "Let's go",
    "Please wait",
    "OK",
    "Let's chat",
    "Good Bye",
    "Ciao"
] as const;

export function Chat() {
    const { userId } = useRoomInfo();
    const { socket } = useSocket();
    const [messages, setMessage] = useState<MessageIO[]>([]);

    useEffect(() => {
        if (socket == undefined) {
            return;
        }
        function handleData({ kind, data }: ServerData) {
            switch (kind) {
                case "set messages":
                    setMessage(data);
                    break;
                case "add messages":
                    setMessage(messages => messages.concat(data));
            }
        }
        socket.on("send", handleData);
        return () => {
            socket.off("send", handleData);
        };
    }, [socket]);

    return (
        <div className={ui(uiPanel, "flex-1 flex flex-col", uiGap, "justify-between overflow-hidden")}>
            <Scrollable stickToEdge y className={ui("flex-1")}>
                <div className={ui("flex flex-col justify-start", uiGap)}>
                    {messages.map(({ kind, data }, index) => {
                        let style;
                        let label;
                        let text;
                        switch (kind) {
                            case "system":
                                label = "System";
                                style = CLASS_TOKEN_MAP["grey"];
                                text = data;
                                break;
                            case "user":
                                const { userId, text: text_ } = data;
                                label = userId;
                                style = CLASS_TOKEN_MAP["grey"] + " " + CLASS_TOKEN_MAP["italic"];
                                text = text_;
                                break;
                        }
                        return (
                            <div className={ui("flex flex-col", uiPanel, "text-center")} key={index}>
                                <div className={ui(uiTextTiny, style)}>
                                    {label}
                                </div>
                                {text.map((t, i) => {
                                    return <StyledText value={t} className={ui(uiText)} key={i}></StyledText>;
                                })}
                            </div>
                        );
                    })}
                </div>
            </Scrollable>
            <Popover
                placement="top-center"
                trigger={({ toggle }) => (
                    <Button onClick={toggle} disabled={undefined} className={ui("w-full")}>
                        Emote
                    </Button>
                )}
                child={({ close }) => (
                    <div className={ui(uiPanel, "flex flex-wrap gap-2 backdrop-blur justify-center items-center")}>
                        {EMOTES.map(emote => {
                            const handleClick = () => {
                                socket?.emit("send", {
                                    kind: "add messages",
                                    data: [[emote]]
                                })
                                close();
                            };
                            return (
                                <Button key={emote} onClick={handleClick}>
                                    {emote}
                                </Button>
                            )
                        })}
                    </div>
                )}
                width="trigger"
            />
        </div>
    );
}