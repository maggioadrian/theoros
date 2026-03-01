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
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";
import { getEquityHistory } from "@/lib/api";
import type { EquityPoint } from "@/lib/api";

type ChartPoint = {
  label: string;
  equity: number;
  benchmark?: number;
};

function buildChartData(raw: EquityPoint[]): ChartPoint[] {
  let lastMonth = "";
  return raw.map((d) => {
    const month = new Date(d.date + "T12:00:00Z").toLocaleString("en-US", { month: "short" });
    const label = month !== lastMonth ? month : "";
    lastMonth = month;
    return { label, equity: d.equity, benchmark: d.benchmark };
  });
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const equity    = payload.find((p) => p.dataKey === "equity");
  const benchmark = payload.find((p) => p.dataKey === "benchmark");
  return (
    <div className="bg-panel border border-panel rounded px-2 py-1.5 text-[10px]">
      {label && <div className="text-dim mb-1">{label}</div>}
      {equity && (
        <div className="text-electric num font-bold">
          ${equity.value.toLocaleString("en-US", { minimumFractionDigits: 0 })}
        </div>
      )}
      {benchmark && (
        <div className="text-dim num">
          SPY: ${benchmark.value.toLocaleString("en-US", { minimumFractionDigits: 0 })}
        </div>
      )}
    </div>
  );
};

export default function EquityCurve() {
  const [data, setData]       = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getEquityHistory(252)
      .then((raw) => setData(buildChartData(raw)))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load equity history"))
      .finally(() => setLoading(false));
  }, []);

  const start   = data[0]?.equity ?? 0;
  const current = data[data.length - 1]?.equity ?? 0;
  const ret     = start > 0 ? ((current - start) / start) * 100 : 0;
  const retUp   = ret >= 0;

  if (!mounted || loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="panel-header">
          <span className="panel-label">Equity Curve</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-dim text-[10px] flex items-center gap-2">
            <RefreshCw size={10} className="animate-spin text-electric" />
            Loading chart…
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="panel-header"><span className="panel-label">Equity Curve</span></div>
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <AlertCircle size={16} className="text-loss" />
          <div className="text-loss text-[10px] text-center px-4">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <span className="panel-label">Equity Curve</span>
        <div className="flex items-center gap-2">
          {retUp
            ? <TrendingUp size={10} className="text-profit" />
            : <TrendingDown size={10} className="text-loss" />
          }
          <span className={`text-[10px] font-bold num ${retUp ? "text-profit" : "text-loss"}`}>
            {retUp ? "+" : ""}{ret.toFixed(2)}%
          </span>
          <span className="text-[9px] text-dim">1Y</span>
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-px border-b border-panel">
        {[
          { k: "START",   v: `$${(start   / 1000).toFixed(0)}k`, up: true    },
          { k: "CURRENT", v: `$${(current / 1000).toFixed(0)}k`, up: true    },
          { k: "RETURN",  v: `${retUp ? "+" : ""}${ret.toFixed(2)}%`, up: retUp },
        ].map((s) => (
          <div key={s.k} className="py-2.5 px-4 text-center">
            <div className="text-[8px] text-dim tracking-widest mb-1">{s.k}</div>
            <div className={`text-base font-bold num ${s.k === "RETURN" ? (s.up ? "text-profit" : "text-loss") : "text-electric"}`}>
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 px-2 py-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00d4ff" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="bmGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#475569" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#475569" stopOpacity={0}    />
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
              width={44}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={start} stroke="#475569" strokeDasharray="3 3" strokeWidth={0.5} />
            <Area
              type="monotone"
              dataKey="benchmark"
              stroke="#475569"
              strokeWidth={1}
              fill="url(#bmGrad)"
              dot={false}
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#00d4ff"
              strokeWidth={1.5}
              fill="url(#eqGrad)"
              dot={false}
              connectNulls
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
