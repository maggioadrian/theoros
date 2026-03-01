"use client";
import { TrendingUp, TrendingDown, DollarSign, RefreshCw, AlertCircle } from "lucide-react";
import { usePortfolioData } from "@/contexts/PortfolioContext";

const ALLOC_COLORS = ["bg-electric", "bg-profit", "bg-warn", "bg-loss"];

function fmt(n: number, dec = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(n);
}

function fmtUSD(n: number) {
  return `${n < 0 ? "-" : ""}$${fmt(Math.abs(n))}`;
}

export default function PortfolioOverview() {
  const {
    positions,
    totalEquityUSD,
    totalMarketValue,
    totalOpenPnl,
    totalClosedPnl,
    totalCashUSD,
    loading,
    error,
    lastUpdated,
    refresh,
  } = usePortfolioData();

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="panel-header">
          <span className="panel-label">Portfolio Overview</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-dim text-[10px] flex items-center gap-2">
            <RefreshCw size={10} className="animate-spin text-electric" />
            Loading portfolio…
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="panel-header">
          <span className="panel-label">Portfolio Overview</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4">
          <AlertCircle size={16} className="text-loss" />
          <div className="text-loss text-[10px] text-center">{error}</div>
          <button onClick={refresh} className="text-[9px] text-electric hover:underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Build allocation from top positions by market value
  const allocRaw = positions
    .map((p) => ({ label: p.symbol, value: p.openQuantity * p.currentPrice }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);
  const totalMV = allocRaw.reduce((s, a) => s + a.value, 0);

  const pnlUp = totalOpenPnl >= 0;
  const costBasis = totalEquityUSD - totalOpenPnl;
  const pnlPct = costBasis !== 0 ? (totalOpenPnl / Math.abs(costBasis)) * 100 : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <span className="panel-label">Portfolio Overview</span>
        <div className="flex items-center gap-1.5">
          <DollarSign size={10} className="text-electric" />
          <span className="text-[9px] text-dim">LIVE</span>
          {lastUpdated && (
            <span className="text-[8px] text-dim/50">
              {lastUpdated.toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4 overflow-auto">

        {/* NAV hero */}
        <div className="border border-electric/20 rounded-sm bg-electric/[0.04] p-4">
          <div className="text-[9px] text-dim tracking-[0.2em] mb-2">NET ASSET VALUE (USD)</div>
          <div className="text-3xl font-black text-foreground num tracking-tight">
            ${fmt(totalEquityUSD)}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {pnlUp
              ? <TrendingUp size={11} className="text-profit" />
              : <TrendingDown size={11} className="text-loss" />
            }
            <span className={`font-bold text-sm num ${pnlUp ? "text-profit" : "text-loss"}`}>
              {pnlUp ? "+" : ""}{fmtUSD(totalOpenPnl)}
            </span>
            <span className={`text-sm num ${pnlUp ? "text-profit" : "text-loss"}`}>
              {pnlUp ? "+" : ""}{pnlPct.toFixed(2)}%
            </span>
            <span className="text-dim text-[10px]">unrealized</span>
          </div>
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "UNREALIZED", value: fmtUSD(totalOpenPnl),   up: totalOpenPnl >= 0   },
            { label: "CLOSED P&L", value: fmtUSD(totalClosedPnl), up: totalClosedPnl >= 0 },
            { label: "CASH (USD)", value: fmtUSD(totalCashUSD),   up: totalCashUSD >= 0   },
          ].map((s) => (
            <div key={s.label} className="bg-background/50 border border-panel rounded-sm p-3">
              <div className="text-[8px] text-dim tracking-widest mb-1.5">{s.label}</div>
              <div className={`text-base font-bold num ${s.up ? "text-profit" : "text-loss"}`}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Allocation bar */}
        {allocRaw.length > 0 && (
          <div>
            <div className="text-[9px] text-dim tracking-widest mb-2">ALLOCATION</div>
            <div className="flex rounded-sm overflow-hidden h-2.5 gap-px mb-2.5">
              {allocRaw.map((a, i) => (
                <div
                  key={a.label}
                  className={ALLOC_COLORS[i]}
                  style={{ width: `${(a.value / totalMV) * 100}%` }}
                />
              ))}
            </div>
            <div className="flex gap-4 flex-wrap">
              {allocRaw.map((a, i) => (
                <div key={a.label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-sm ${ALLOC_COLORS[i]}`} />
                  <span className="text-[9px] text-dim">{a.label}</span>
                  <span className="text-[10px] text-foreground num font-semibold">
                    {((a.value / totalMV) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio metrics */}
        <div className="grid grid-cols-3 gap-2 mt-auto">
          {[
            { k: "POSITIONS", v: String(positions.length) },
            { k: "MKT VALUE", v: `$${(totalMarketValue / 1000).toFixed(0)}k` },
            { k: "ACCOUNTS",  v: "3" },
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
