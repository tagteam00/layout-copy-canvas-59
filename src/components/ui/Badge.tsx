import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-xl px-2 py-1 text-xs font-normal",
  {
    variants: {
      variant: {
        default: "bg-[rgba(130,122,255,1)] text-white",
        secondary: "bg-[rgba(140,255,110,0.5)] text-black",
        outline: "border border-[rgba(130,122,255,0.41)] text-black",
        ghost: "bg-[rgba(255,255,255,0.5)] text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
