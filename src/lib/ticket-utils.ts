export function getPriorityVariant(
  priority: string,
):
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline' {
  switch (priority) {
    case 'HIGH':
      return 'destructive';

    case 'MEDIUM':
      return 'default';

    case 'LOW':
      return 'secondary';

    default:
      return 'outline';
  }
}

export function getStatusVariant(
  status: string,
):
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline' {
  switch (status) {
    case 'OPEN':
      return 'destructive';

    case 'IN_PROGRESS':
      return 'default';

    case 'RESOLVED':
      return 'secondary';

    case 'CLOSED':
      return 'outline';

    default:
      return 'outline';
  }
}

export function getPriorityLabel(
  priority: string,
): string {
  switch (priority) {
    case 'HIGH':
      return 'High Priority';

    case 'MEDIUM':
      return 'Medium Priority';

    case 'LOW':
      return 'Low Priority';

    default:
      return priority;
  }
}

export function getPriorityBadgeClass(
  priority: string,
): string {
  switch (priority) {
    case 'HIGH':
      return 'border-pink-500/20 bg-pink-500/15 text-pink-400';

    case 'MEDIUM':
      return 'border-amber-500/20 bg-amber-500/15 text-amber-400';

    case 'LOW':
      return 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400';

    default:
      return 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400';
  }
}

export function getStatusBadgeClass(
  status: string,
): string {
  switch (status) {
    case 'OPEN':
      return 'border-transparent bg-violet-500 text-white';

    case 'IN_PROGRESS':
      return 'border-transparent bg-blue-500 text-white';

    case 'RESOLVED':
      return 'border-emerald-500/40 bg-transparent text-emerald-400';

    case 'CLOSED':
      return 'border-zinc-500/40 bg-transparent text-zinc-400';

    default:
      return 'border-zinc-500/40 bg-transparent text-zinc-400';
  }
}
