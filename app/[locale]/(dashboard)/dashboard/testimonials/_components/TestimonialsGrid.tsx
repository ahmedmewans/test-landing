"use client";

import { useMutation, useQuery } from "convex/react";
import { Edit, MoreHorizontal, Plus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dashboard/ui/ConfirmDialog";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";
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

type Testimonial = {
  _id: Id<"testimonials">;
  _creationTime: number;
  name: string;
  role: string;
  content: string;
  avatar?: Id<"_storage">;
  rating?: number;
  featured: boolean;
  sortOrder: number;
};

export function TestimonialsGrid() {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    testimonial: Testimonial | null;
  }>({ open: false, testimonial: null });

  const testimonials = useQuery(api.testimonials.getTestimonials, {});
  const deleteTestimonial = useMutation(api.testimonials.deleteTestimonial);

  const handleDelete = async () => {
    if (deleteDialog.testimonial) {
      try {
        await deleteTestimonial({ id: deleteDialog.testimonial._id });
        toast.success("Testimonial deleted successfully");
        setDeleteDialog({ open: false, testimonial: null });
      } catch {
        toast.error("Failed to delete testimonial");
      }
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "size-4",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground",
            )}
          />
        ))}
      </div>
    );
  };

  if (testimonials?.length === 0) {
    return (
      <EmptyState
        title="No testimonials yet"
        description="Add testimonials from your clients and colleagues."
        action={{
          label: "Add Testimonial",
          onClick: () => router.push("/dashboard/testimonials/new"),
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push("/dashboard/testimonials/new")}>
          <Plus className="size-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials?.map((testimonial) => (
          <div
            key={testimonial._id}
            className={cn(
              "rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors",
              testimonial.featured &&
                "ring-2 ring-primary ring-offset-2 ring-offset-background",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                {testimonial.avatar ? (
                  <div className="relative size-12 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={`/api/storage/${testimonial.avatar}`}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="size-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
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
                      router.push(`/dashboard/testimonials/${testimonial._id}`)
                    }
                  >
                    <Edit className="mr-2 size-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() =>
                      setDeleteDialog({ open: true, testimonial: testimonial })
                    }
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-3">{renderStars(testimonial.rating)}</div>

            <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
              "{testimonial.content}"
            </p>

            {testimonial.featured && (
              <div className="mt-3">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  Featured
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, testimonial: null })}
        title="Delete Testimonial"
        description={`Are you sure you want to delete the testimonial from "${deleteDialog.testimonial?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
