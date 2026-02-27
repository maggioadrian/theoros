"use client";
import { useState } from "react";
import { ArrowUpDown, X } from "lucide-react";

type Position = {
  sym: string;
  side: "LONG" | "SHORT";
  qty: number;
  entry: number;
  current: number;
  pnl: number;
  pnlPct: number;
  value: number;
  strategy: string;
  age: string;
};

const POSITIONS: Position[] = [
  { sym: "AAPL", side: "LONG", qty: 150, entry: 182.40, current: 189.72, pnl: 1098.00, pnlPct: 4.01, value: 28458.00, strategy: "MOMENTUM", age: "2d 4h" },
  { sym: "NVDA", side: "LONG", qty: 40, entry: 842.10, current: 875.20, pnl: 1324.00, pnlPct: 3.93, value: 35008.00, strategy: "BREAKOUT", age: "5h 12m" },
  { sym: "TSLA", side: "SHORT", qty: 60, entry: 241.30, current: 224.18, pnl: 1027.20, pnlPct: 7.09, value: 13450.80, strategy: "REVERSAL", age: "1d 1h" },
  { sym: "SPY", side: "LONG", qty: 80, entry: 508.20, current: 512.34, pnl: 331.20, pnlPct: 0.82, value: 40987.20, strategy: "TREND", age: "8h 30m" },
  { sym: "BTC/USD", side: "LONG", qty: 0.8, entry: 64200.00, current: 67420.00, pnl: 2576.00, pnlPct: 5.01, value: 53936.00, strategy: "CRYPTO-MM", age: "3d 7h" },
  { sym: "QQQ", side: "SHORT", qty: 50, entry: 443.80, current: 438.92, pnl: 244.00, pnlPct: 1.10, value: 21946.00, strategy: "HEDGE", age: "6h 14m" },
  { sym: "GLD", side: "LONG", qty: 120, entry: 190.20, current: 193.45, pnl: 390.00, pnlPct: 1.71, value: 23214.00, strategy: "MACRO", age: "4d 2h" },
  { sym: "MSFT", side: "LONG", qty: 35, entry: 408.55, current: 415.20, pnl: 232.75, pnlPct: 1.63, value: 14532.00, strategy: "MOMENTUM", age: "1d 9h" },
];

type SortKey = keyof Position;

export default function PositionsTable() {
  const [sort, setSort] = useState<SortKey>("pnl");
  const [asc, setAsc] = useState(false);

  const sorted = [...POSITIONS].sort((a, b) => {
    const av = a[sort];
    const bv = b[sort];
    if (typeof av === "number" && typeof bv === "number")
      return asc ? av - bv : bv - av;
    return asc
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const toggleSort = (key: SortKey) => {
    if (sort === key) setAsc(!asc);
    else { setSort(key); setAsc(false); }
  };

  const th = (label: string, key: SortKey, align = "left") => (
    <th
      key={key}
      onClick={() => toggleSort(key)}
      className={`text-[9px] font-bold tracking-widest text-dim cursor-pointer hover:text-electric transition-colors py-1.5 px-2 text-${align} select-none`}
    >
      <span className="inline-flex items-center gap-0.5">
        {label}
        <ArrowUpDown size={7} className={sort === key ? "text-electric" : ""} />
      </span>
    </th>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <span className="panel-label">Open Positions</span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-dim">{POSITIONS.length} active</span>
          <span className="text-[9px] text-profit font-bold">+$7,223.15 total</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead className="sticky top-0 bg-panel border-b border-panel">
            <tr>
              {th("SYMBOL", "sym")}
              {th("SIDE", "side")}
              {th("QTY", "qty", "right")}
              {th("ENTRY", "entry", "right")}
              {th("CURRENT", "current", "right")}
              {th("P&L $", "pnl", "right")}
              {th("P&L %", "pnlPct", "right")}
              {th("VALUE", "value", "right")}
              {th("STRATEGY", "strategy")}
              {th("AGE", "age")}
              <th className="w-6" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr
                key={p.sym}
                className={`border-b border-panel hover:bg-electric/5 transition-colors ${
                  i % 2 === 0 ? "bg-background/20" : ""
                }`}
              >
                <td className="px-2 py-1.5 font-bold text-foreground">{p.sym}</td>
                <td className="px-2 py-1.5">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      p.side === "LONG"
                        ? "text-profit border-profit/30 bg-profit/10"
                        : "text-loss border-loss/30 bg-loss/10"
                    }`}
                  >
                    {p.side}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-right text-dim num">{p.qty}</td>
                <td className="px-2 py-1.5 text-right text-dim num">${p.entry.toFixed(2)}</td>
                <td className="px-2 py-1.5 text-right text-foreground num font-semibold">
                  ${p.current.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td className={`px-2 py-1.5 text-right font-bold num ${p.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                  {p.pnl >= 0 ? "+" : ""}${p.pnl.toFixed(2)}
                </td>
                <td className={`px-2 py-1.5 text-right font-bold num ${p.pnlPct >= 0 ? "text-profit" : "text-loss"}`}>
                  {p.pnlPct >= 0 ? "+" : ""}{p.pnlPct.toFixed(2)}%
                </td>
                <td className="px-2 py-1.5 text-right text-dim num">
                  ${p.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-2 py-1.5">
                  <span className="text-[9px] text-electric/70 border border-electric/20 px-1.5 py-0.5 rounded">
                    {p.strategy}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-dim text-[10px] num">{p.age}</td>
                <td className="px-2 py-1.5">
                  <button className="text-dim hover:text-loss transition-colors">
                    <X size={10} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
