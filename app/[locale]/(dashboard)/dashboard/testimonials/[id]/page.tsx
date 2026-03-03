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
import { TestimonialForm } from "../_components/TestimonialForm";

export default function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const resolvedParams = use(params);
  const testimonialId = resolvedParams.id as Id<"testimonials">;

  const testimonial = useQuery(api.testimonials.getTestimonialById, {
    id: testimonialId,
  });
  const deleteTestimonial = useMutation(api.testimonials.deleteTestimonial);

  const handleDelete = async () => {
    try {
      await deleteTestimonial({ id: testimonialId });
      toast.success("Testimonial deleted successfully");
      router.push("/dashboard/testimonials");
    } catch {
      toast.error("Failed to delete testimonial");
    }
  };

  if (testimonial === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (testimonial === null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/testimonials"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Testimonial Not Found
            </h1>
            <p className="text-muted-foreground">
              This testimonial does not exist or has been deleted.
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
            href="/dashboard/testimonials"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Edit Testimonial
            </h1>
            <p className="text-muted-foreground">{testimonial.name}</p>
          </div>
        </div>
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 className="size-4 mr-2" />
          Delete
        </Button>
      </div>

      <TestimonialForm
        mode="edit"
        initialData={{
          _id: testimonial._id,
          name: testimonial.name,
          role: testimonial.role,
          content: testimonial.content,
          avatar: testimonial.avatar,
          rating: testimonial.rating,
          featured: testimonial.featured,
        }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Testimonial"
        description={`Are you sure you want to delete the testimonial from "${testimonial.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
