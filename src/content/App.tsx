import { useRef } from "react";
import "./index.css";
function App() {
  const dialogRef = useRef<HTMLDivElement>(null);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <div ref={dialogRef} popover="auto">
      <button
        className="bg-blue-700 text-amber-100 px-2 py-1 rounded-sm relative top-2 left-2"
        onClick={handleClick}
      >
        Pick Area
      </button>
    </div>
  );
}

export default App;
