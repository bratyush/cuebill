export function TableSkeleton() {
  return (
    <div
      role="status"
      className="flex h-[268px] w-[350px] m-3 animate-pulse items-center justify-center rounded-lg bg-gray-500/70 dark:bg-gray-700"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
