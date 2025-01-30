function reloadCurrentActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.reload(tab.id);
      }
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("🚀 확장 프로그램 시작됨 - Content Script Inject");
  reloadCurrentActiveTab();
});
const ws = new WebSocket("ws://localhost:3001");

ws.onopen = () => {
  console.log("✅ WebSocket 연결됨 (background.ts)");
};

ws.onmessage = (event) => {
  console.log("📩 WebSocket 메시지 수신:", event.data);

  if (event.data === "reload") {
    console.log("🔄 확장 프로그램 자동 리로드 실행!");
    chrome.runtime.reload();
  }
};

ws.onclose = () => {
  console.log("❌ WebSocket 연결 종료됨. 3초 후 재연결 시도...");
};

chrome.runtime.onStartup.addListener(() => {
  console.log("🚀 확장 프로그램 시작됨");
});
