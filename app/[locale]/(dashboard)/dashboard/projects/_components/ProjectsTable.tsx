"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQuery } from "convex/react";
import {
  Archive,
  CheckSquare,
  Edit,
  FileText,
  GripVertical,
  LayoutGrid,
  List,
  MoreHorizontal,
  Rocket,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dashboard/ui/ConfirmDialog";
import { type Column, DataTable } from "@/components/dashboard/ui/DataTable";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";
import { StatusBadge } from "@/components/dashboard/ui/StatusBadge";
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
import { type FilterState, ProjectFilters } from "./ProjectFilters";

type Project = {
  _id: Id<"projects">;
  _creationTime: number;
  title: string;
  slug: string;
  category: string;
  status: "draft" | "published" | "archived";
  description: string;
  content: string;
  tags: string[];
  color: string;
  featured: boolean;
  sortOrder: number;
  startDate?: number;
  endDate?: number;
  publishedAt?: number;
};

interface SortableProjectCardProps {
  project: Project;
  isSelected: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleSelect: () => void;
}

function SortableProjectCard({
  project,
  isSelected,
  onEdit,
  onDelete,
  onToggleSelect,
}: SortableProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors",
        isDragging && "z-50 opacity-90 shadow-lg",
        isSelected && "ring-2 ring-primary",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onToggleSelect}
          className="p-1 hover:bg-muted rounded transition-colors shrink-0 mt-1"
        >
          {isSelected ? (
            <CheckSquare className="size-4 text-primary" />
          ) : (
            <Square className="size-4 text-muted-foreground" />
          )}
        </button>
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-1"
        >
          <GripVertical className="size-4" />
        </button>
        <div
          className="size-3 rounded-full mt-1.5 shrink-0"
          style={{ backgroundColor: project.color }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-foreground">{project.title}</h3>
              <p className="text-xs text-muted-foreground">{project.slug}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <StatusBadge status={project.status} />
            <span className="text-xs text-muted-foreground">
              {project.category}
            </span>
            {project.featured && (
              <span className="text-xs text-yellow-500">Featured</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {project.description}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDate(project.startDate ?? project.publishedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProjectsTable() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    status: undefined,
    search: "",
  });
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [sortKey, setSortKey] = useState<
    keyof Project | "startDate" | "publishedAt"
  >("sortOrder");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    project: Project | null;
    isBulk: boolean;
  }>({ open: false, project: null, isBulk: false });
  const [isPending, startTransition] = useTransition();

  const projects = useQuery(api.projects.getProjects, {
    status: filters.status,
  });

  const deleteProject = useMutation(api.projects.deleteProject);
  const reorderProjects = useMutation(api.projects.reorderProjects);
  const updateProject = useMutation(api.projects.updateProject);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    let result = projects;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.tags.some((t) => t.toLowerCase().includes(searchLower)),
      );
    }

    if (sortKey && viewMode === "table") {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;

        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDirection === "asc" ? comparison : -comparison;
      });
    } else {
      result = [...result].sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return result;
  }, [projects, filters.search, sortKey, sortDirection, viewMode]);

  const isAllSelected =
    filteredProjects.length > 0 && selectedIds.size === filteredProjects.length;
  const isSomeSelected = selectedIds.size > 0;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleSort = (key: keyof Project | string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key as keyof Project);
      setSortDirection("asc");
    }
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        if (deleteDialog.isBulk) {
          await Promise.all(
            Array.from(selectedIds).map((id) =>
              deleteProject({ id: id as Id<"projects"> }),
            ),
          );
          toast.success(`${selectedIds.size} projects deleted`);
          setSelectedIds(new Set());
        } else if (deleteDialog.project) {
          await deleteProject({ id: deleteDialog.project._id });
          toast.success("Project deleted successfully");
        }
        setDeleteDialog({ open: false, project: null, isBulk: false });
      } catch {
        toast.error("Failed to delete project(s)");
      }
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredProjects.findIndex((p) => p._id === active.id);
      const newIndex = filteredProjects.findIndex((p) => p._id === over.id);

      const newOrder = arrayMove(
        filteredProjects.map((p) => p._id),
        oldIndex,
        newIndex,
      );

      try {
        reorderProjects({ projectIds: newOrder });
        toast.success("Order updated successfully");
      } catch {
        toast.error("Failed to update order");
      }
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProjects.map((p) => p._id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkStatusChange = (
    newStatus: "draft" | "published" | "archived",
  ) => {
    startTransition(async () => {
      try {
        await Promise.all(
          Array.from(selectedIds).map((id) =>
            updateProject({ id: id as Id<"projects">, status: newStatus }),
          ),
        );
        toast.success(`${selectedIds.size} projects marked as ${newStatus}`);
        setSelectedIds(new Set());
      } catch {
        toast.error("Failed to update status");
      }
    });
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns: Column<Project>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (project) => (
        <div className="flex items-center gap-3">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <div>
            <p className="font-medium text-foreground">{project.title}</p>
            <p className="text-xs text-muted-foreground">{project.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      className: "hidden md:table-cell",
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (project) => <StatusBadge status={project.status} />,
    },
    {
      key: "featured",
      header: "Featured",
      sortable: true,
      className: "hidden lg:table-cell",
      render: (project) => (
        <span
          className={
            project.featured ? "text-green-400" : "text-muted-foreground"
          }
        >
          {project.featured ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "startDate",
      header: "Date",
      sortable: true,
      className: "hidden lg:table-cell",
      render: (project) => formatDate(project.startDate ?? project.publishedAt),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      render: (project) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/projects/${project._id}`)}
            >
              <Edit className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() =>
                setDeleteDialog({ open: true, project, isBulk: false })
              }
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (projects?.length === 0 && !filters.status && !filters.search) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create your first project to get started."
        action={{
          label: "Create Project",
          onClick: () => router.push("/dashboard/projects/new"),
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <ProjectFilters
          filters={filters}
          onFiltersChange={setFilters}
          onCreateNew={() => router.push("/dashboard/projects/new")}
        />
        <div className="flex items-center border border-border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="size-7"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="icon"
            className="size-7"
            onClick={() => setViewMode("table")}
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {isSomeSelected && (
        <div className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {selectedIds.size} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              <X className="size-4 mr-1" />
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange("published")}
              disabled={isPending}
            >
              <Rocket className="size-4 mr-1" />
              Publish
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange("draft")}
              disabled={isPending}
            >
              <FileText className="size-4 mr-1" />
              Draft
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange("archived")}
              disabled={isPending}
            >
              <Archive className="size-4 mr-1" />
              Archive
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                setDeleteDialog({ open: true, project: null, isBulk: true })
              }
              disabled={isPending}
            >
              <Trash2 className="size-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

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

      {viewMode === "grid" ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredProjects.map((p) => p._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <SortableProjectCard
                  key={project._id}
                  project={project}
                  isSelected={selectedIds.has(project._id)}
                  onEdit={() =>
                    router.push(`/dashboard/projects/${project._id}`)
                  }
                  onDelete={() =>
                    setDeleteDialog({ open: true, project, isBulk: false })
                  }
                  onToggleSelect={() => handleToggleSelect(project._id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <DataTable
          data={filteredProjects}
          columns={columns}
          keyExtractor={(project) => project._id}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          loading={projects === undefined}
          emptyMessage="No projects found"
        />
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, project: null, isBulk: false })
        }
        title={
          deleteDialog.isBulk ? "Delete Selected Projects" : "Delete Project"
        }
        description={
          deleteDialog.isBulk
            ? `Are you sure you want to delete ${selectedIds.size} selected projects? This action cannot be undone.`
            : `Are you sure you want to delete "${deleteDialog.project?.title}"? This action cannot be undone.`
        }
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
