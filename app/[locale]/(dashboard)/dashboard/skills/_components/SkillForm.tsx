"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2, Save } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { api } from "../../../../../../../convex/_generated/api";

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  icon: z.string().optional(),
  yearsOfExperience: z.number().optional(),
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillFormProps {
  initialData?: Partial<SkillFormData> & { _id?: string };
  mode: "create" | "edit";
}

const CATEGORIES = [
  "Frontend",
  "Backend",
  "DevOps",
  "Design",
  "Mobile",
  "Database",
  "Cloud",
  "Tools",
  "Other",
];

export function SkillForm({ initialData, mode }: SkillFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const createSkill = useMutation(api.skills.createSkill);
  const updateSkill = useMutation(api.skills.updateSkill);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      category: initialData?.category ?? "",
      level: initialData?.level ?? "beginner",
      icon: initialData?.icon ?? "",
      yearsOfExperience: initialData?.yearsOfExperience,
    },
  });

  const onSubmit = (data: SkillFormData) => {
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createSkill({
            ...data,
            sortOrder: 0,
          });
          toast.success("Skill created successfully");
          router.push("/dashboard/skills");
        } else if (initialData?._id) {
          await updateSkill({
            id: initialData._id as any,
            ...data,
          });
          toast.success("Skill updated successfully");
          router.push("/dashboard/skills");
        }
      } catch {
        toast.error(
          mode === "create"
            ? "Failed to create skill"
            : "Failed to update skill",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Skill Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="e.g., React, TypeScript, Figma"
            className="bg-background border-input"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={watch("category")}
            onValueChange={(value) => setValue("category", value)}
          >
            <SelectTrigger className="bg-background border-input">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-destructive">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select
            value={watch("level")}
            onValueChange={(value) =>
              setValue("level", value as SkillFormData["level"])
            }
          >
            <SelectTrigger className="bg-background border-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
          <Input
            id="yearsOfExperience"
            type="number"
            min="0"
            max="50"
            step="1"
            {...register("yearsOfExperience", { valueAsNumber: true })}
            placeholder="e.g., 3"
            className="bg-background border-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon (optional)</Label>
        <Input
          id="icon"
          {...register("icon")}
          placeholder="Icon name or URL"
          className="bg-background border-input"
        />
        <p className="text-xs text-muted-foreground">
          You can use Lucide icon names or custom URLs
        </p>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin mr-2" />
          ) : (
            <Save className="size-4 mr-2" />
          )}
          {mode === "create" ? "Create Skill" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/skills")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
