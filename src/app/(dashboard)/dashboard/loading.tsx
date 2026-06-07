import {
  Skeleton,
} from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-52" />

        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 rounded-xl" />

        <Skeleton className="h-32 rounded-xl" />

        <Skeleton className="h-32 rounded-xl" />
      </div>

      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );
}