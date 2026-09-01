import { ReactNode } from "react";

interface CardStatsProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
}

export default function CardStats({
  title,
  value,
  icon,
  description,
  trend,
  color = "blue",
}: CardStatsProps) {
  const colorMap: Record<
    string,
    { bg: string; border: string; glow: string; iconBg: string; text: string }
  > = {
    blue: {
      bg: "bg-white dark:bg-zinc-900/90",
      border: "border-zinc-200 dark:border-zinc-800/80",
      glow: "hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10",
      iconBg:
        "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30",
      text: "text-zinc-900 dark:text-zinc-100",
    },
    green: {
      bg: "bg-white dark:bg-zinc-900/90",
      border: "border-zinc-200 dark:border-zinc-800/80",
      glow: "hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/10",
      iconBg:
        "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
      text: "text-zinc-900 dark:text-zinc-100",
    },
    red: {
      bg: "bg-white dark:bg-zinc-900/90",
      border: "border-zinc-200 dark:border-zinc-800/80",
      glow: "hover:shadow-rose-500/5 dark:hover:shadow-rose-500/10",
      iconBg:
        "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
      text: "text-zinc-900 dark:text-zinc-100",
    },
    orange: {
      bg: "bg-white dark:bg-zinc-900/90",
      border: "border-zinc-200 dark:border-zinc-800/80",
      glow: "hover:shadow-amber-500/5 dark:hover:shadow-amber-500/10",
      iconBg:
        "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
      text: "text-zinc-900 dark:text-zinc-100",
    },
  };

  const selected = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`p-5 rounded-lg border ${selected.bg} ${selected.border} transition-all duration-300 ${selected.glow} flex flex-col justify-between`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Sleek rounded squircle icon container with glass border */}
        <div
          className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105 ${selected.iconBg}`}
        >
          {icon}
        </div>

        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
            {title}
          </p>
          <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight mt-1 truncate">
            {value}
          </h3>
        </div>
      </div>

      {(description || trend) && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-100/50 dark:border-zinc-800/40 text-[10px] font-medium text-zinc-400 dark:text-zinc-505">
          {trend && (
            <span
              className={`font-bold px-1.5 py-0.5 rounded-md border ${
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100/30 dark:border-emerald-900/20"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-100/30 dark:border-rose-900/20"
              }`}
            >
              {trend.value}
            </span>
          )}
          <span>{description}</span>
        </div>
      )}
    </div>
  );
}
