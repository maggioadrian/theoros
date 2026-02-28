"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Radio, Cpu, Clock, LayoutList } from "lucide-react";
import MarketFeed from "./MarketFeed";
import AICommandInput from "./AICommandInput";
import TradeHistory from "./TradeHistory";
import PositionsTable from "./PositionsTable";

const TABS = [
  { id: "positions", label: "Open Positions", icon: LayoutList, live: false },
  { id: "feed",      label: "Market Feed",    icon: Radio,      live: true  },
  { id: "ai",        label: "AI Command",     icon: Cpu,        live: true  },
  { id: "history",   label: "Trade History",  icon: Clock,      live: false },
] as const;

type TabId = typeof TABS[number]["id"];

export default function BottomDrawer() {
  const [active, setActive] = useState<TabId>("positions");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="shrink-0 border-t border-panel bg-panel flex flex-col transition-all duration-200"
      style={{ height: collapsed ? "36px" : "220px" }}
    >
      {/* Tab bar */}
      <div className="flex items-center h-9 border-b border-panel shrink-0 overflow-hidden">
        <div className="flex items-center flex-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id && !collapsed;
            return (
              <button
                key={tab.id}
                onClick={() => { if (collapsed) setCollapsed(false); setActive(tab.id); }}
                className={`flex items-center gap-1.5 px-4 h-full text-[10px] font-bold tracking-widest border-r border-panel transition-colors relative ${
                  isActive ? "text-electric bg-electric/5" : "text-dim hover:text-foreground hover:bg-white/[0.03]"
                }`}
              >
                {isActive && <span className="absolute top-0 left-0 right-0 h-px bg-electric" />}
                <Icon size={9} className={isActive ? "text-electric" : ""} />
                {tab.label.toUpperCase()}
                {tab.live && (
                  <span className={`w-1 h-1 rounded-full ${isActive ? "bg-profit blink" : "bg-dim"}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1.5 px-3 h-full text-dim hover:text-foreground transition-colors border-l border-panel text-[9px]"
        >
          {collapsed ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          <span className="tracking-widest">{collapsed ? "EXPAND" : "COLLAPSE"}</span>
        </button>
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="flex-1 overflow-hidden">
          {active === "positions" && <PositionsTable />}
          {active === "feed"      && <MarketFeed />}
          {active === "ai"        && <AICommandInput />}
          {active === "history"   && <TradeHistory />}
        </div>
      )}
    </div>
  );
}
