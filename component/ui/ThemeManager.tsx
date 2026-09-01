"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ThemeManager() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    if (pathname.startsWith("/dashboard")) {
      const theme = localStorage.getItem("theme-mode") || "dark";
      root.setAttribute("data-theme", theme);
      if (theme === "light") {
        root.classList.remove("dark");
        root.classList.add("light");
      } else {
        root.classList.add("dark");
        root.classList.remove("light");
      }
    } else {
      root.setAttribute("data-theme", "dark");
      root.classList.add("dark");
      root.classList.remove("light");
    }
  }, [pathname]);

  return null;
}
