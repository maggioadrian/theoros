"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, Wifi, Zap, ChevronRight } from "lucide-react";

const TICKERS = [
  { sym: "SPY",     val: "512.34",  chg: "+1.24%" },
  { sym: "QQQ",     val: "438.92",  chg: "+0.87%" },
  { sym: "BTC/USD", val: "67,420",  chg: "+3.12%" },
  { sym: "NVDA",    val: "875.20",  chg: "+2.07%" },
  { sym: "AAPL",    val: "189.72",  chg: "-0.33%" },
  { sym: "VIX",     val: "14.80",   chg: "-2.10%" },
];

export default function TopCommandBar() {
  const [time, setTime] = useState("");

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

  return (
    <header className="flex flex-col border-b border-panel bg-panel shrink-0">
      {/* Main bar */}
      <div className="flex items-center justify-between px-4 h-11">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-electric/20 border border-electric/40 flex items-center justify-center">
              <Zap size={10} className="text-electric" />
            </div>
            <span className="text-electric font-black text-base tracking-[0.15em] uppercase">
              THEOROS
            </span>
          </div>
          <span className="text-dim text-[9px] border border-dim/30 px-1.5 py-0.5 rounded">
            v2.4.1
          </span>
          <ChevronRight size={10} className="text-dim" />
          <span className="text-dim text-[9px] tracking-wider">LIVE SESSION</span>
        </div>

        {/* Slim ticker — 6 symbols inline, no scroll */}
        <div className="flex items-center gap-5">
          {TICKERS.map((t) => (
            <div key={t.sym} className="flex items-center gap-1.5">
              <span className="text-[9px] text-dim tracking-wider">{t.sym}</span>
              <span className="text-[11px] text-foreground font-bold num">{t.val}</span>
              <span className={`text-[10px] font-semibold num ${t.chg.startsWith("-") ? "text-loss" : "text-profit"}`}>
                {t.chg}
              </span>
            </div>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-profit blink" />
            <span className="text-[9px] text-profit font-bold tracking-wider">MKT OPEN</span>
          </div>
          <span className="text-dim text-[9px]">|</span>
          <div className="flex items-center gap-1.5 text-[10px] num">
            <Activity size={10} className="text-electric" />
            <span className="text-electric font-bold">4.2ms</span>
          </div>
          <span className="text-dim text-[9px]">|</span>
          <div className="flex items-center gap-1.5">
            <Badge className="bg-electric/10 border-electric/30 text-electric text-[9px] font-bold tracking-widest px-1.5 py-0">
              PAPER
            </Badge>
            <Badge className="bg-muted border-panel text-dim text-[9px] tracking-widest px-1.5 py-0">
              ALGO-3
            </Badge>
          </div>
          <div className="text-[10px] text-dim num">{time}</div>
          <div className="w-5 h-5 rounded-full bg-electric/10 border border-electric/30 flex items-center justify-center text-[9px] text-electric font-bold">
            T
          </div>
        </div>
      </div>
    </header>
  );
}
