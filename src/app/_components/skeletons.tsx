export function TableSkeleton() {
  return (
    <div
      role="status"
      className="flex h-[268px] w-[350px] m-5 animate-pulse items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-700"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
