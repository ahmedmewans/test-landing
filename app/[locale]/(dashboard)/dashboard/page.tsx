import { ActivityFeed } from "@/components/dashboard/ui/ActivityFeed";
import { DashboardStats } from "./_components/DashboardStats";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Your portfolio is performing well. Here's a quick overview.
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Recent Activity
          </h2>
          <ActivityFeed limit={10} />
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/dashboard/projects/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Briefcase className="size-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">New Project</p>
                <p className="text-sm text-muted-foreground">
                  Add a new project
                </p>
              </div>
            </a>
            <a
              href="/dashboard/experience/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="p-2 rounded-lg bg-green-500/10">
                <User className="size-5 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">New Experience</p>
                <p className="text-sm text-muted-foreground">
                  Add work history
                </p>
              </div>
            </a>
            <a
              href="/dashboard/skills/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Code2 className="size-5 text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">New Skill</p>
                <p className="text-sm text-muted-foreground">Add a skill</p>
              </div>
            </a>
            <a
              href="/dashboard/inbox"
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Mail className="size-5 text-yellow-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">View Inbox</p>
                <p className="text-sm text-muted-foreground">Check messages</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Briefcase, Code2, Mail, User } from "lucide-react";
