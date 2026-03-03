"use client";

import { useMutation, useQuery } from "convex/react";
import {
  Archive,
  Calendar,
  CheckSquare,
  Edit,
  MapPin,
  MoreHorizontal,
  Square,
  ToggleLeft,
  Trash2,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dashboard/ui/ConfirmDialog";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";
import {
  SortableItem,
  SortableList,
} from "@/components/dashboard/ui/SortableList";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { api } from "../../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../../convex/_generated/dataModel";

type Experience = {
  _id: Id<"experience">;
  _creationTime: number;
  company: string;
  role: string;
  description: string;
  highlights: string[];
  tags: string[];
  color: string;
  icon?: string;
  startDate: number;
  endDate?: number;
  location: string;
  sortOrder: number;
};

export function ExperienceTable() {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    experience: Experience | null;
  }>({ open: false, experience: null });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const experiences = useQuery(api.experience.getExperience, {});
  const deleteExperience = useMutation(api.experience.deleteExperience);
  const reorderExperience = useMutation(api.experience.reorderExperience);
  const updateExperience = useMutation(api.experience.updateExperience);

  const sortedExperiences = useMemo(() => {
    if (!experiences) return [];
    return [...experiences].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [experiences]);

  const isAllSelected =
    sortedExperiences.length > 0 &&
    selectedIds.size === sortedExperiences.length;
  const isSomeSelected = selectedIds.size > 0;

  const handleDelete = async () => {
    if (deleteDialog.experience) {
      try {
        await deleteExperience({ id: deleteDialog.experience._id });
        toast.success("Experience deleted successfully");
        setDeleteDialog({ open: false, experience: null });
      } catch {
        toast.error("Failed to delete experience");
      }
    }
  };

  const handleReorder = (ids: string[]) => {
    try {
      reorderExperience({ experienceIds: ids as Id<"experience">[] });
      toast.success("Order updated successfully");
    } catch {
      toast.error("Failed to update order");
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedExperiences.map((e) => e._id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkDelete = () => {
    startTransition(async () => {
      try {
        await Promise.all(
          Array.from(selectedIds).map((id) =>
            deleteExperience({ id: id as Id<"experience"> }),
          ),
        );
        toast.success(`${selectedIds.size} experiences deleted`);
        setSelectedIds(new Set());
      } catch {
        toast.error("Failed to delete some experiences");
      }
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const formatDuration = (startDate: number, endDate?: number) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : "Present";
    return `${start} - ${end}`;
  };

  if (experiences?.length === 0) {
    return (
      <EmptyState
        title="No experience yet"
        description="Add your work experience to get started."
        action={{
          label: "Add Experience",
          onClick: () => router.push("/dashboard/experience/new"),
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Button onClick={() => router.push("/dashboard/experience/new")}>
          Add Experience
        </Button>

        {isSomeSelected && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isPending}
            >
              <Trash2 className="size-4 mr-1" />
              Delete Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
        <button
          type="button"
          onClick={handleSelectAll}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          {isAllSelected ? (
            <CheckSquare className="size-5 text-primary" />
          ) : (
            <Square className="size-5 text-muted-foreground" />
          )}
        </button>
        <span className="text-sm text-muted-foreground">Select all</span>
      </div>

      <SortableList
        items={sortedExperiences.map((e) => ({ id: e._id }))}
        onReorder={handleReorder}
      >
        <div className="space-y-4">
          {sortedExperiences.map((exp) => (
            <SortableItem key={exp._id} id={exp._id}>
              <div className="rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors w-full">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectOne(exp._id)}
                    className="p-1 hover:bg-muted rounded transition-colors shrink-0 mt-1"
                  >
                    {selectedIds.has(exp._id) ? (
                      <CheckSquare className="size-5 text-primary" />
                    ) : (
                      <Square className="size-5 text-muted-foreground" />
                    )}
                  </button>
                  <div
                    className="size-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ backgroundColor: exp.color }}
                  >
                    {exp.company.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">
                        {exp.role}
                      </h3>
                      <span className="text-muted-foreground">at</span>
                      <span className="font-medium text-foreground">
                        {exp.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDuration(exp.startDate, exp.endDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {exp.location}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {exp.description}
                    </p>
                    {exp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exp.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {exp.tags.length > 5 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            +{exp.tags.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/experience/${exp._id}`)
                        }
                      >
                        <Edit className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() =>
                          setDeleteDialog({ open: true, experience: exp })
                        }
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableList>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, experience: null })}
        title="Delete Experience"
        description={`Are you sure you want to delete "${deleteDialog.experience?.role} at ${deleteDialog.experience?.company}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
