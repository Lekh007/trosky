import { Skeleton } from "@/components/ui/skeleton";

export default function OccupancyLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      <Skeleton className="h-[460px] rounded-lg" />
    </div>
  );
}
