import { exec } from "child_process";
import chokidar from "chokidar";
import WebSocketClient from "ws";

console.log("🔍 파일 변경 감지 중...");

const wss = new WebSocketClient("ws://localhost:3001");

wss.on("open", () => {
  console.log("🔗 클라이언트 연결됨");
});

chokidar
  .watch("src", {
    ignored: /(^|[/\\])\../,
    persistent: true,
    usePolling: true,
    interval: 100,
    awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 },
  })
  .on("change", (path) => {
    console.log(`📂 파일 변경 감지됨: ${path}, Vite 빌드 실행 중...`);
    exec("bun run build:dev", (err, stdout, stderr) => {
      if (err) {
        console.error("❌ 빌드 오류:", stderr);
        return;
      }
      console.log("✅ 빌드 완료!\n", stdout);
      // WebSocket을 통해 background에 변경 사항 전송
      wss.send("reload");
      console.log("📤 WebSocket으로 reload 메시지 전송");
    });
  });
