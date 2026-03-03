"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterState {
  status: "draft" | "published" | "archived" | undefined;
  search: string;
}

interface ProjectFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onCreateNew: () => void;
}

export function ProjectFilters({
  filters,
  onFiltersChange,
  onCreateNew,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            type="search"
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-9 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <Select
          value={filters.status ?? "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status:
                value === "all" ? undefined : (value as FilterState["status"]),
            })
          }
        >
          <SelectTrigger className="w-40 border-input bg-background text-foreground">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onCreateNew}>
        <Plus className="mr-2 size-4" />
        New Project
      </Button>
    </div>
  );
}
