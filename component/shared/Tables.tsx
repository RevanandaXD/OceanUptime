import { ReactNode } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface TablesProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  variant?: "default" | "borderless";
  className?: string;
}

export default function Tables<T>({
  columns,
  data,
  emptyMessage = "No records found.",
  onRowClick,
  variant = "default",
  className = "",
}: TablesProps<T>) {
  const containerClasses = variant === "borderless"
    ? `overflow-x-auto w-full ${className}`
    : `overflow-x-auto w-full bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm ${className}`;

  return (
    <div className={containerClasses}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`py-3.5 px-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ${
                  column.className || ""
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors text-sm hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((column, colIndex) => {
                  const content =
                     typeof column.accessor === "function"
                      ? column.accessor(row)
                      : (row[column.accessor] as ReactNode);

                  return (
                    <td
                      key={colIndex}
                      className={`py-4 px-4 text-zinc-700 dark:text-zinc-300 font-medium ${
                        column.className || ""
                      }`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center">
                    <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
