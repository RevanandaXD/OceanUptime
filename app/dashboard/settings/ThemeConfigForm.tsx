"use client";

import { useDashboard } from "@/context/dashboardStore";
import { Sun, Moon, Laptop, Palette, Check } from "lucide-react";

type ThemeId =
  | "light"
  | "dark"
  | "catppuccin"
  | "tokyo-night"
  | "nord"
  | "synthwave"
  | "cyberpunk"
  | "dracula";

export default function ThemeConfigForm() {
  const { theme, applyGlobalTheme } = useDashboard();

  const themes = [
    {
      id: "light" as ThemeId,
      title: "Light Mode",
      desc: "Clean & minimalist light theme",
      previewBg: "bg-white border-zinc-200",
      colors: ["#ffffff", "#f4f4f5", "#6366f1"],
      icon: <Sun className="h-4.5 w-4.5 text-amber-500" />,
      isDeveloperChoice: false,
    },
    {
      id: "dark" as ThemeId,
      title: "Dark Mode",
      desc: "Sleek charcoal dashboard theme",
      previewBg: "bg-zinc-900 border-zinc-800",
      colors: ["#18181b", "#09090b", "#6366f1"],
      icon: <Moon className="h-4.5 w-4.5 text-indigo-400" />,
      isDeveloperChoice: true,
    },
    {
      id: "catppuccin" as ThemeId,
      title: "Catppuccin Mocha",
      desc: "Soothing pastel lavender theme",
      previewBg: "bg-[#1e1e2e] border-[#313244]",
      colors: ["#1e1e2e", "#181825", "#cba6f7"],
      icon: <Palette className="h-4.5 w-4.5 text-[#cba6f7]" />,
      isDeveloperChoice: true,
    },
    {
      id: "tokyo-night" as ThemeId,
      title: "Tokyo Night",
      desc: "Vibrant neon deep-blue theme",
      previewBg: "bg-[#1a1b26] border-[#2f3549]",
      colors: ["#1a1b26", "#1f2335", "#7aa2f7"],
      icon: <Palette className="h-4.5 w-4.5 text-[#7aa2f7]" />,
      isDeveloperChoice: true,
    },
    {
      id: "nord" as ThemeId,
      title: "Nord Arctic",
      desc: "Clean & frosty blue-gray theme",
      previewBg: "bg-[#2e3440] border-[#4c566a]",
      colors: ["#2e3440", "#3b4252", "#88c0d0"],
      icon: <Laptop className="h-4.5 w-4.5 text-[#88c0d0]" />,
      isDeveloperChoice: false,
    },
    {
      id: "synthwave" as ThemeId,
      title: "Synthwave '84",
      desc: "Retro cyberpunk neon theme",
      previewBg: "bg-[#2b213a] border-[#473460]",
      colors: ["#2b213a", "#241b2f", "#f92aad"],
      icon: <Palette className="h-4.5 w-4.5 text-[#f92aad]" />,
      isDeveloperChoice: false,
    },
    {
      id: "cyberpunk" as ThemeId,
      title: "Cyberpunk 2077",
      desc: "Cyberpunk yellow & cyan accent theme",
      previewBg: "bg-[#0f0f13] border-[#fbee09]",
      colors: ["#0f0f13", "#14141d", "#fbee09"],
      icon: <Palette className="h-4.5 w-4.5 text-[#fbee09]" />,
      isDeveloperChoice: false,
    },
    {
      id: "dracula" as ThemeId,
      title: "Dracula Classic",
      desc: "Classic dark theme with purple vibes",
      previewBg: "bg-[#282a36] border-[#44475a]",
      colors: ["#282a36", "#1e1f29", "#bd93f9"],
      icon: <Palette className="h-4.5 w-4.5 text-[#bd93f9]" />,
      isDeveloperChoice: false,
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover-glow transition-all flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <Palette className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
            Appearance
          </h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            Customize your interface dashboard aesthetics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        {themes.map((t) => {
          const isSelected = theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => applyGlobalTheme(t.id)}
              className={`flex flex-col items-stretch p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer shadow-sm relative group ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50/10 dark:border-indigo-450 dark:bg-indigo-500/5 ring-1 ring-indigo-500"
                  : "border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-950/20 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              {/* Checkmark badge */}
              {isSelected && (
                <span className="absolute top-2.5 right-2.5 h-4.5 w-4.5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="h-3 w-3 stroke-[3px]" />
                </span>
              )}

              <div className="flex items-center gap-2.5">
                {t.icon}
                <div className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                  {t.title}
                </div>
              </div>

              <div className="text-[8px] text-zinc-400 dark:text-zinc-500 mt-1 font-bold leading-relaxed">
                {t.desc}
              </div>

              {/* Little Color Palette dots at the bottom */}
              <div className="flex gap-1 mt-3 items-center">
                {t.colors.map((c, i) => (
                  <span
                    key={i}
                    className="h-3 w-3 rounded-full border border-black/10 dark:border-white/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
                {t.isDeveloperChoice ? (
                  <span className="ml-2 px-1.5 rounded-lg font-medium text-[9px] text-white bg-blue-600">
                    Developer Choice
                  </span>
                ) : (
                  ""
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
