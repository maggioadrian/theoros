"use client";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";

// Generate synthetic equity curve
function genCurve() {
  const data = [];
  let val = 250000;
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 0; i < 120; i++) {
    const drift = 0.0008;
    const vol = 0.012;
    val *= 1 + drift + (Math.random() - 0.48) * vol;
    data.push({
      t: i,
      label: i % 10 === 0 ? labels[Math.floor(i / 10)] : "",
      equity: Math.round(val * 100) / 100,
      benchmark: Math.round((250000 * Math.pow(1.00035, i)) * 100) / 100,
    });
  }
  return data;
}

const DATA = genCurve();
const START = DATA[0].equity;
const END = DATA[DATA.length - 1].equity;
const TOTAL_RETURN = (((END - START) / START) * 100).toFixed(2);

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-panel border border-panel rounded px-2 py-1.5 text-[10px]">
      <div className="text-electric num font-bold">${payload[0]?.value.toLocaleString()}</div>
      {payload[1] && (
        <div className="text-dim num">BM: ${payload[1].value.toLocaleString()}</div>
      )}
    </div>
  );
};

export default function EquityCurve() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <span className="panel-label">Equity Curve</span>
      </div>
      <div className="flex-1 flex items-center justify-center text-dim text-[10px]">Loading chart...</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <span className="panel-label">Equity Curve</span>
        <div className="flex items-center gap-2">
          <TrendingUp size={10} className="text-profit" />
          <span className="text-[10px] text-profit font-bold num">+{TOTAL_RETURN}%</span>
          <span className="text-[9px] text-dim">YTD</span>
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-px border-b border-panel">
        {[
          { k: "START", v: `$${(START / 1000).toFixed(1)}k` },
          { k: "CURRENT", v: `$${(END / 1000).toFixed(1)}k` },
          { k: "RETURN", v: `+${TOTAL_RETURN}%` },
        ].map((s) => (
          <div key={s.k} className="py-1.5 px-3 text-center">
            <div className="text-[8px] text-dim tracking-widest">{s.k}</div>
            <div className={`text-[11px] font-bold num ${s.k === "RETURN" ? "text-profit" : "text-electric"}`}>
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 px-2 py-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bmGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#475569" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#475569" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fill: "#475569", fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#475569", fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={START} stroke="#475569" strokeDasharray="3 3" strokeWidth={0.5} />
            <Area
              type="monotone"
              dataKey="benchmark"
              stroke="#475569"
              strokeWidth={1}
              fill="url(#bmGrad)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#00d4ff"
              strokeWidth={1.5}
              fill="url(#eqGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-4 px-3 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-electric" />
          <span className="text-[9px] text-dim">THEOROS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-dim" />
          <span className="text-[9px] text-dim">SPY BENCHMARK</span>
        </div>
      </div>
    </div>
  );
}
