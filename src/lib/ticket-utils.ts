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