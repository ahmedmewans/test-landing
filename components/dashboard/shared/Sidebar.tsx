"use client";

import {
  BarChart3,
  Briefcase,
  Code2,
  FileText,
  Home,
  Inbox,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { name: "Experience", href: "/dashboard/experience", icon: FileText },
  { name: "Skills", href: "/dashboard/skills", icon: Code2 },
  { name: "Testimonials", href: "/dashboard/testimonials", icon: Star },
  { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, badge: true },
];

const secondaryNavigation = [
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return (
        pathname === `/${locale}/dashboard` ||
        pathname === `/${locale}/dashboard/`
      );
    }
    return pathname.startsWith(`/${locale}${href}`);
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="font-semibold text-sidebar-foreground">
              Portfolio
            </span>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "rounded-lg p-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "mx-auto",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={`/${locale}${item.href}`}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                        3
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 border-t border-sidebar-border pt-4">
          {!collapsed && (
            <span className="px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
              Tools
            </span>
          )}
          <div className="mt-2 space-y-1">
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={`/${locale}${item.href}`}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center",
          )}
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500">
            <User className="size-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">
                Admin
              </p>
              <p className="text-xs text-sidebar-foreground/70">
                admin@example.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
