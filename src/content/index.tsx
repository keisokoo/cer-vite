import React from "react";
import ReactDOM from "react-dom/client";
import { StyleSheetManager } from "styled-components";
import App from "./App";

class Gutaku {
  private parent: HTMLElement;
  private element: HTMLElement;
  private shadow: ShadowRoot;
  private root: ReactDOM.Root | null = null;
  constructor(parent: HTMLElement) {
    this.parent = parent;
    this.element = document.createElement("div");
    this.shadow = this.element.attachShadow({ mode: "open" });
    this.init();
  }
  private init() {
    this.parent.appendChild(this.element);
  }

  private setStyles() {
    const rootStyles = `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        contain: layout paint;
        z-index: 9999;
      }
      :host(:popover-open) {
        top-layer: true;
      }
    `;
    const styles = document.createElement("style");
    styles.textContent = rootStyles;
    this.shadow.appendChild(styles);
  }

  public mount() {
    console.log("mount");
    this.setStyles();
    this.root = ReactDOM.createRoot(this.shadow);
    this.root.render(
      <React.StrictMode>
        <StyleSheetManager target={this.shadow}>
          <App />
        </StyleSheetManager>
      </React.StrictMode>
    );
  }

  public unmount() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.shadow) this.shadow.innerHTML = "";
  }
}

function waitForCustomElements(callback: () => void, retries = 10) {
  if (document.body) {
    console.log("✅ document.body 준비 완료");
    callback();
  } else if (retries > 0) {
    console.log(`⌛ customElements 준비 대기 중... 남은 재시도: ${retries}`);
    setTimeout(() => waitForCustomElements(callback, retries - 1), 500);
  } else {
    console.error("❌ customElements를 사용할 수 없음");
  }
}

waitForCustomElements(() => {
  const gutaku = new Gutaku(document.body);
  gutaku.mount();
});
