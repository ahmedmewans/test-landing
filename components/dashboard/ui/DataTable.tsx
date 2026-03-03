"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc" | null;

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  sortKey?: keyof T | string | null;
  sortDirection?: SortDirection;
  onSort?: (key: keyof T | string) => void;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

function SortIcon({ direction }: { direction: SortDirection | undefined }) {
  if (direction === "asc") return <ChevronUp className="size-4" />;
  if (direction === "desc") return <ChevronDown className="size-4" />;
  return <ChevronsUpDown className="size-4 opacity-50" />;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  sortKey,
  sortDirection,
  onSort,
  onRowClick,
  emptyMessage = "No data available",
  loading,
  className,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={cn("rounded-lg border border-neutral-800", className)}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={String(col.key)} className={col.className}>
                  <div className="h-4 w-24 animate-pulse rounded bg-neutral-700" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    <div className="h-4 w-full animate-pulse rounded bg-neutral-800" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={cn(
          "rounded-lg border border-neutral-800 p-12 text-center",
          className,
        )}
      >
        <p className="text-neutral-400">{emptyMessage}</p>
      </div>
    );
  }

  const handleSort = (col: Column<T>) => {
    if (col.sortable && onSort) {
      onSort(col.key as keyof T);
    }
  };

  return (
    <div className={cn("rounded-lg border border-neutral-800", className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-neutral-800/50">
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                className={cn(
                  col.className,
                  col.sortable && "cursor-pointer select-none",
                )}
                onClick={() => handleSort(col)}
              >
                <div className="flex items-center gap-2">
                  <span>{col.header}</span>
                  {col.sortable && (
                    <SortIcon
                      direction={sortKey === col.key ? sortDirection : null}
                    />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={keyExtractor(item)}
              className={cn(
                "hover:bg-neutral-800/50",
                onRowClick && "cursor-pointer",
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <TableCell key={String(col.key)} className={col.className}>
                  {col.render
                    ? col.render(item)
                    : String(
                        (item as Record<string, unknown>)[col.key as string] ??
                          "",
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
