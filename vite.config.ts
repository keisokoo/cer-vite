import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/background/index.ts"),
        content: resolve(__dirname, "src/content/index.tsx"),
        popup: resolve(__dirname, "src/popup/index.html"),
        options: resolve(__dirname, "src/options/index.html"),
      },
      output: {
        entryFileNames: "scripts/[name].js", // 번들 파일 위치 조정
        chunkFileNames: "scripts/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
  server: {
    watch: {
      usePolling: true, // 파일 변경 감지 향상
    },
    hmr: {
      overlay: false, // HMR 오류가 발생해도 브라우저 콘솔에만 출력 (UI 오류 방지)
    },
  },
});
