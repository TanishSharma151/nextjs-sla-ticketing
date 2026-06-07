import {
  Skeleton,
} from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-12 w-72" />

      <Skeleton className="h-24 w-full rounded-xl" />

      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}