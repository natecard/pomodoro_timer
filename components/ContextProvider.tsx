"use client";
import { ReactNode, createContext, useState } from "react";

interface DataProviderProps {
  children: ReactNode;
}

export const DataContext = createContext({
  breakCounter: 0 as Number,
  setBreakCounter: (Number: Number) => {},
  sessionCounter: 0 as Number,
  setSessionCounter: (Number: Number) => {},
});

export default function DataProvider({ children }: DataProviderProps) {
  const [sessionCounter, setSessionCounter] = useState<Number>(0);
  const [breakCounter, setBreakCounter] = useState<Number>(0);
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
