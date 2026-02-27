"use client";
import { useEffect, useRef, useState } from "react";
import { Radio } from "lucide-react";

type FeedEvent = {
  id: number;
  type: "SIGNAL" | "ALERT" | "FILL" | "INFO" | "RISK";
  msg: string;
  time: string;
  sym?: string;
};

const SEED_EVENTS: Omit<FeedEvent, "id">[] = [
  { type: "SIGNAL", msg: "BREAKOUT detected on NVDA — 50d SMA crossover confirmed", time: "09:32:11", sym: "NVDA" },
  { type: "FILL", msg: "ORDER FILLED: BUY 40 NVDA @ $842.10 | slippage 0.02%", time: "09:32:14", sym: "NVDA" },
  { type: "ALERT", msg: "VIX spike +8.2% — risk-off regime detected, reducing leverage", time: "09:29:44" },
  { type: "SIGNAL", msg: "MOMENTUM score 91/100 on MSFT — initiating long position", time: "09:27:58", sym: "MSFT" },
  { type: "FILL", msg: "ORDER FILLED: BUY 35 MSFT @ $408.55 | slippage 0.01%", time: "09:28:07", sym: "MSFT" },
  { type: "INFO", msg: "Fed speaker at 10:00 ET — AI watching for rate language", time: "09:20:00" },
  { type: "RISK", msg: "Portfolio beta 0.83 — within target range [0.6, 1.0]", time: "09:15:30" },
  { type: "SIGNAL", msg: "REVERSAL pattern on TSLA — RSI divergence + volume surge", time: "09:12:18", sym: "TSLA" },
  { type: "FILL", msg: "ORDER FILLED: SELL SHORT 60 TSLA @ $241.30 | slippage 0.03%", time: "09:12:22", sym: "TSLA" },
  { type: "INFO", msg: "Market opened. Scanning 847 instruments across 12 strategies", time: "09:30:00" },
  { type: "ALERT", msg: "AAPL earnings beat: EPS $1.24 vs $1.18 est — adjusting target", time: "08:01:14", sym: "AAPL" },
];

const TYPE_STYLE: Record<FeedEvent["type"], string> = {
  SIGNAL: "text-electric",
  ALERT: "text-warn",
  FILL: "text-profit",
  INFO: "text-dim",
  RISK: "text-loss",
};

const TYPE_LABEL: Record<FeedEvent["type"], string> = {
  SIGNAL: "SIG",
  ALERT: "ALT",
  FILL: "EXC",
  INFO: "INF",
  RISK: "RSK",
};

let _id = SEED_EVENTS.length + 1;
const LIVE_MSGS: Omit<FeedEvent, "id" | "time">[] = [
  { type: "INFO", msg: "Scanning for new MOMENTUM signals across large-cap universe..." },
  { type: "SIGNAL", msg: "Weak BREAKOUT signal on GS — confidence 62%, below threshold" },
  { type: "RISK", msg: "Correlation check: AAPL/MSFT at 0.91 — monitoring concentration risk" },
  { type: "INFO", msg: "ALGO-3 heartbeat OK | uptime 4h 22m | 847 ticks processed" },
  { type: "ALERT", msg: "Options flow alert: unusual call sweep on SPY 515 strike" },
  { type: "SIGNAL", msg: "MACRO regime shift detected: yield curve flattening, adjusting weights" },
];

export default function MarketFeed() {
  const [events, setEvents] = useState<FeedEvent[]>(
    SEED_EVENTS.map((e, i) => ({ ...e, id: i + 1 }))
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      const msg = LIVE_MSGS[i % LIVE_MSGS.length];
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setEvents((prev) => [{ ...msg, id: _id++, time }, ...prev.slice(0, 29)]);
      i++;
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <span className="panel-label">Market Feed</span>
        <div className="flex items-center gap-1.5">
          <Radio size={9} className="text-electric blink" />
          <span className="text-[9px] text-electric font-bold">LIVE</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex flex-col-reverse px-2 py-1 gap-px">
        {events.map((e) => (
          <div
            key={e.id}
            className="flex items-start gap-2 py-1 border-b border-panel/50 hover:bg-electric/3 transition-colors"
          >
            <span className="text-[8px] text-dim num shrink-0 mt-0.5 w-12">{e.time}</span>
            <span
              className={`text-[8px] font-black tracking-widest shrink-0 w-8 ${TYPE_STYLE[e.type]}`}
            >
              {TYPE_LABEL[e.type]}
            </span>
            {e.sym && (
              <span className="text-[9px] text-electric font-bold shrink-0 w-10">{e.sym}</span>
            )}
            <span className="text-[10px] text-foreground/80 leading-relaxed">{e.msg}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
