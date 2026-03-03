"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Plus, Save, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ColorPicker } from "@/components/dashboard/ui/ColorPicker";
import { DatePicker } from "@/components/dashboard/ui/DatePicker";
import { TagsInput } from "@/components/dashboard/ui/TagsInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { api } from "../../../../../../../convex/_generated/api";

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  description: z.string().min(1, "Description is required"),
  highlights: z.array(z.string()),
  tags: z.array(z.string()),
  color: z.string().min(1, "Color is required"),
  icon: z.string().optional(),
  startDate: z.number().min(1, "Start date is required"),
  endDate: z.number().optional(),
  location: z.string().min(1, "Location is required"),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  initialData?: Partial<ExperienceFormData> & { _id?: string };
  mode: "create" | "edit";
}

export function ExperienceForm({ initialData, mode }: ExperienceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sortOrder, setSortOrder] = useState(0);

  const createExperience = useMutation(api.experience.createExperience);
  const updateExperience = useMutation(api.experience.updateExperience);

  const existingExperiences = useQuery(api.experience.getExperience, {});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: initialData?.company ?? "",
      role: initialData?.role ?? "",
      description: initialData?.description ?? "",
      highlights: initialData?.highlights ?? [],
      tags: initialData?.tags ?? [],
      color: initialData?.color ?? "#3B82F6",
      icon: initialData?.icon ?? "",
      startDate: initialData?.startDate,
      endDate: initialData?.endDate,
      location: initialData?.location ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "highlights" as never,
  });

  const onSubmit = (data: ExperienceFormData) => {
    startTransition(async () => {
      try {
        const experienceSortOrder =
          mode === "create" ? (existingExperiences?.length ?? 0) : sortOrder;

        if (mode === "create") {
          await createExperience({
            ...data,
            sortOrder: experienceSortOrder,
          });
          toast.success("Experience created successfully");
          router.push("/dashboard/experience");
        } else if (initialData?._id) {
          await updateExperience({
            id: initialData._id as any,
            ...data,
          });
          toast.success("Experience updated successfully");
          router.push("/dashboard/experience");
        }
      } catch {
        toast.error(
          mode === "create"
            ? "Failed to create experience"
            : "Failed to update experience",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            {...register("company")}
            placeholder="Company name"
            className="bg-background border-input"
          />
          {errors.company && (
            <p className="text-sm text-destructive">{errors.company.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            {...register("role")}
            placeholder="Job title"
            className="bg-background border-input"
          />
          {errors.role && (
            <p className="text-sm text-destructive">{errors.role.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="City, Country"
            className="bg-background border-input"
          />
          {errors.location && (
            <p className="text-sm text-destructive">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Accent Color</Label>
          <ColorPicker
            value={watch("color")}
            onChange={(color) => setValue("color", color)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <DatePicker
            value={watch("startDate")}
            onChange={(date) => date && setValue("startDate", date)}
          />
          {errors.startDate && (
            <p className="text-sm text-destructive">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <DatePicker
            value={watch("endDate")}
            onChange={(date) => setValue("endDate", date)}
          />
          <p className="text-xs text-muted-foreground">
            Leave empty for "Present"
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Brief description of your role and responsibilities"
          className="bg-background border-input min-h-[100px]"
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Highlights</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append("")}
          >
            <Plus className="size-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`highlights.${index}` as const)}
                placeholder="Key achievement or responsibility"
                className="bg-background border-input"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="shrink-0"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No highlights added. Click "Add" to create one.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagsInput
          value={watch("tags")}
          onChange={(tags) => setValue("tags", tags)}
          placeholder="Add skills and technologies"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin mr-2" />
          ) : (
            <Save className="size-4 mr-2" />
          )}
          {mode === "create" ? "Create Experience" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/experience")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
