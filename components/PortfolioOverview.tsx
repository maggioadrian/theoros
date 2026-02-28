"use client";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const alloc = [
  { label: "EQUITY", pct: 62, color: "bg-electric" },
  { label: "CRYPTO", pct: 24, color: "bg-profit" },
  { label: "CASH",   pct: 10, color: "bg-warn" },
  { label: "HEDGE",  pct:  4, color: "bg-loss" },
];

export default function PortfolioOverview() {
  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <span className="panel-label">Portfolio Overview</span>
        <div className="flex items-center gap-1.5">
          <DollarSign size={10} className="text-electric" />
          <span className="text-[9px] text-dim">PAPER ACCOUNT</span>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4 overflow-auto">

        {/* NAV — hero stat */}
        <div className="border border-electric/20 rounded-sm bg-electric/[0.04] p-4">
          <div className="text-[9px] text-dim tracking-[0.2em] mb-2">NET ASSET VALUE</div>
          <div className="text-3xl font-black text-foreground num tracking-tight">$284,192.40</div>
          <div className="flex items-center gap-2 mt-1.5">
            <TrendingUp size={11} className="text-profit" />
            <span className="text-profit font-bold text-sm num">+$3,841.20</span>
            <span className="text-profit text-sm num">+1.37%</span>
            <span className="text-dim text-[10px]">today</span>
          </div>
        </div>

        {/* Secondary stats — 3 across */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "DAY P&L",    value: "+$3,841",   pct: "+1.37%", up: true  },
            { label: "UNREALIZED", value: "+$12,441",  pct: "+4.56%", up: true  },
            { label: "MAX DD",     value: "-$2,105",   pct: "-0.74%", up: false },
          ].map((s) => (
            <div key={s.label} className="bg-background/50 border border-panel rounded-sm p-3">
              <div className="text-[8px] text-dim tracking-widest mb-1.5">{s.label}</div>
              <div className={`text-base font-bold num ${s.up ? "text-profit" : "text-loss"}`}>
                {s.value}
              </div>
              <div className={`text-[10px] num mt-0.5 ${s.up ? "text-profit/70" : "text-loss/70"}`}>
                {s.pct}
              </div>
            </div>
          ))}
        </div>

        {/* Allocation bar */}
        <div>
          <div className="text-[9px] text-dim tracking-widest mb-2">ALLOCATION</div>
          <div className="flex rounded-sm overflow-hidden h-2.5 gap-px mb-2.5">
            {alloc.map((a) => (
              <div key={a.label} className={`${a.color}`} style={{ width: `${a.pct}%` }} />
            ))}
          </div>
          <div className="flex gap-4">
            {alloc.map((a) => (
              <div key={a.label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-sm ${a.color}`} />
                <span className="text-[9px] text-dim">{a.label}</span>
                <span className="text-[10px] text-foreground num font-semibold">{a.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk metrics */}
        <div className="grid grid-cols-3 gap-2 mt-auto">
          {[
            { k: "SHARPE",   v: "2.14"  },
            { k: "BETA",     v: "0.83"  },
            { k: "WIN RATE", v: "68.4%" },
          ].map((m) => (
            <div key={m.k} className="text-center border border-panel rounded-sm py-2.5 bg-background/40">
              <div className="text-[8px] text-dim tracking-wider mb-1">{m.k}</div>
              <div className="text-sm font-bold text-electric num">{m.v}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
