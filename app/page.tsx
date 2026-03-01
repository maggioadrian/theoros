import TopCommandBar from "@/components/TopCommandBar";
import Panel from "@/components/Panel";
import PortfolioOverview from "@/components/PortfolioOverview";
import EquityCurve from "@/components/EquityCurve";
import BottomDrawer from "@/components/BottomDrawer";
import { PortfolioProvider } from "@/contexts/PortfolioContext";

export default function Home() {
  return (
    <PortfolioProvider>
      <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden">
        <TopCommandBar />

        <div className="flex-1 overflow-hidden flex gap-2 p-2 min-h-0">
          <Panel className="w-80 shrink-0" glow>
            <PortfolioOverview />
          </Panel>
          <Panel className="flex-1" glow>
            <EquityCurve />
          </Panel>
        </div>

        <BottomDrawer />
      </div>
    </PortfolioProvider>
  );
}
