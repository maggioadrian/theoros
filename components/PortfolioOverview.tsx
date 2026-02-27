"use client";
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from "lucide-react";

const stats = [
  { label: "NAV", value: "$284,192.40", change: "+$3,841.20", pct: "+1.37%", up: true },
  { label: "DAY P&L", value: "+$3,841.20", change: "vs. yesterday", pct: "+1.37%", up: true },
  { label: "UNREALIZED", value: "+$12,440.80", change: "8 open positions", pct: "+4.56%", up: true },
  { label: "DRAWDOWN", value: "-$2,104.50", change: "max -$8,220.10", pct: "-0.74%", up: false },
];

const alloc = [
  { label: "EQUITY", pct: 62, color: "bg-electric" },
  { label: "CRYPTO", pct: 24, color: "bg-profit" },
  { label: "CASH", pct: 10, color: "bg-warn" },
  { label: "HEDGE", pct: 4, color: "bg-loss" },
];

export default function PortfolioOverview() {
  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <span className="panel-label">Portfolio Overview</span>
        <div className="flex items-center gap-2">
          <DollarSign size={10} className="text-electric" />
          <span className="text-[9px] text-dim">PAPER ACCOUNT</span>
        </div>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-3 overflow-auto">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-background/60 border border-panel rounded p-2.5"
            >
              <div className="text-[9px] text-dim tracking-widest mb-1">{s.label}</div>
              <div
                className={`text-sm font-bold num ${
                  s.up ? "text-profit" : "text-loss"
                }`}
              >
                {s.value}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {s.up ? (
                  <TrendingUp size={9} className="text-profit" />
                ) : (
                  <TrendingDown size={9} className="text-loss" />
                )}
                <span className={`text-[9px] num ${s.up ? "text-profit" : "text-loss"}`}>
                  {s.pct}
                </span>
                <span className="text-[9px] text-dim">{s.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Allocation */}
        <div>
          <div className="text-[9px] text-dim tracking-widest mb-2">ALLOCATION</div>
          <div className="flex rounded overflow-hidden h-2 gap-px mb-2">
            {alloc.map((a) => (
              <div
                key={a.label}
                className={`${a.color} transition-all`}
                style={{ width: `${a.pct}%` }}
              />
            ))}
          </div>
          <div className="flex gap-3 flex-wrap">
            {alloc.map((a) => (
              <div key={a.label} className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-sm ${a.color}`} />
                <span className="text-[9px] text-dim">{a.label}</span>
                <span className="text-[9px] text-foreground num">{a.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk metrics */}
        <div className="grid grid-cols-3 gap-2 mt-auto">
          {[
            { k: "SHARPE", v: "2.14" },
            { k: "BETA", v: "0.83" },
            { k: "WIN RATE", v: "68.4%" },
          ].map((m) => (
            <div key={m.k} className="text-center border border-panel rounded py-1.5 bg-background/40">
              <div className="text-[9px] text-dim tracking-wider">{m.k}</div>
              <div className="text-xs font-bold text-electric num">{m.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
