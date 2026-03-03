"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2, Save, Star } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ImageUpload } from "@/components/dashboard/ui/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { api } from "../../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../../convex/_generated/dataModel";

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  content: z.string().min(1, "Content is required"),
  avatar: z.custom<Id<"_storage">>().optional(),
  rating: z.number().min(0).max(5).optional(),
  featured: z.boolean(),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

interface TestimonialFormProps {
  initialData?: Partial<TestimonialFormData> & { _id?: string };
  mode: "create" | "edit";
}

export function TestimonialForm({ initialData, mode }: TestimonialFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hoveredStar, setHoveredStar] = useState(0);

  const createTestimonial = useMutation(api.testimonials.createTestimonial);
  const updateTestimonial = useMutation(api.testimonials.updateTestimonial);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      role: initialData?.role ?? "",
      content: initialData?.content ?? "",
      avatar: initialData?.avatar,
      rating: initialData?.rating ?? 5,
      featured: initialData?.featured ?? false,
    },
  });

  const rating = watch("rating");

  const onSubmit = (data: TestimonialFormData) => {
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createTestimonial({
            ...data,
            sortOrder: 0,
          });
          toast.success("Testimonial created successfully");
          router.push("/dashboard/testimonials");
        } else if (initialData?._id) {
          await updateTestimonial({
            id: initialData._id as any,
            ...data,
          });
          toast.success("Testimonial updated successfully");
          router.push("/dashboard/testimonials");
        }
      } catch {
        toast.error(
          mode === "create"
            ? "Failed to create testimonial"
            : "Failed to update testimonial",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Client name"
            className="bg-background border-input"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role / Company</Label>
          <Input
            id="role"
            {...register("role")}
            placeholder="e.g., CEO at Company"
            className="bg-background border-input"
          />
          {errors.role && (
            <p className="text-sm text-destructive">{errors.role.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Avatar (optional)</Label>
        <ImageUpload
          value={watch("avatar")}
          onChange={(id) => setValue("avatar", id)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Testimonial</Label>
        <Textarea
          id="content"
          {...register("content")}
          placeholder="What did they say about you?"
          className="bg-background border-input min-h-[120px]"
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValue("rating", star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-1 focus:outline-none"
            >
              <Star
                className={cn(
                  "size-6 transition-colors",
                  (hoveredStar || (rating ?? 0)) >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground",
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating ?? 0} / 5
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="featured">Featured</Label>
          <p className="text-sm text-muted-foreground">
            Featured testimonials appear prominently on your portfolio
          </p>
        </div>
        <Switch
          id="featured"
          checked={watch("featured")}
          onCheckedChange={(checked) => setValue("featured", checked)}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin mr-2" />
          ) : (
            <Save className="size-4 mr-2" />
          )}
          {mode === "create" ? "Create Testimonial" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/testimonials")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
