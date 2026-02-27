"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, Wifi, Zap, ChevronRight } from "lucide-react";

const TICKERS = [
  { sym: "SPY", val: "512.34", chg: "+1.24%" },
  { sym: "QQQ", val: "438.92", chg: "+0.87%" },
  { sym: "BTC/USD", val: "67,420", chg: "+3.12%" },
  { sym: "ETH/USD", val: "3,580", chg: "+2.44%" },
  { sym: "AAPL", val: "189.72", chg: "-0.33%" },
  { sym: "TSLA", val: "224.18", chg: "+4.91%" },
  { sym: "NVDA", val: "875.20", chg: "+2.07%" },
  { sym: "GLD", val: "193.45", chg: "+0.62%" },
  { sym: "DXY", val: "104.32", chg: "-0.18%" },
  { sym: "VIX", val: "14.80", chg: "-2.10%" },
];

export default function TopCommandBar() {
  const [time, setTime] = useState("");
  const [latency] = useState("4.2ms");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " ET"
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const tickerContent = [...TICKERS, ...TICKERS].map((t, i) => (
    <span key={i} className="inline-flex items-center gap-2 mx-6">
      <span className="text-dim text-[10px]">{t.sym}</span>
      <span className="text-foreground text-[11px] font-bold num">{t.val}</span>
      <span
        className={`text-[10px] font-semibold num ${
          t.chg.startsWith("-") ? "text-loss" : "text-profit"
        }`}
      >
        {t.chg}
      </span>
    </span>
  ));

  return (
    <header className="flex flex-col border-b border-panel bg-panel shrink-0">
      {/* Main bar */}
      <div className="flex items-center justify-between px-4 h-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-electric/20 border border-electric/40 flex items-center justify-center">
              <Zap size={12} className="text-electric" />
            </div>
            <span className="text-electric font-black text-lg tracking-[0.15em] uppercase">
              THEOROS
            </span>
          </div>
          <span className="text-dim text-[10px] border border-dim/30 px-1.5 py-0.5 rounded">
            v2.4.1
          </span>
          <ChevronRight size={12} className="text-dim" />
          <span className="text-dim text-[10px] tracking-wider">LIVE SESSION</span>
        </div>

        {/* Center status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-profit blink" />
            <span className="text-[10px] text-profit font-bold tracking-wider">MARKET OPEN</span>
          </div>
          <span className="text-dim text-[10px]">|</span>
          <div className="flex items-center gap-1.5 text-[11px] num">
            <Activity size={11} className="text-electric" />
            <span className="text-dim">LATENCY</span>
            <span className="text-electric font-bold">{latency}</span>
          </div>
          <span className="text-dim text-[10px]">|</span>
          <div className="flex items-center gap-1.5 text-[11px]">
            <Wifi size={11} className="text-profit" />
            <span className="text-dim">FEED</span>
            <span className="text-profit font-bold">CONNECTED</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-electric/10 border-electric/30 text-electric text-[9px] font-bold tracking-widest px-2">
              PAPER
            </Badge>
            <Badge className="bg-muted border-panel text-dim text-[9px] tracking-widest px-2">
              ALGO-3
            </Badge>
          </div>
          <div className="text-[11px] text-dim num font-mono">{time}</div>
          <div className="w-6 h-6 rounded-full bg-electric/10 border border-electric/30 flex items-center justify-center text-[10px] text-electric font-bold">
            T
          </div>
        </div>
      </div>

      {/* Ticker tape */}
      <div className="h-7 border-t border-panel flex items-center overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-panel to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-panel to-transparent z-10" />
        <div className="flex items-center ticker-scroll whitespace-nowrap">
          {tickerContent}
        </div>
      </div>
    </header>
  );
}
