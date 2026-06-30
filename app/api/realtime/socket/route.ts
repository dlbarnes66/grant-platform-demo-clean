import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return new Response("Upgrade Required", {
    status: 426,
    headers: { "Upgrade": "websocket" },
  });
}

export async function upgrade(request: Request) {
  const [client, server] = Object.values(new WebSocketPair());
  server.accept();

  server.addEventListener("message", (event) => {
    // Broadcast to all connected clients
    server.send(event.data);
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}
