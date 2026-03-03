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
import { ProjectForm } from "../_components/ProjectForm";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const resolvedParams = use(params);
  const projectId = resolvedParams.id as Id<"projects">;

  const project = useQuery(api.projects.getProjectById, { id: projectId });
  const deleteProject = useMutation(api.projects.deleteProject);

  const handleDelete = async () => {
    try {
      await deleteProject({ id: projectId });
      toast.success("Project deleted successfully");
      router.push("/dashboard/projects");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  if (project === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/projects"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Project Not Found
            </h1>
            <p className="text-muted-foreground">
              This project does not exist or has been deleted.
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
            href="/dashboard/projects"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Project</h1>
            <p className="text-muted-foreground">{project.title}</p>
          </div>
        </div>
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 className="size-4 mr-2" />
          Delete
        </Button>
      </div>

      <ProjectForm
        mode="edit"
        initialData={{
          _id: project._id,
          title: project.title,
          slug: project.slug,
          category: project.category,
          description: project.description,
          content: project.content,
          tags: project.tags,
          color: project.color,
          featured: project.featured,
          status: project.status,
          thumbnail: project.thumbnail,
          images: project.images,
          mockupType: project.mockupType,
          startDate: project.startDate,
          endDate: project.endDate,
          metaTitle: project.metaTitle,
          metaDescription: project.metaDescription,
        }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
