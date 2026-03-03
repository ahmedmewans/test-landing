"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ColorPicker } from "@/components/dashboard/ui/ColorPicker";
import { DatePicker } from "@/components/dashboard/ui/DatePicker";
import { ImageGallery } from "@/components/dashboard/ui/ImageGallery";
import { ImageUpload } from "@/components/dashboard/ui/ImageUpload";
import { MarkdownUpload } from "@/components/dashboard/ui/MarkdownUpload";
import { TagsInput } from "@/components/dashboard/ui/TagsInput";
import { Editor } from "@/components/tiptap/editor";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { api } from "../../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../../convex/_generated/dataModel";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string(),
  tags: z.array(z.string()),
  color: z.string().min(1, "Color is required"),
  featured: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
  thumbnail: z.custom<Id<"_storage">>().optional(),
  images: z.array(z.custom<Id<"_storage">>()).optional(),
  mockupType: z.string().optional(),
  startDate: z.number().optional(),
  endDate: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData> & { _id?: string };
  mode: "create" | "edit";
}

export function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialData?.content ?? "");
  const [isPending, startTransition] = useTransition();

  const createProject = useMutation(api.projects.createProject);
  const updateProject = useMutation(api.projects.updateProject);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      category: initialData?.category ?? "",
      description: initialData?.description ?? "",
      content: initialData?.content ?? "",
      tags: initialData?.tags ?? [],
      color: initialData?.color ?? "#3B82F6",
      featured: initialData?.featured ?? false,
      status: initialData?.status ?? "draft",
      thumbnail: initialData?.thumbnail,
      images: initialData?.images ?? [],
      mockupType: initialData?.mockupType,
      startDate: initialData?.startDate,
      endDate: initialData?.endDate,
      metaTitle: initialData?.metaTitle ?? "",
      metaDescription: initialData?.metaDescription ?? "",
    },
  });

  const title = watch("title");

  const generateSlug = () => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setValue("slug", slug);
  };

  const handleMarkdownParsed = (data: {
    title: string;
    slug: string;
    category: string;
    description: string;
    content: string;
    tags: string[];
    color: string;
    featured: boolean;
    status: "draft" | "published" | "archived";
    metaTitle?: string;
    metaDescription?: string;
  }) => {
    setValue("title", data.title);
    setValue("slug", data.slug);
    setValue("category", data.category);
    setValue("description", data.description);
    setValue("tags", data.tags);
    setValue("color", data.color);
    setValue("featured", data.featured);
    setValue("status", data.status);
    if (data.metaTitle) setValue("metaTitle", data.metaTitle);
    if (data.metaDescription) setValue("metaDescription", data.metaDescription);
    setContent(data.content);
    toast.success("Markdown file imported successfully");
  };

  const onSubmit = (data: ProjectFormData) => {
    startTransition(async () => {
      try {
        const projectData = {
          ...data,
          content,
          sortOrder: 0,
        };

        if (mode === "create") {
          await createProject(projectData);
          toast.success("Project created successfully");
          router.push("/dashboard/projects");
        } else if (initialData?._id) {
          await updateProject({
            id: initialData._id as any,
            ...projectData,
          });
          toast.success("Project updated successfully");
          router.push("/dashboard/projects");
        }
      } catch {
        toast.error(
          mode === "create"
            ? "Failed to create project"
            : "Failed to update project",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {mode === "create" && (
            <div className="space-y-2">
              <Label>Import from Markdown</Label>
              <MarkdownUpload onParsed={handleMarkdownParsed} />
            </div>
          )}

          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <ImageUpload
              value={watch("thumbnail")}
              onChange={(id) => setValue("thumbnail", id)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Project title"
                className="bg-background border-input"
              />
              {errors.title && (
                <p className="text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  {...register("slug")}
                  placeholder="project-slug"
                  className="bg-background border-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSlug}
                  className="shrink-0"
                >
                  Generate
                </Button>
              </div>
              {errors.slug && (
                <p className="text-sm text-red-400">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of the project"
              className="bg-background border-input min-h-[100px]"
            />
            {errors.description && (
              <p className="text-sm text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Editor initialContent={content} onChange={setContent} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...register("category")}
                placeholder="e.g., SaaS Dashboard, Mobile App"
                className="bg-background border-input"
              />
              {errors.category && (
                <p className="text-sm text-red-400">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mockupType">Mockup Type</Label>
              <Input
                id="mockupType"
                {...register("mockupType")}
                placeholder="e.g., dashboard, mobile, gallery"
                className="bg-background border-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagsInput
              value={watch("tags")}
              onChange={(tags) => setValue("tags", tags)}
              placeholder="Add tags and press Enter"
            />
          </div>

          <div className="space-y-2">
            <Label>Gallery Images</Label>
            <ImageGallery
              value={watch("images")}
              onChange={(images) => setValue("images", images)}
              maxImages={10}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border p-4 space-y-4">
            <h3 className="font-medium text-foreground">Status & Visibility</h3>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue(
                    "status",
                    value as "draft" | "published" | "archived",
                  )
                }
              >
                <SelectTrigger className="bg-background border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Featured</Label>
              <Switch
                id="featured"
                checked={watch("featured")}
                onCheckedChange={(checked) => setValue("featured", checked)}
              />
            </div>
          </div>

          <div className="rounded-lg border border-border p-4 space-y-4">
            <h3 className="font-medium text-foreground">Appearance</h3>

            <div className="space-y-2">
              <Label>Accent Color</Label>
              <ColorPicker
                value={watch("color")}
                onChange={(color) => setValue("color", color)}
              />
            </div>
          </div>

          <div className="rounded-lg border border-border p-4 space-y-4">
            <h3 className="font-medium text-foreground">Timeline</h3>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <DatePicker
                value={watch("startDate")}
                onChange={(date) => setValue("startDate", date)}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker
                value={watch("endDate")}
                onChange={(date) => setValue("endDate", date)}
              />
            </div>
          </div>

          <div className="rounded-lg border border-border p-4 space-y-4">
            <h3 className="font-medium text-foreground">SEO</h3>

            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                {...register("metaTitle")}
                placeholder="SEO title"
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                {...register("metaDescription")}
                placeholder="SEO description"
                className="bg-background border-input min-h-[80px]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : (
              <Save className="size-4 mr-2" />
            )}
            {mode === "create" ? "Create Project" : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
