import TopCommandBar from "@/components/TopCommandBar";
import Panel from "@/components/Panel";
import PortfolioOverview from "@/components/PortfolioOverview";
import PositionsTable from "@/components/PositionsTable";
import EquityCurve from "@/components/EquityCurve";
import BottomDrawer from "@/components/BottomDrawer";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Command bar */}
      <TopCommandBar />

      {/* Main content area */}
      <div className="flex-1 overflow-hidden flex flex-col p-2 gap-2">

        {/* Upper row: Portfolio Overview + Equity Curve */}
        <div className="flex gap-2 overflow-hidden" style={{ flex: "0 0 auto", height: "calc(50% - 60px)" }}>
          <Panel className="w-72 shrink-0">
            <PortfolioOverview />
          </Panel>
          <Panel className="flex-1" glow>
            <EquityCurve />
          </Panel>
        </div>

        {/* Middle row: Positions Table */}
        <Panel className="flex-1 overflow-hidden min-h-0">
          <PositionsTable />
        </Panel>

      </div>

      {/* Bottom tabbed drawer */}
      <BottomDrawer />
    </div>
  );
}
