import type { ComponentProps } from "react";
import { cn } from "../../utils";
import { LoaderIcon } from "lucide-react";

function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("text-primary size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
