import { exec } from "child_process";
import chokidar from "chokidar";
import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3001 });

console.log("🚀 WebSocket 서버 실행 중 (포트: 3001)");

const watcher = chokidar.watch("src", {
  ignored: /(^|[/\\])\../,
  persistent: true,
  usePolling: true,
  interval: 100,
  awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 },
});

wss.on("connection", (ws) => {
  console.log("🔗 클라이언트 연결됨");

  watcher.on("change", (path) => {
    console.log(`📂 파일 변경 감지됨: ${path}, Vite 빌드 실행 중...`);

    exec("bun run build:dev", (err, stdout, stderr) => {
      if (err) {
        console.error("❌ 빌드 오류:", stderr);
        return;
      }
      console.log("✅ 빌드 완료!\n", stdout);

      // WebSocket을 통해 background에 변경 사항 전송
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send("reload");
          console.log("📤 WebSocket으로 reload 메시지 전송");
        } else {
          console.log("⚠️ WebSocket이 아직 연결되지 않음");
        }
      });
    });
  });
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

console.log("🔍 파일 변경 감지 중...");
