import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../shared/socket-types";

const stage = process.env.NEXT_PUBLIC_STAGE!;

const config = {
  local: {
    origin: "http://localhost:4000",
  },
  test: {
    origin: "https://test.dominoes.goolagoon.org"
  },
  prod: {
    origin: "https://dominoes.goolagoon.org",
  },
}[stage]!;

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const socket: AppSocket = io(config.origin, {
  path: "/api",
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});