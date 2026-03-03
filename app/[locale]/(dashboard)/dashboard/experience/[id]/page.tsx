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
import { ExperienceForm } from "../_components/ExperienceForm";

export default function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const resolvedParams = use(params);
  const experienceId = resolvedParams.id as Id<"experience">;

  const experience = useQuery(api.experience.getExperienceById, {
    id: experienceId,
  });
  const deleteExperience = useMutation(api.experience.deleteExperience);

  const handleDelete = async () => {
    try {
      await deleteExperience({ id: experienceId });
      toast.success("Experience deleted successfully");
      router.push("/dashboard/experience");
    } catch {
      toast.error("Failed to delete experience");
    }
  };

  if (experience === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (experience === null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/experience"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Experience Not Found
            </h1>
            <p className="text-muted-foreground">
              This experience does not exist or has been deleted.
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
            href="/dashboard/experience"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Edit Experience
            </h1>
            <p className="text-muted-foreground">
              {experience.role} at {experience.company}
            </p>
          </div>
        </div>
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 className="size-4 mr-2" />
          Delete
        </Button>
      </div>

      <ExperienceForm
        mode="edit"
        initialData={{
          _id: experience._id,
          company: experience.company,
          role: experience.role,
          description: experience.description,
          highlights: experience.highlights,
          tags: experience.tags,
          color: experience.color,
          icon: experience.icon,
          startDate: experience.startDate,
          endDate: experience.endDate,
          location: experience.location,
        }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Experience"
        description={`Are you sure you want to delete "${experience.role} at ${experience.company}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
