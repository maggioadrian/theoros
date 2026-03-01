"use client";
import { useState } from "react";
import { ArrowUpDown, RefreshCw, AlertCircle } from "lucide-react";
import { usePortfolioData } from "@/contexts/PortfolioContext";
import type { AccountPosition } from "@/hooks/usePortfolio";

const ACCT_LABEL: Record<string, string> = {
  "28837196": "CORP",
  "52562659": "TFSA",
  "27452266": "MRGN",
};

type Row = AccountPosition & { openPnlPct: number };
type SortKey = keyof Row;

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export default function PositionsTable() {
  const { positions, totalOpenPnl, loading, error, refresh } = usePortfolioData();
  const [sort, setSort] = useState<SortKey>("openPnl");
  const [asc, setAsc] = useState(false);

  const rows: Row[] = positions.map((p) => ({
    ...p,
    openPnlPct: p.totalCost !== 0 ? (p.openPnl / Math.abs(p.totalCost)) * 100 : 0,
  }));

  const sorted = [...rows].sort((a, b) => {
    const av = a[sort], bv = b[sort];
    if (typeof av === "number" && typeof bv === "number") return asc ? av - bv : bv - av;
    return asc
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const Col = ({ label, k, right }: { label: string; k: SortKey; right?: boolean }) => (
    <th
      onClick={() => sort === k ? setAsc(!asc) : (setSort(k), setAsc(false))}
      className={`text-[9px] font-bold tracking-widest text-dim cursor-pointer hover:text-electric transition-colors py-2 px-3 select-none ${right ? "text-right" : "text-left"}`}
    >
      <span className="inline-flex items-center gap-0.5">
        {label}
        {sort === k && <ArrowUpDown size={7} className="text-electric" />}
      </span>
    </th>
  );

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="panel-header"><span className="panel-label">Open Positions</span></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-dim text-[10px] flex items-center gap-2">
            <RefreshCw size={10} className="animate-spin text-electric" />
            Loading positions…
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="panel-header"><span className="panel-label">Open Positions</span></div>
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <AlertCircle size={16} className="text-loss" />
          <div className="text-loss text-[10px]">{error}</div>
          <button onClick={refresh} className="text-[9px] text-electric hover:underline">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <span className="panel-label">Open Positions</span>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-dim">{positions.length} positions</span>
          <span className={`text-[10px] font-bold num ${totalOpenPnl >= 0 ? "text-profit" : "text-loss"}`}>
            {totalOpenPnl >= 0 ? "+" : ""}${fmt(totalOpenPnl)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead className="sticky top-0 bg-panel border-b border-panel">
            <tr>
              <Col label="SYMBOL"  k="symbol" />
              <Col label="ACCT"    k="accountId" />
              <Col label="QTY"     k="openQuantity"      right />
              <Col label="ENTRY"   k="averageEntryPrice" right />
              <Col label="CURRENT" k="currentPrice"      right />
              <Col label="P&L $"   k="openPnl"           right />
              <Col label="P&L %"   k="openPnlPct"        right />
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr
                key={`${p.accountId}-${p.symbol}`}
                className={`border-b border-panel/60 hover:bg-electric/5 transition-colors cursor-default ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}
              >
                <td className="px-3 py-2 font-bold text-foreground tracking-wide">{p.symbol}</td>
                <td className="px-3 py-2">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border text-electric border-electric/25 bg-electric/10">
                    {ACCT_LABEL[p.accountId] ?? p.accountId}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-dim num">
                  {p.openQuantity.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-right text-dim num">
                  ${fmt(p.averageEntryPrice)}
                </td>
                <td className="px-3 py-2 text-right text-foreground num font-semibold">
                  ${fmt(p.currentPrice)}
                </td>
                <td className={`px-3 py-2 text-right font-bold num ${p.openPnl >= 0 ? "text-profit" : "text-loss"}`}>
                  {p.openPnl >= 0 ? "+" : "-"}${fmt(Math.abs(p.openPnl))}
                </td>
                <td className={`px-3 py-2 text-right font-bold num ${p.openPnlPct >= 0 ? "text-profit" : "text-loss"}`}>
                  {p.openPnlPct >= 0 ? "+" : ""}{p.openPnlPct.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
