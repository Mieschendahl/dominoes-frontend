import { DOMINO_HEIGHT, DOMINO_WIDTH } from "@/components/domino/dimensions";
import { DominoHalfSVG, DominoSVG } from "@/components/domino/domino";
import { useGame } from "@/components/providers/GameProvider";
import { useRoomInfo } from "@/components/providers/RoomInfoProvider";
import { useSocket } from "@/components/providers/SocketProvider";
import { Scrollable } from "@/components/Scrollable";
import { Board, ChainUI, DominoUI } from "@/lib/board";
import { BoardIO, GameIO, ServerData } from "@/shared/socket-types";
import { ui, uiPanel, uiTitleWeak, uiGap, uiGapItems, uiSelectedColor } from "@/lib/styles";
import { useEffect, useMemo, useState } from "react";

type ChainProps = {
    isLeft: boolean;
    chain: ChainUI;
    onClick: () => void;
};

function ChainPanel({ isLeft, chain, onClick }: ChainProps) {
    return (
        <div className={ui(uiPanel, "flex flex-col min-h-0", uiGap)} onClick={onClick}>
            <div className={ui(uiTitleWeak, "mx-auto")}>
                {isLeft ? "Left" : "Right"} Chain
            </div>

            <Scrollable stickToEdge y className={ui("flex-1")}>
                <div
                    className={ui(
                        "flex flex-col justify-start items-center min-w-full min-h-full h-max",
                        uiGapItems
                    )}
                >
                    {chain.map(({ isPreview, domino }: DominoUI, index) => {
                        const isFirstDomino = index === 0;

                        const isRotated =
                            domino.isDouble() && !isFirstDomino;

                        const rotation = isRotated
                            ? "rotate(90deg)"
                            : isLeft
                                ? "rotate(180deg)"
                                : "rotate(0deg)";

                        const width = isRotated
                            ? DOMINO_HEIGHT
                            : DOMINO_WIDTH;

                        const height = isRotated
                            ? DOMINO_WIDTH
                            : isFirstDomino
                                ? DOMINO_HEIGHT / 2
                                : DOMINO_HEIGHT;

                        return (
                            <div
                                key={domino.getId()}
                                className={ui(
                                    "flex items-center justify-center",
                                    isPreview && uiSelectedColor
                                )}
                                style={{ width, height }}
                            >
                                <div
                                    style={{
                                        transform: rotation,
                                        transformOrigin: "center",
                                    }}
                                >
                                    {isFirstDomino ? (
                                        <DominoHalfSVG
                                            domino={domino.toIO()}
                                            firstHalf={isLeft}
                                        />
                                    ) : (
                                        <DominoSVG domino={domino.toIO()} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Scrollable>
        </div>
    );
}

export function BoardPanel() {
    const { socket } = useSocket();
    const { selectedDomino, setSelectedDomino } = useGame();
    const { userId } = useRoomInfo();
    const [board, setBoard] = useState<Board>(new Board());
    const [game, setGame] = useState<GameIO>({
        gameState: "started",
        players: []
    });

    useEffect(() => {
        if (socket == undefined) {
            return;
        }
        function handleData({ kind, data }: ServerData) {
            switch (kind) {
                case "set game":
                    setGame(data);
                    break;
                case "set board":
                    const board = data ? Board.fromIO(data) : new Board();
                    setBoard(board);
                    break;
            }
        }
        socket.on("send", handleData);
        return () => {
            socket.off("send", handleData);
        };
    }, [socket]);

    const boardUI = useMemo(() => {
        board.setPreviewDomino(selectedDomino);
        return board.toUI();
    }, [board, selectedDomino]);

    const isActiveGame = game.gameState === "playing";
    const isActivePlayer = game.activePlayerIndex !== undefined && game.players[game.activePlayerIndex].userId === userId;

    const handlePlaceDomino = (isLeft: boolean) => () => {
        if (socket === undefined || selectedDomino === undefined || !isActiveGame || !isActivePlayer) {
            return;
        }

        if (!board.canPlaceDomino(selectedDomino, isLeft)) {
            return;
        }
        board.realisePreviewDomino(isLeft);

        socket.emit("send", {
            kind: "place domino",
            data: {
                placeLeft: isLeft,
                domino: selectedDomino.toIO(),
            },
        });

        setSelectedDomino();
    };

    return (
        <div className={ui("flex-1 grid grid-cols-2 items-stretch", uiGap)}>
            <ChainPanel
                isLeft={true}
                chain={boardUI.leftChain}
                onClick={handlePlaceDomino(true)}
            />

            <ChainPanel
                isLeft={false}
                chain={boardUI.rightChain}
                onClick={handlePlaceDomino(false)}
            />
        </div>
    );
}