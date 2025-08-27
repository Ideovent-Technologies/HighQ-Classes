import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = "present" | "absent" | "leave";

export function getStatusBadge(status: StatusType, className?: string) {
  switch (status) {
    case "present":
      return <Badge className={cn("bg-green-500 text-white", className)}>Present</Badge>;
    case "absent":
      return <Badge className={cn("bg-red-500 text-white", className)}>Absent</Badge>;
    case "leave":
      return <Badge className={cn("bg-yellow-500 text-black", className)}>Leave</Badge>;
    default:
      return null;
  }
}

export function getStatusIcon(status: StatusType) {
  switch (status) {
    case "present":
      return <CheckCircle className="text-green-500" />;
    case "absent":
      return <XCircle className="text-red-500" />;
    case "leave":
      return <Clock className="text-yellow-500" />;
    default:
      return null;
  }
}
