"use client";

import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import {
  Briefcase,
  Code2,
  Mail,
  Pencil,
  Plus,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { api } from "@/../convex/_generated/api";
import { cn } from "@/lib/utils";

type Activity = {
  _id: string;
  _creationTime: number;
  action: "create" | "update" | "delete";
  entityType: string;
  entityId?: string;
  entityName?: string;
  description: string;
};

const actionConfig = {
  create: {
    icon: Plus,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    label: "Created",
  },
  update: {
    icon: Pencil,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    label: "Updated",
  },
  delete: {
    icon: Trash2,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    label: "Deleted",
  },
};

const entityTypeConfig: Record<
  string,
  { icon: typeof Briefcase; label: string }
> = {
  project: { icon: Briefcase, label: "Project" },
  experience: { icon: User, label: "Experience" },
  skill: { icon: Code2, label: "Skill" },
  testimonial: { icon: Star, label: "Testimonial" },
  contact: { icon: Mail, label: "Contact" },
};

interface ActivityFeedProps {
  limit?: number;
  className?: string;
}

export function ActivityFeed({ limit = 10, className }: ActivityFeedProps) {
  const activities = useQuery(api.activityLog.getRecentActivity, { limit });

  if (!activities || activities.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        No recent activity
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {activities.map((activity: Activity) => {
        const action = actionConfig[activity.action];
        const entity = entityTypeConfig[activity.entityType] || {
          icon: Briefcase,
          label: activity.entityType,
        };
        const ActionIcon = action.icon;
        const EntityIcon = entity.icon;

        return (
          <div
            key={activity._id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={cn("p-2 rounded-lg", action.bgColor)}>
              <ActionIcon className={cn("size-4", action.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("font-medium", action.color)}>
                  {action.label}
                </span>
                <EntityIcon className="size-3 text-muted-foreground" />
                <span className="text-muted-foreground">{entity.label}</span>
              </div>
              <p className="text-sm text-foreground mt-1 truncate">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(activity._creationTime, {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
