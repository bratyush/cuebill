import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
  return (
    <Skeleton className="m-3 h-[268px] w-[350px]" />
  )
}

export function ChartSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <Skeleton className="h-80 col-span-2" />

        <Skeleton className="h-80 col-span-4" />

        <Skeleton className="h-80 col-span-4" />
      </div>

      {/* Canteen & Payment Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-80 col-span-1" />

        <Skeleton className="h-80 col-span-1" />

        <Skeleton className="h-80 col-span-1" />
      </div>
    </div>
  )
}
