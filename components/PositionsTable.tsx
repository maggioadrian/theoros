"use client";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

type Position = {
  sym: string;
  side: "LONG" | "SHORT";
  qty: number;
  entry: number;
  current: number;
  pnl: number;
  pnlPct: number;
};

const POSITIONS: Position[] = [
  { sym: "AAPL",    side: "LONG",  qty: 150, entry: 182.40,   current: 189.72,  pnl: 1098.00, pnlPct: 4.01  },
  { sym: "NVDA",    side: "LONG",  qty: 40,  entry: 842.10,   current: 875.20,  pnl: 1324.00, pnlPct: 3.93  },
  { sym: "TSLA",    side: "SHORT", qty: 60,  entry: 241.30,   current: 224.18,  pnl: 1027.20, pnlPct: 7.09  },
  { sym: "SPY",     side: "LONG",  qty: 80,  entry: 508.20,   current: 512.34,  pnl: 331.20,  pnlPct: 0.82  },
  { sym: "BTC/USD", side: "LONG",  qty: 0.8, entry: 64200.00, current: 67420.00,pnl: 2576.00, pnlPct: 5.01  },
  { sym: "QQQ",     side: "SHORT", qty: 50,  entry: 443.80,   current: 438.92,  pnl: 244.00,  pnlPct: 1.10  },
  { sym: "GLD",     side: "LONG",  qty: 120, entry: 190.20,   current: 193.45,  pnl: 390.00,  pnlPct: 1.71  },
  { sym: "MSFT",    side: "LONG",  qty: 35,  entry: 408.55,   current: 415.20,  pnl: 232.75,  pnlPct: 1.63  },
];

type SortKey = keyof Position;

export default function PositionsTable() {
  const [sort, setSort] = useState<SortKey>("pnl");
  const [asc, setAsc] = useState(false);

  const sorted = [...POSITIONS].sort((a, b) => {
    const av = a[sort], bv = b[sort];
    if (typeof av === "number" && typeof bv === "number") return asc ? av - bv : bv - av;
    return asc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const Col = ({ label, k, right }: { label: string; k: SortKey; right?: boolean }) => (
    <th
      onClick={() => { sort === k ? setAsc(!asc) : (setSort(k), setAsc(false)); }}
      className={`text-[9px] font-bold tracking-widest text-dim cursor-pointer hover:text-electric transition-colors py-2 px-3 select-none ${right ? "text-right" : "text-left"}`}
    >
      <span className="inline-flex items-center gap-0.5">
        {label}
        {sort === k && <ArrowUpDown size={7} className="text-electric" />}
      </span>
    </th>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <span className="panel-label">Open Positions</span>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-dim">{POSITIONS.length} positions</span>
          <span className="text-[10px] text-profit font-bold num">+$7,223.15</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead className="sticky top-0 bg-panel border-b border-panel">
            <tr>
              <Col label="SYMBOL"  k="sym"    />
              <Col label="SIDE"    k="side"   />
              <Col label="QTY"     k="qty"    right />
              <Col label="ENTRY"   k="entry"  right />
              <Col label="CURRENT" k="current" right />
              <Col label="P&L $"   k="pnl"    right />
              <Col label="P&L %"   k="pnlPct" right />
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr
                key={p.sym}
                className={`border-b border-panel/60 hover:bg-electric/5 transition-colors cursor-default ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}
              >
                <td className="px-3 py-2 font-bold text-foreground tracking-wide">{p.sym}</td>
                <td className="px-3 py-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${p.side === "LONG" ? "text-profit border-profit/25 bg-profit/8" : "text-loss border-loss/25 bg-loss/8"}`}>
                    {p.side}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-dim num">{p.qty}</td>
                <td className="px-3 py-2 text-right text-dim num">${p.entry.toFixed(2)}</td>
                <td className="px-3 py-2 text-right text-foreground num font-semibold">
                  ${p.current.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td className={`px-3 py-2 text-right font-bold num ${p.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                  {p.pnl >= 0 ? "+" : ""}${p.pnl.toFixed(2)}
                </td>
                <td className={`px-3 py-2 text-right font-bold num ${p.pnlPct >= 0 ? "text-profit" : "text-loss"}`}>
                  {p.pnlPct >= 0 ? "+" : ""}{p.pnlPct.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
