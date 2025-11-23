import './StatusBadge.css';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase();

  const getStatusClass = () => {
    switch (normalizedStatus) {
      case 'PENDING':
        return 'status-badge-pending';
      case 'ACCEPTED':
        return 'status-badge-accepted';
      case 'REJECTED':
        return 'status-badge-rejected';
      default:
        return 'status-badge-default';
    }
  };

  const getStatusLabel = () => {
    switch (normalizedStatus) {
      case 'PENDING':
        return 'PENDING';
      case 'ACCEPTED':
        return 'ACCEPTED';
      case 'REJECTED':
        return 'REJECTED';
      default:
        return status;
    }
  };

  return (
    <span
      className={`status-badge ${getStatusClass()}`}
      role="status"
      aria-label={`Application status: ${getStatusLabel()}`}
    >
      {getStatusLabel()}
    </span>
  );
}
