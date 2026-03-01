"use client";
import { createContext, useContext, ReactNode } from "react";
import { usePortfolio, PortfolioData } from "@/hooks/usePortfolio";

const PortfolioContext = createContext<PortfolioData | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const data = usePortfolio(30_000);
  return (
    <PortfolioContext.Provider value={data}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioData(): PortfolioData {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolioData must be inside <PortfolioProvider>");
  return ctx;
}
