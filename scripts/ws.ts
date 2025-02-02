import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3001 });

console.log("🚀 WebSocket 서버 실행 중 (포트: 3001)");

wss.on("connection", (ws) => {
  console.log("🔗 클라이언트 연결됨");

  ws.on("message", (message) => {
    console.log("📩 메시지 수신:", message.toString());

    const messageType = message.toString();

    if (messageType === "reload") {
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("❌ 클라이언트 연결 종료");
  });
});
