"use client";

import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dashboard/ui/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { api } from "../../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../../convex/_generated/dataModel";
import { SkillForm } from "../_components/SkillForm";

export default function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const resolvedParams = use(params);
  const skillId = resolvedParams.id as Id<"skills">;

  const skill = useQuery(api.skills.getSkillById, { id: skillId });
  const deleteSkill = useMutation(api.skills.deleteSkill);

  const handleDelete = async () => {
    try {
      await deleteSkill({ id: skillId });
      toast.success("Skill deleted successfully");
      router.push("/dashboard/skills");
    } catch {
      toast.error("Failed to delete skill");
    }
  };

  if (skill === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (skill === null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/skills"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Skill Not Found
            </h1>
            <p className="text-muted-foreground">
              This skill does not exist or has been deleted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/skills"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Skill</h1>
            <p className="text-muted-foreground">{skill.name}</p>
          </div>
        </div>
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 className="size-4 mr-2" />
          Delete
        </Button>
      </div>

      <SkillForm
        mode="edit"
        initialData={{
          _id: skill._id,
          name: skill.name,
          category: skill.category,
          level: skill.level,
          icon: skill.icon,
          yearsOfExperience: skill.yearsOfExperience,
        }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Skill"
        description={`Are you sure you want to delete "${skill.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
