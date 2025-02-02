import { useRef } from "react";
import "./index.css";

function App() {
  const dialogRef = useRef<HTMLDivElement>(null);

  // 영역 선택 기능을 초기화하는 함수
  const startAreaPicker = () => {
    // 오버레이 요소 생성 (투명한 노란색)
    const overlay = document.createElement("div");
    overlay.id = "area-picker-overlay";
    overlay.style.position = "absolute";
    overlay.style.backgroundColor = "rgba(255, 255, 0, 0.3)"; // 투명한 노란색
    overlay.style.pointerEvents = "none"; // 마우스 이벤트 무시
    overlay.style.border = "2px dashed yellow";
    overlay.style.zIndex = "9999";
    document.body.appendChild(overlay);

    // 마우스 무브 이벤트: 현재 마우스가 올려진 요소의 위치와 크기로 오버레이 업데이트
    const mouseMoveHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      overlay.style.left = rect.left + "px";
      overlay.style.top = rect.top + "px";
      overlay.style.width = rect.width + "px";
      overlay.style.height = rect.height + "px";
    };

    // 클릭 이벤트: 선택된 영역 내의 미디어 URL을 추출
    const clickHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // 이벤트 리스너와 오버레이 제거
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("click", clickHandler, true);
      overlay.remove();

      const target = e.target as HTMLElement;
      console.log(
        "target",
        target,
        target.matches("img, video, source, figure")
      );
      // 타겟 요소가 img, video, source, figure 등에 해당되면 직접 추가하고,
      // 그 하위 요소들도 모두 선택합니다.
      const mediaElements: HTMLElement[] = [];
      if (target.matches("img, video, source, figure, svg")) {
        mediaElements.push(target);
      }
      mediaElements.push(
        ...(Array.from(
          target.querySelectorAll("img, video, source, figure, svg")
        ) as HTMLElement[])
      );

      const mediaUrls: string[] = [];

      const extractUrlsFromElement = (el: HTMLElement): string[] => {
        const urls: string[] = [];
        // 기본적으로 확인할 속성들
        const attributes = ["src", "data-src", "data-original", "srcset"];
        attributes.forEach((attr) => {
          const value = el.getAttribute(attr);
          if (value) {
            if (attr === "srcset") {
              // srcset은 여러 URL을 포함할 수 있음 (예: "url1 1x, url2 2x")
              value.split(",").forEach((v) => {
                const url = v.trim().split(" ")[0];
                if (url) urls.push(url);
              });
            } else {
              urls.push(value);
            }
          }
        });

        // 인라인 스타일의 background-image 체크
        const backgroundImage = window
          .getComputedStyle(el)
          .getPropertyValue("background-image");
        if (backgroundImage && backgroundImage !== "none") {
          const match = backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
          if (match && match[1]) {
            urls.push(match[1]);
          }
        }

        // video 태그인 경우 poster 속성 및 자식 source 태그 검사
        if (el.tagName.toLowerCase() === "video") {
          const poster = el.getAttribute("poster");
          if (poster) urls.push(poster);
          el.querySelectorAll("source").forEach((sourceEl) => {
            const s = (sourceEl as HTMLElement).getAttribute("src");
            if (s) urls.push(s);
          });
        }

        // 만약 엘리멘트가 svg라면, outerHTML을 이용하여 data URL로 변환합니다.
        if (el.tagName.toLowerCase() === "svg") {
          console.log("svg", el);
          try {
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(el);
            // 유니코드 문자가 포함될 수 있으므로 인코딩 처리를 합니다.
            const encodedData = btoa(unescape(encodeURIComponent(svgString)));
            const dataUrl = `data:image/svg+xml;base64,${encodedData}`;
            urls.push(dataUrl);
          } catch (err) {
            console.error("SVG를 data URL로 변환하는데 실패했습니다.", err);
          }
        }

        return urls;
      };

      mediaElements.forEach((el) => {
        mediaUrls.push(...extractUrlsFromElement(el));
      });

      console.log("수집된 미디어 URL:", mediaUrls);
      // TODO: mediaUrls를 활용한 후속 처리 로직 추가 가능
    };

    // 이벤트 리스너 추가
    document.addEventListener("mousemove", mouseMoveHandler);
    // 클릭 이벤트는 캡처 단계에서 처리하여 미리 선택 (추후 다른 이벤트와의 충돌 방지)
    document.addEventListener("click", clickHandler, true);
  };

  // Pick Area 버튼 클릭 시 영역 선택 모드를 시작
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    startAreaPicker();
  };

  return (
    <div ref={dialogRef} className="relative top-2 left-2">
      <button
        className="bg-blue-700 text-amber-100 px-2 py-1 rounded-sm"
        onClick={handleClick}
      >
        Pick Area
      </button>
    </div>
  );
}

export default App;
