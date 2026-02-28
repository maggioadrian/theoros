"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// ── Sector sentiment data ─────────────────────────────────────────────────────
const SECTORS = [
  { name: "Technology",    score: 74, delta: "+3.2", bull: true  },
  { name: "Financials",    score: 61, delta: "+1.1", bull: true  },
  { name: "Energy",        score: 48, delta: "-0.8", bull: false },
  { name: "Healthcare",    score: 55, delta: "+0.4", bull: true  },
  { name: "Consumer Disc", score: 42, delta: "-2.1", bull: false },
  { name: "Industrials",   score: 58, delta: "+0.9", bull: true  },
  { name: "Real Estate",   score: 33, delta: "-3.4", bull: false },
  { name: "Utilities",     score: 38, delta: "-1.2", bull: false },
];

// ── Signal rows ───────────────────────────────────────────────────────────────
const SIGNALS = [
  { label: "VIX",          value: "14.80",  sub: "Low fear",        color: "text-profit" },
  { label: "PUT/CALL",     value: "0.72",   sub: "Mildly bullish",  color: "text-profit" },
  { label: "ADVANCE/DEC",  value: "2.4:1",  sub: "Breadth strong",  color: "text-profit" },
  { label: "HIGH/LOW",     value: "312/18", sub: "52w breakouts",   color: "text-electric" },
  { label: "YIELD CURVE",  value: "+18bp",  sub: "Steepening",      color: "text-warn"   },
  { label: "DOLLAR (DXY)", value: "104.32", sub: "Risk-on signal",  color: "text-profit" },
];

// ── Fear & Greed arc params ───────────────────────────────────────────────────
const SCORE = 68; // 0–100

function scoreLabel(s: number) {
  if (s >= 75) return { label: "EXTREME GREED", color: "#00ff88" };
  if (s >= 55) return { label: "GREED",         color: "#4ade80" };
  if (s >= 45) return { label: "NEUTRAL",        color: "#fbbf24" };
  if (s >= 25) return { label: "FEAR",           color: "#f87171" };
  return              { label: "EXTREME FEAR",   color: "#ff3366" };
}

function GaugeArc({ score }: { score: number }) {
  // Half-circle arc from -180° to 0° (left to right)
  const R = 70;
  const cx = 90, cy = 90;
  const pct = score / 100;
  // Arc circumference of a semicircle
  const arcLen = Math.PI * R;
  const dashOffset = arcLen * (1 - pct);
  const { color } = scoreLabel(score);

  return (
    <svg viewBox="0 0 180 100" className="w-full" style={{ maxHeight: 110 }}>
      {/* Track */}
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round"
      />
      {/* Value arc */}
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${arcLen}`}
        strokeDashoffset={`${dashOffset}`}
        style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
      />
      {/* Needle */}
      {(() => {
        const angle = Math.PI - pct * Math.PI;
        const nx = cx + (R - 6) * Math.cos(angle);
        const ny = cy - (R - 6) * Math.sin(angle);
        return <circle cx={nx} cy={ny} r="4" fill={color} />;
      })()}
      {/* Labels */}
      <text x={cx - R - 4} y={cy + 14} fill="#475569" fontSize="8" textAnchor="middle">FEAR</text>
      <text x={cx + R + 4} y={cy + 14} fill="#475569" fontSize="8" textAnchor="middle">GREED</text>
    </svg>
  );
}

export default function SentimentIndicator() {
  const [tick, setTick] = useState(0);
  const { label: scoreText, color: scoreColor } = scoreLabel(SCORE);

  // Subtle live pulse
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="panel-header">
        <span className="panel-label">Sentiment Indicator</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-electric blink" />
          <span className="text-[9px] text-electric font-bold">LIVE</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-px min-h-0 overflow-hidden">

        {/* ── Col 1: Fear & Greed Gauge ─────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center p-4 gap-2 border-r border-panel">
          <div className="text-[9px] text-dim tracking-widest">FEAR &amp; GREED INDEX</div>
          <GaugeArc score={SCORE} />
          <div className="text-center -mt-1">
            <div className="text-3xl font-black num" style={{ color: scoreColor }}>{SCORE}</div>
            <div className="text-[10px] font-bold tracking-widest mt-0.5" style={{ color: scoreColor }}>
              {scoreText}
            </div>
            <div className="text-[9px] text-dim mt-1">Updated {tick > 0 ? `${tick * 4}s ago` : "just now"}</div>
          </div>
        </div>

        {/* ── Col 2: Sector Heatmap ─────────────────────────────────────── */}
        <div className="flex flex-col p-3 gap-1.5 border-r border-panel overflow-auto">
          <div className="text-[9px] text-dim tracking-widest mb-1">SECTOR SENTIMENT</div>
          {SECTORS.map((s) => {
            const pct = s.score;
            const barColor = pct >= 60 ? "#4ade80" : pct >= 45 ? "#fbbf24" : "#ff3366";
            return (
              <div key={s.name} className="flex items-center gap-2">
                <div className="text-[9px] text-dim w-24 shrink-0 truncate">{s.name}</div>
                <div className="flex-1 h-3 bg-white/[0.05] rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-all"
                    style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 6px ${barColor}50` }}
                  />
                </div>
                <div className="text-[9px] num font-bold w-7 text-right" style={{ color: barColor }}>
                  {pct}
                </div>
                <div className={`text-[9px] num w-10 text-right ${s.bull ? "text-profit" : "text-loss"}`}>
                  {s.delta}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Col 3: Market Signals ─────────────────────────────────────── */}
        <div className="flex flex-col p-3 gap-1 overflow-auto">
          <div className="text-[9px] text-dim tracking-widest mb-1">MARKET SIGNALS</div>
          {SIGNALS.map((sig) => (
            <div
              key={sig.label}
              className="flex items-center justify-between py-1.5 border-b border-panel/50 hover:bg-electric/5 transition-colors px-1"
            >
              <div>
                <div className="text-[9px] text-dim tracking-wider">{sig.label}</div>
                <div className="text-[9px] text-dim/60 mt-0.5">{sig.sub}</div>
              </div>
              <div className={`text-base font-bold num ${sig.color}`}>{sig.value}</div>
            </div>
          ))}

          {/* Regime pill */}
          <div className="mt-auto pt-2">
            <div className="text-[9px] text-dim tracking-widest mb-1.5">REGIME</div>
            <div className="flex items-center gap-2 bg-profit/8 border border-profit/20 rounded-sm px-3 py-2">
              <TrendingUp size={12} className="text-profit shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-profit tracking-wider">RISK-ON</div>
                <div className="text-[9px] text-dim">Momentum + macro aligned</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
