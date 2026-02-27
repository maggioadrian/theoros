import { cn } from "@/lib/utils";

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  style?: React.CSSProperties;
}

export default function Panel({ children, className, glow, style }: PanelProps) {
  return (
    <div
      style={style}
      className={cn(
        "bg-panel border border-panel rounded-sm overflow-hidden flex flex-col relative",
        glow && "glow-electric",
        className
      )}
    >
      {/* Scanline overlay */}
      <div className="scanline absolute inset-0 pointer-events-none z-10" />
      {children}
    </div>
  );
}
