import { invoke } from "@tauri-apps/api/tauri";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "./ContextProvider";

export default function Counter() {
  const { sessionCounter, setSessionCounter, breakCounter, setBreakCounter } =
    useContext(DataContext);
  const [sessionString, setSessionString] = useState<string>("");
  const [breakString, setBreakString] = useState<string>("");

  useEffect(() => {
    invoke<string>("session_counter", { value: sessionCounter })
      .then((result) => setSessionString(result))
      .catch(console.error);
  }, [sessionCounter]);

  useEffect(() => {
    invoke<string>("break_counter", { value: breakCounter })
      .then((result) => setBreakString(result))
      .catch(console.error);
  }, [breakCounter]);

  return (
    <div>
      <div>{sessionString}</div>
      <div>{breakString}</div>
    </div>
  );
}
