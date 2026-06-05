export { Socket } from "socket.io-client";

export function noText(obj: string | number | undefined | null): string | number | undefined | null {
  if (obj === undefined || obj === null) {
    return "-";
  }
  return obj;
}

export function getInviteUrl(currentUrl: string): string {
  const url = new URL(currentUrl);

  const room = url.searchParams.get("room");

  return room
    ? `${url.origin}${url.pathname}?room=${encodeURIComponent(room)}`
    : `${url.origin}${url.pathname}`;
}