import { Badge } from "./ui/badge";

type Status = "Submitted" | "Resubmitted" | "Approved" | "Revision Required" | "Finalized" | "Closed" | "Pending" | "In Progress";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  "Submitted": "bg-blue-100 text-blue-800 border-blue-200",
  "Resubmitted": "bg-amber-100 text-amber-800 border-amber-200",
  "Approved": "bg-green-100 text-green-800 border-green-200",
  "Revision Required": "bg-red-100 text-red-800 border-red-200",
  "Finalized": "bg-purple-100 text-purple-800 border-purple-200",
  "Closed": "bg-gray-100 text-gray-800 border-gray-200",
  "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "In Progress": "bg-sky-100 text-sky-800 border-sky-200",
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <Badge className={`${statusStyles[status]} ${className}`} variant="outline">
      {status}
    </Badge>
  );
}
