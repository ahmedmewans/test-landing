"use client";

import { useQuery } from "convex/react";
import { Briefcase, Eye, Inbox } from "lucide-react";
import { api } from "../../../../../../convex/_generated/api";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  loading?: boolean;
}

function StatCard({ title, value, icon, trend, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="p-6 bg-card rounded-xl border border-border">
        <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2" />
        <div className="h-10 w-16 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <p className="text-4xl font-bold mt-2">{value}</p>
      {trend && <p className="text-sm text-green-400 mt-1">{trend}</p>}
    </div>
  );
}

export function DashboardStats() {
  const projects = useQuery(api.projects.getProjects, {});
  const contacts = useQuery(api.contacts.getContacts, { status: "unread" });
  const analytics = useQuery(api.analytics.getAnalyticsBrief, {});

  const isLoading =
    projects === undefined || contacts === undefined || analytics === undefined;

  const publishedProjects =
    projects?.filter((p) => p.status === "published").length ?? 0;
  const unreadCount = contacts?.length ?? 0;
  const pageViews = analytics?.length ?? 0;

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Projects"
        value={isLoading ? 0 : (projects?.length ?? 0)}
        icon={<Briefcase className="size-5" />}
        trend={
          publishedProjects > 0 ? `${publishedProjects} published` : undefined
        }
        loading={isLoading}
      />
      <StatCard
        title="Unread Messages"
        value={isLoading ? 0 : unreadCount}
        icon={<Inbox className="size-5" />}
        loading={isLoading}
      />
      <StatCard
        title="Page Views"
        value={isLoading ? "0" : formatNumber(pageViews)}
        icon={<Eye className="size-5" />}
        loading={isLoading}
      />
    </div>
  );
}
