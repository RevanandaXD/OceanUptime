import { InputHTMLAttributes } from "react";

interface inputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder: string;
  error?: string;
  isdisabled?: boolean;
}

export default function Input({
  label,
  placeholder,
  error,
  isdisabled,
  ...props
}: inputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
        disabled={isdisabled}
        {...props}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}