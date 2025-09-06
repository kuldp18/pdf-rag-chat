"use client";
import { createContext, useContext, useState } from "react";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export default function AppProvider({ children }) {
  const [filename, setFilename] = useState("");
  return (
    <AppContext.Provider value={{ filename, setFilename }}>
      {children}
    </AppContext.Provider>
  );
}
