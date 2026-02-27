"use client";

type Trade = {
  id: string;
  sym: string;
  side: "BUY" | "SELL";
  qty: number;
  price: number;
  pnl: number | null;
  time: string;
  strategy: string;
  status: "FILLED" | "PARTIAL" | "CANCELLED";
};

const TRADES: Trade[] = [
  { id: "T0041", sym: "NVDA", side: "BUY", qty: 40, price: 842.10, pnl: null, time: "09:32:14", strategy: "BREAKOUT", status: "FILLED" },
  { id: "T0040", sym: "MSFT", side: "BUY", qty: 35, price: 408.55, pnl: null, time: "09:28:07", strategy: "MOMENTUM", status: "FILLED" },
  { id: "T0039", sym: "QQQ", side: "SELL", qty: 50, price: 443.80, pnl: null, time: "09:15:44", strategy: "HEDGE", status: "FILLED" },
  { id: "T0038", sym: "AAPL", side: "BUY", qty: 50, price: 183.20, pnl: 330.00, time: "yesterday", strategy: "MOMENTUM", status: "FILLED" },
  { id: "T0037", sym: "AMZN", side: "SELL", qty: 25, price: 195.40, pnl: -187.50, time: "yesterday", strategy: "REVERSAL", status: "FILLED" },
  { id: "T0036", sym: "ETH/USD", side: "BUY", qty: 2.5, price: 3420.00, pnl: 400.00, time: "2d ago", strategy: "CRYPTO-MM", status: "FILLED" },
  { id: "T0035", sym: "META", side: "SELL", qty: 20, price: 502.10, pnl: 560.00, time: "2d ago", strategy: "MOMENTUM", status: "FILLED" },
  { id: "T0034", sym: "GLD", side: "BUY", qty: 120, price: 190.20, pnl: null, time: "4d ago", strategy: "MACRO", status: "FILLED" },
  { id: "T0033", sym: "SPY", side: "BUY", qty: 30, price: 507.80, pnl: 123.60, time: "4d ago", strategy: "TREND", status: "PARTIAL" },
  { id: "T0032", sym: "VIX", side: "BUY", qty: 100, price: 16.40, pnl: -160.00, time: "5d ago", strategy: "HEDGE", status: "CANCELLED" },
];

export default function TradeHistory() {
  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <span className="panel-label">Trade History</span>
        <span className="text-[9px] text-dim">last 10 trades</span>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead className="sticky top-0 bg-panel">
            <tr className="border-b border-panel">
              {["ID", "SYMBOL", "SIDE", "QTY", "PRICE", "P&L", "TIME", "STATUS"].map((h) => (
                <th key={h} className="text-[9px] text-dim tracking-widest font-bold text-left px-2 py-1.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRADES.map((t, i) => (
              <tr
                key={t.id}
                className={`border-b border-panel hover:bg-electric/5 transition-colors ${
                  i % 2 === 0 ? "bg-background/20" : ""
                }`}
              >
                <td className="px-2 py-1 text-dim num">{t.id}</td>
                <td className="px-2 py-1 font-bold text-foreground">{t.sym}</td>
                <td className="px-2 py-1">
                  <span
                    className={`text-[9px] font-bold ${
                      t.side === "BUY" ? "text-profit" : "text-loss"
                    }`}
                  >
                    {t.side}
                  </span>
                </td>
                <td className="px-2 py-1 text-dim num">{t.qty}</td>
                <td className="px-2 py-1 text-dim num">${t.price.toLocaleString()}</td>
                <td className="px-2 py-1 num font-semibold">
                  {t.pnl == null ? (
                    <span className="text-dim">—</span>
                  ) : (
                    <span className={t.pnl >= 0 ? "text-profit" : "text-loss"}>
                      {t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-2 py-1 text-dim text-[9px] num">{t.time}</td>
                <td className="px-2 py-1">
                  <span
                    className={`text-[8px] font-bold tracking-wider ${
                      t.status === "FILLED"
                        ? "text-profit"
                        : t.status === "PARTIAL"
                        ? "text-warn"
                        : "text-loss"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
