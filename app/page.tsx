import TopCommandBar from "@/components/TopCommandBar";
import Panel from "@/components/Panel";
import PortfolioOverview from "@/components/PortfolioOverview";
import EquityCurve from "@/components/EquityCurve";
import SentimentIndicator from "@/components/SentimentIndicator";
import BottomDrawer from "@/components/BottomDrawer";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Command bar */}
      <TopCommandBar />

      {/* Main content area */}
      <div className="flex-1 overflow-hidden flex flex-col p-2 gap-2 min-h-0">

        {/* Upper row: Portfolio Overview + Equity Curve — primary focus */}
        <div className="flex gap-2 overflow-hidden" style={{ flex: "0 0 58%" }}>
          <Panel className="w-80 shrink-0" glow>
            <PortfolioOverview />
          </Panel>
          <Panel className="flex-1" glow>
            <EquityCurve />
          </Panel>
        </div>

        {/* Lower row: Sentiment Indicator */}
        <Panel className="flex-1 overflow-hidden min-h-0">
          <SentimentIndicator />
        </Panel>

      </div>

      {/* Bottom tabbed drawer: Positions / Feed / AI / History */}
      <BottomDrawer />
    </div>
  );
}
