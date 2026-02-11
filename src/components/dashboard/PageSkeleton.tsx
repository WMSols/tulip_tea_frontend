import { Skeleton } from "@/components/ui/skeleton";
import { StatCardSkeleton } from "./StatCardSkeleton";
import { TableSkeleton } from "./TableSkeleton";
import { CardGridSkeleton } from "./CardGridSkeleton";

interface PageSkeletonProps {
  /** Number of stat cards to show */
  statCards?: number;
  /** Number of stat card columns */
  statColumns?: number;
  /** Type of content skeleton: table or card grid */
  contentType?: "table" | "cards";
  /** Number of table columns */
  tableColumns?: number;
  /** Number of table rows */
  tableRows?: number;
  /** Number of cards in grid */
  cardCount?: number;
  /** Show filter/tabs skeleton */
  showFilters?: boolean;
  /** Show header skeleton */
  showHeader?: boolean;
}

export function PageSkeleton({
  statCards = 4,
  statColumns = 4,
  contentType = "table",
  tableColumns = 5,
  tableRows = 6,
  cardCount = 3,
  showFilters = false,
  showHeader = true,
}: PageSkeletonProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      )}

      {/* Stat cards */}
      {statCards > 0 && (
        <StatCardSkeleton count={statCards} columns={statColumns} />
      )}

      {/* Filters/tabs */}
      {showFilters && (
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      )}

      {/* Content */}
      {contentType === "table" ? (
        <TableSkeleton columns={tableColumns} rows={tableRows} />
      ) : (
        <CardGridSkeleton count={cardCount} />
      )}
    </div>
  );
}
