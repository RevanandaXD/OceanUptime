import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold animate-pulse">
        Loading...
      </p>
    </div>
  );
}
