import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex animate-pulse rounded-md items-center justify-center bg-primary/90", className)}
      {...props}
    />
  )
}

export { Skeleton }
