import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface LoadingSkeletonProps {
  variant?: "table" | "cards" | "list" | "detail";
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = "table",
  count = 5,
  className,
}: LoadingSkeletonProps) {
  if (variant === "table") {
    return (
      <div
        className={cn("rounded-lg border border-neutral-800 p-4", className)}
      >
        <div className="mb-4 flex gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-24 bg-neutral-700" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(count)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-lg bg-neutral-800/50 p-3"
            >
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1 bg-neutral-700" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div
        className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
      >
        {[...Array(count)].map((_, i) => (
          <div key={i} className="rounded-lg border border-neutral-800 p-4">
            <Skeleton className="mb-3 h-4 w-3/4 bg-neutral-700" />
            <Skeleton className="mb-2 h-3 w-full bg-neutral-700" />
            <Skeleton className="mb-2 h-3 w-2/3 bg-neutral-700" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-6 w-16 bg-neutral-700" />
              <Skeleton className="h-6 w-16 bg-neutral-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)}>
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg border border-neutral-800 p-4"
          >
            <Skeleton className="size-10 rounded-full bg-neutral-700" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3 bg-neutral-700" />
              <Skeleton className="h-3 w-1/2 bg-neutral-700" />
            </div>
            <Skeleton className="h-8 w-20 bg-neutral-700" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-lg bg-neutral-700" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 bg-neutral-700" />
            <Skeleton className="h-4 w-32 bg-neutral-700" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full bg-neutral-700" />
          <Skeleton className="h-4 w-3/4 bg-neutral-700" />
          <Skeleton className="h-4 w-1/2 bg-neutral-700" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24 bg-neutral-700" />
          <Skeleton className="h-10 w-24 bg-neutral-700" />
        </div>
      </div>
    );
  }

  return <Skeleton className={cn("h-32 w-full bg-neutral-700", className)} />;
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex gap-4 rounded-lg bg-neutral-800/30 p-3">
      {[...Array(columns)].map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1 bg-neutral-700" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-neutral-800 p-4">
      <Skeleton className="mb-3 h-4 w-3/4 bg-neutral-700" />
      <Skeleton className="mb-2 h-3 w-full bg-neutral-700" />
      <Skeleton className="h-3 w-2/3 bg-neutral-700" />
    </div>
  );
}
