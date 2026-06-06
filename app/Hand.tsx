import { Button } from "@/components/Button";
import { DominoSVG } from "@/components/domino/domino";
import { useGame } from "@/components/providers/GameProvider";
import { useRoomInfo } from "@/components/providers/RoomInfoProvider";
import { useSocket } from "@/components/providers/SocketProvider";
import { Scrollable } from "@/components/Scrollable";
import { Board } from "@/lib/board";
import { Domino, moveDomino } from "@/lib/domino";
import { Hand } from "@/lib/hand";
import { BoardIO, GameIO, HandIO, ServerData } from "@/shared/socket-types";
import {
    ui,
    uiPanel,
    uiGap,
    uiTitleWeak,
    uiGapItems,
    uiRounded,
    uiSelectedColor,
    uiTextWeak,
    uiTitle,
} from "@/lib/styles";
import { useEffect, useMemo, useState } from "react";

export function HandPanel() {
    const { socket } = useSocket();
    const { selectedDomino, setSelectedDomino } = useGame();
    const { userId } = useRoomInfo();
    const [board, setBoard] = useState<Board>(new Board());
    const [hand, setHand] = useState<Hand>(new Hand());
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
                    const board = data ?  Board.fromIO(data) : new Board();
                    setBoard(board);
                    break;
                case "set hand":
                    const hand = data ?  Hand.fromIO(data) : new Hand();
                    setHand(hand);
                    break;
            }
        }
        socket.on("send", handleData);
        return () => {
            socket.off("send", handleData);
        };
    }, [socket]);

    function updateHand(nextHand: Domino[]) {
        setHand(new Hand(nextHand));

        socket?.emit("send", {
            kind: "set hand",
            data: new Hand(nextHand).toIO(),
        });
    }

    function handleSelect(clickedDomino: Domino) {
        if (selectedDomino === undefined) {
            setSelectedDomino(clickedDomino);
            return;
        }

        const clickedSelectedDomino =
            selectedDomino.isEqual(clickedDomino);

        if (clickedSelectedDomino) {
            const nextHand = hand.dominos.map((domino) => {
                if (!domino.isEqual(clickedDomino)) {
                    return domino;
                }

                return domino.flip();
            });

            updateHand(nextHand);
            setSelectedDomino(undefined);
            return;
        }

        const nextHand = moveDomino(
            hand.dominos,
            selectedDomino,
            clickedDomino
        );

        updateHand(nextHand);
        requestAnimationFrame(() => {
            setSelectedDomino(undefined);
        });
    }

    const isActiveGame = game.gameState === "playing";
    const isActivePlayer = game.activePlayerIndex !== undefined && game.players[game.activePlayerIndex].userId === userId;
    const [canDraw, canPass] = useMemo(() => {
        // console.log("checkign", game.gameState, isActivePlayer, hand.dominos.length, board.leftChain.dominoes.length)
        if (!isActiveGame || !isActivePlayer || hand.dominos.length === 0) {
            return [false, false];
        }
        if (board.leftChain.dominoes.length === 0) {
            return [false, false];
        }
        const leftPip = board.leftChain.dominoes.slice(-1)[0].leftPip;
        const rightPip = board.rightChain.dominoes.slice(-1)[0].rightPip;
        const canPlace = hand.dominos.some(domino => {
            if (domino.hasMatch(leftPip) || domino.hasMatch(rightPip)) {
                return true;
            }
        });
        // console.log("can place???")
        if (canPlace) {
            return [false, false];
        }
        const canDraw = game.pile! > 0;
        return [canDraw, !canDraw];
    }, [board, hand, game]);

    const handleDraw = () => socket?.emit("send", { kind: "draw domino" });
    const handlePass = () => socket?.emit("send", { kind: "pass turn" });

    return (
        <div
            className={ui(
                "flex-1",
                uiPanel,
                "flex flex-col",
                uiGap,
                "justify-between min-w-0"
            )}
            onClick={() => setSelectedDomino(undefined)}
        >
            <div className={ui("flex justify-between", uiGap)}>
                <div className={ui("flex-1")}></div>
                <span className={ui(uiTitleWeak, "flex-1 text-center")}>Hand</span>
                <span className={ui(uiTitle, "flex-1 text-end")}>{isActiveGame ? isActivePlayer ? "active" : "inactive" : ""}</span>
            </div>

            <Scrollable stickToEdge x className={ui("flex-1")}>
                <div
                    className={ui(
                        "flex justify-center items-center min-h-full min-w-full w-max",
                        uiGapItems
                    )}
                >
                    {hand.dominos.map((domino) => {
                        const selected = selectedDomino?.isEqual(domino) ?? false;

                        return (
                            <div
                                key={domino.getId()}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleSelect(domino);
                                }}
                                className={ui(selected && uiSelectedColor)}
                            >
                                <DominoSVG domino={domino.toIO()}></DominoSVG>
                            </div>
                        );
                    })}
                </div>
            </Scrollable>

            <div className={ui("grid grid-cols-2", uiGap, "items-center")}>
                <Button disabled={!canDraw} onClick={handleDraw}>
                    Draw
                </Button>

                <Button disabled={!canPass} onClick={handlePass}>
                    Pass
                </Button>
            </div>
        </div>
    );
}