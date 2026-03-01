"use client";
import { useState, useEffect, useCallback } from "react";
import { getAccounts, getBalances, getPositions } from "@/lib/api";
import type { Account, Position } from "@/lib/api";

export type AccountPosition = Position & {
  accountId: string;
  accountType: string;
  accountClientType: string;
};

export type PortfolioData = {
  accounts: Account[];
  positions: AccountPosition[];
  totalEquityUSD: number;
  totalMarketValue: number;
  totalOpenPnl: number;
  totalClosedPnl: number;
  totalCashUSD: number;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
};

export function usePortfolio(pollMs = 30_000): PortfolioData {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [positions, setPositions] = useState<AccountPosition[]>([]);
  const [totalEquityUSD, setTotalEquityUSD] = useState(0);
  const [totalMarketValue, setTotalMarketValue] = useState(0);
  const [totalOpenPnl, setTotalOpenPnl] = useState(0);
  const [totalClosedPnl, setTotalClosedPnl] = useState(0);
  const [totalCashUSD, setTotalCashUSD] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const accts = await getAccounts();
      setAccounts(accts);

      const results = await Promise.all(
        accts.map(async (a) => ({
          account: a,
          balances: await getBalances(a.number),
          positions: await getPositions(a.number),
        }))
      );

      let equityUSD = 0, mvUSD = 0, openPnl = 0, closedPnl = 0, cashUSD = 0;
      const allPositions: AccountPosition[] = [];

      for (const { account, balances, positions } of results) {
        const usdBal = balances.combinedBalances.find((b) => b.currency === "USD");
        if (usdBal) {
          equityUSD += usdBal.totalEquity;
          mvUSD += usdBal.marketValue;
          cashUSD += usdBal.cash;
        }
        for (const p of positions) {
          openPnl += p.openPnl;
          closedPnl += p.closedPnl;
          allPositions.push({
            ...p,
            accountId: account.number,
            accountType: account.type,
            accountClientType: account.clientAccountType,
          });
        }
      }

      setTotalEquityUSD(equityUSD);
      setTotalMarketValue(mvUSD);
      setTotalOpenPnl(openPnl);
      setTotalClosedPnl(closedPnl);
      setTotalCashUSD(cashUSD);
      setPositions(allPositions);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load portfolio data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, pollMs);
    return () => clearInterval(id);
  }, [load, pollMs]);

  return {
    accounts,
    positions,
    totalEquityUSD,
    totalMarketValue,
    totalOpenPnl,
    totalClosedPnl,
    totalCashUSD,
    loading,
    error,
    lastUpdated,
    refresh: load,
  };
}
