import * as React from "react";
import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";

// fallback cn kalau kamu belum setup twMerge
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const statusMap = {
  scheduled: {
    icon: <Calendar className="w-4 h-4 mr-1" />,
    label: "Terjadwal",
    className: "text-xs border border-green-700 text-green-700",
  },
  ongoing: {
    icon: <Clock className="w-4 h-4 mr-1" />,
    label: "Berlangsung",
    className: "text-xs bg-gradient-to-br from-green-50 to-green-100 text-green-700 border border-transparent",
  },
  completed: {
    icon: <CheckCircle2 className="w-4 h-4 mr-1" />,
    label: "Selesai",
    className: "text-xs bg-green-600 text-white border border-transparent",
  },
  cancelled: {
    icon: <XCircle className="w-4 h-4 mr-1" />,
    label: "Dibatalkan",
    className: "text-xs bg-gray-500 text-white border border-transparent",
  },
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "scheduled" | "ongoing" | "completed" | "cancelled";
}

function Badge({ className, status, ...props }: BadgeProps) {
  const content = status ? statusMap[status] : null;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold",
        content?.className,
        className
      )}
      {...props}
    >
      {content?.icon}
      {content?.label || props.children}
    </div>
  );
}

export { Badge };
