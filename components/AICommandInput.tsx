"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Cpu, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = {
  role: "user" | "ai";
  content: string;
  time: string;
};

const SUGGESTIONS = [
  "Show me top momentum plays today",
  "What's my biggest risk exposure?",
  "Reduce portfolio beta to 0.7",
  "Backtest RSI strategy on BTC last 90d",
  "Close all losing positions",
];

const CANNED: Record<string, string> = {
  default: "Analyzing market conditions and portfolio state... I can execute trades, run backtests, adjust strategy parameters, and provide real-time analysis. What would you like to do?",
  momentum: "Top momentum signals today: NVDA (91), TSLA (88), META (84). NVDA breakout confirmed with volume surge 2.3× average. Position already open. Want me to size up?",
  risk: "Highest risk exposures: (1) BTC/USD concentration 18.9% of NAV, (2) AAPL/MSFT correlation 0.91, (3) short TSLA with upcoming catalyst on 3/14. Suggest trimming BTC to 12%.",
  beta: "Calculating adjustment... Currently at β=0.83. To reach 0.70, I recommend reducing QQQ short by 20 units and trimming NVDA long by 10 shares. Execute? [YES / NO]",
  backtest: "Running BTC RSI(14) strategy, 90d lookback... Sharpe 1.84 | Win rate 61.2% | Max DD -12.4% | Return +34.2% vs BTC +41.1%. Strategy underperforms in trending markets — best in range-bound.",
  close: "⚠️ Closing all losing positions: AMZN (-$187.50), VIX hedge (-$160.00). Total realized loss: -$347.50. This will also remove your macro hedge. Confirm? [YES / NO]",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("momentum") || lower.includes("play")) return CANNED.momentum;
  if (lower.includes("risk") || lower.includes("exposure")) return CANNED.risk;
  if (lower.includes("beta")) return CANNED.beta;
  if (lower.includes("backtest")) return CANNED.backtest;
  if (lower.includes("close") || lower.includes("losing")) return CANNED.close;
  return CANNED.default;
}

export default function AICommandInput() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "THEOROS AI online. Portfolio loaded. 8 active positions across 4 strategies. How can I assist?",
      time: "09:30:00",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    const now = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setMessages((p) => [...p, { role: "user", content: msg, time: now }]);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
    const resp = getResponse(msg);
    const now2 = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setMessages((p) => [...p, { role: "ai", content: resp, time: now2 }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <div className="flex items-center gap-1.5">
          <Cpu size={10} className="text-electric" />
          <span className="panel-label">AI Command</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-profit blink" />
          <span className="text-[9px] text-profit font-bold">THEOROS-3 ONLINE</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-3 py-2 flex flex-col gap-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-5 h-5 rounded shrink-0 flex items-center justify-center text-[9px] font-bold ${
                m.role === "ai"
                  ? "bg-electric/20 border border-electric/30 text-electric"
                  : "bg-profit/20 border border-profit/30 text-profit"
              }`}
            >
              {m.role === "ai" ? "AI" : "U"}
            </div>
            <div
              className={`rounded px-2.5 py-1.5 max-w-[85%] ${
                m.role === "ai"
                  ? "bg-electric/5 border border-electric/15 text-foreground/90"
                  : "bg-profit/5 border border-profit/15 text-foreground/90"
              }`}
            >
              <div className="text-[11px] leading-relaxed">{m.content}</div>
              <div className="text-[8px] text-dim mt-0.5 num">{m.time}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded bg-electric/20 border border-electric/30 flex items-center justify-center text-[9px] text-electric font-bold">
              AI
            </div>
            <div className="bg-electric/5 border border-electric/15 rounded px-2.5 py-1.5">
              <div className="flex gap-1 items-center">
                <span className="text-[10px] text-electric/60">thinking</span>
                <span className="text-electric blink">▊</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="px-3 py-1.5 border-t border-panel flex gap-1.5 flex-wrap">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="text-[9px] text-electric/70 border border-electric/20 rounded px-2 py-0.5 hover:bg-electric/10 hover:text-electric transition-colors flex items-center gap-1"
          >
            <ChevronRight size={7} />
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-1.5 border-t border-panel flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Enter command or ask AI... (e.g. 'buy 10 AAPL' or 'show risk analysis')"
          className="flex-1 bg-background border-panel text-[11px] h-8 text-foreground placeholder:text-dim focus-visible:ring-electric/30 focus-visible:border-electric/40"
        />
        <Button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          size="sm"
          className="h-8 px-3 bg-electric/10 border border-electric/30 text-electric hover:bg-electric/20 hover:text-electric"
        >
          <Send size={12} />
        </Button>
      </div>
    </div>
  );
}
