"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
}

export function Header({
  title,
  description,
  actions,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        {title && (
          <div>
            <h1 className="text-lg font-semibold text-white">{title}</h1>
            {description && (
              <p className="text-sm text-neutral-400">{description}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 border-neutral-700 bg-neutral-800 pl-9 text-sm text-white placeholder:text-neutral-500 focus:border-blue-500"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-neutral-400 hover:text-white"
        >
          <Bell className="size-5" />
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            2
          </span>
        </Button>

        {actions}
      </div>
    </header>
  );
}
