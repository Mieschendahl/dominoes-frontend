export { Socket } from "socket.io-client";

export function noText(obj: any | null) {
  if (obj === undefined || obj === null) {
    return "-";
  }
  return obj;
}

export function getInviteUrl(currentUrl: string): string {
  const { origin, pathname, searchParams } = new URL(currentUrl);

  const roomParam = searchParams.get("room");

  const basePath = pathname.slice(0, pathname.lastIndexOf("/") + 1);

  return roomParam
    ? `${origin}${basePath}?room=${encodeURIComponent(roomParam)}`
    : `${origin}${basePath}`;
}