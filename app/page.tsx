import TopCommandBar from "@/components/TopCommandBar";
import Panel from "@/components/Panel";
import PortfolioOverview from "@/components/PortfolioOverview";
import PositionsTable from "@/components/PositionsTable";
import EquityCurve from "@/components/EquityCurve";
import TradeHistory from "@/components/TradeHistory";
import MarketFeed from "@/components/MarketFeed";
import AICommandInput from "@/components/AICommandInput";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Top command bar (fixed height) */}
      <TopCommandBar />

      {/* Main dashboard grid */}
      <div className="flex-1 overflow-hidden p-2 grid gap-2" style={{
        display: "grid",
        gridTemplateRows: "1fr 1fr",
        gridTemplateColumns: "280px 1fr 320px",
        gridTemplateAreas: `
          "portfolio positions equity"
          "trades    feed      ai"
        `,
      }}>
        {/* Portfolio Overview */}
        <Panel style={{ gridArea: "portfolio" }} className="min-h-0">
          <PortfolioOverview />
        </Panel>

        {/* Positions Table */}
        <Panel style={{ gridArea: "positions" }} className="min-h-0">
          <PositionsTable />
        </Panel>

        {/* Equity Curve */}
        <Panel style={{ gridArea: "equity" }} glow className="min-h-0">
          <EquityCurve />
        </Panel>

        {/* Trade History */}
        <Panel style={{ gridArea: "trades" }} className="min-h-0">
          <TradeHistory />
        </Panel>

        {/* Market Feed */}
        <Panel style={{ gridArea: "feed" }} className="min-h-0">
          <MarketFeed />
        </Panel>

        {/* AI Command */}
        <Panel style={{ gridArea: "ai" }} glow className="min-h-0">
          <AICommandInput />
        </Panel>
      </div>
    </div>
  );
}
