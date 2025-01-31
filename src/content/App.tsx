import { useEffect, useRef } from "react";
import "./index.css";
function App() {
  const status = useRef<string>("hello world1");
  useEffect(() => {}, []);
  return (
    <div>
      <div>hello world</div>
      <div className="text-slate-500">{status.current}</div>
    </div>
  );
}

export default App;
