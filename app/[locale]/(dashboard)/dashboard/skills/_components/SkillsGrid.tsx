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
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQuery } from "convex/react";
import { Edit, GripVertical, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dashboard/ui/ConfirmDialog";
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

type Skill = {
  _id: Id<"skills">;
  _creationTime: number;
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  icon?: string;
  sortOrder: number;
  yearsOfExperience?: number;
};

const levelColors: Record<string, string> = {
  beginner: "bg-gray-500",
  intermediate: "bg-blue-500",
  advanced: "bg-green-500",
  expert: "bg-purple-500",
};

interface SortableSkillCardProps {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableSkillCard({
  skill,
  onEdit,
  onDelete,
}: SortableSkillCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors",
        isDragging && "z-50 opacity-90 shadow-lg",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <GripVertical className="size-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate">
              {skill.name}
            </h4>
            <StatusBadge status={skill.level} className="mt-1" />
          </div>
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

      <div className="mt-3 ml-6">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              levelColors[skill.level],
            )}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span className="capitalize">{skill.level}</span>
          {skill.yearsOfExperience && (
            <span>{skill.yearsOfExperience} years</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function SkillsGrid() {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    skill: Skill | null;
  }>({ open: false, skill: null });

  const skills = useQuery(api.skills.getSkills, {});
  const deleteSkill = useMutation(api.skills.deleteSkill);
  const reorderSkills = useMutation(api.skills.reorderSkills);

  const groupedSkills = useMemo(() => {
    if (!skills) return {};
    const grouped = skills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      },
      {} as Record<string, Skill[]>,
    );

    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => a.sortOrder - b.sortOrder);
    });

    return grouped;
  }, [skills]);

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

  const handleDelete = async () => {
    if (deleteDialog.skill) {
      try {
        await deleteSkill({ id: deleteDialog.skill._id });
        toast.success("Skill deleted successfully");
        setDeleteDialog({ open: false, skill: null });
      } catch {
        toast.error("Failed to delete skill");
      }
    }
  };

  const handleDragEnd = (category: string) => (event: DragEndEvent) => {
    const { active, over } = event;
    const categorySkills = groupedSkills[category] || [];

    if (over && active.id !== over.id) {
      const oldIndex = categorySkills.findIndex((s) => s._id === active.id);
      const newIndex = categorySkills.findIndex((s) => s._id === over.id);

      const newOrder = arrayMove(
        categorySkills.map((s) => s._id),
        oldIndex,
        newIndex,
      );

      try {
        reorderSkills({ skillIds: newOrder });
        toast.success("Order updated successfully");
      } catch {
        toast.error("Failed to update order");
      }
    }
  };

  if (skills?.length === 0) {
    return (
      <EmptyState
        title="No skills yet"
        description="Add your skills to get started."
        action={{
          label: "Add Skill",
          onClick: () => router.push("/dashboard/skills/new"),
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push("/dashboard/skills/new")}>
          <Plus className="size-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">{category}</h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd(category)}
          >
            <SortableContext
              items={categorySkills.map((s) => s._id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categorySkills.map((skill) => (
                  <SortableSkillCard
                    key={skill._id}
                    skill={skill}
                    onEdit={() => router.push(`/dashboard/skills/${skill._id}`)}
                    onDelete={() => setDeleteDialog({ open: true, skill })}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ))}

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, skill: null })}
        title="Delete Skill"
        description={`Are you sure you want to delete "${deleteDialog.skill?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
