import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-neutral-700 text-neutral-100",
        draft: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        published: "bg-green-500/20 text-green-400 border border-green-500/30",
        archived:
          "bg-neutral-600/20 text-neutral-400 border border-neutral-500/30",
        unread: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        read: "bg-neutral-600/20 text-neutral-400 border border-neutral-500/30",
        replied: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
        beginner: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
        intermediate: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        advanced: "bg-green-500/20 text-green-400 border border-green-500/30",
        expert: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
        success: "bg-green-500/20 text-green-400 border border-green-500/30",
        warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        error: "bg-red-500/20 text-red-400 border border-red-500/30",
        info: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type StatusVariant = VariantProps<typeof statusVariants>["variant"];

export interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const statusToVariant: Record<string, StatusVariant> = {
  draft: "draft",
  published: "published",
  archived: "archived",
  unread: "unread",
  read: "read",
  replied: "replied",
  beginner: "beginner",
  intermediate: "intermediate",
  advanced: "advanced",
  expert: "expert",
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolvedVariant = variant ?? statusToVariant[status] ?? "default";

  return (
    <span
      className={cn(statusVariants({ variant: resolvedVariant }), className)}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
