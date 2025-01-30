import { useRef } from "react";
import "./App.css";

function App() {
  const status = useRef<string>("hi");
  return <div>{status.current}</div>;
}

export default App;
