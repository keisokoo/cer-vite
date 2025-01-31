import { useEffect, useRef } from "react";
import "./App.css";
function App() {
  const status = useRef<string>("he2y");
  useEffect(() => {}, []);
  return <div>{status.current}</div>;
}

export default App;
