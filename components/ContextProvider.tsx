"use client";
import { ReactNode, createContext, useState } from "react";

interface DataProviderProps {
  children: ReactNode;
}

export const DataContext = createContext({
  breakCounter: 0 as number,
  setBreakCounter: (Number) => {Number+1},
  sessionCounter: 0 as number,
  setSessionCounter: (Number) => {Number+1},
});

export default function DataProvider({ children }: DataProviderProps) {
  const [sessionCounter, setSessionCounter] = useState<number>(0);
  const [breakCounter, setBreakCounter] = useState<number>(0);
  return (
    <DataContext.Provider
      value={{
        sessionCounter,
        setSessionCounter,
        breakCounter,
        setBreakCounter,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
