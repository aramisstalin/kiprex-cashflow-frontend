"use client";

import type { ReactNode } from "react";

interface Column<T> {
    key: string;
    header: string;
    render: (row: T) => ReactNode;
    sortable?: boolean;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (row: T) => string;
    emptyMessage?: string;
    className?: string;
    onRowClick?: (row: T) => void;
}

export function DataTable<T>({
    columns,
    data,
    keyExtractor,
    emptyMessage = "No data available",
    className = "",
    onRowClick,
}: DataTableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center py-12 text-body text-muted-foreground">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-border">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`
                  py-3 px-4 text-caption font-semibold text-muted-foreground
                  uppercase tracking-wider
                  ${col.className ?? ""}
                `}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr
                            key={keyExtractor(row)}
                            onClick={onRowClick ? () => onRowClick(row) : undefined}
                            className={`
                border-b border-border last:border-0
                transition-colors duration-[var(--duration-fast)]
                ${onRowClick ? "cursor-pointer hover:bg-accent/50" : ""}
              `}
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className={`py-3 px-4 text-body ${col.className ?? ""}`}
                                >
                                    {col.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
