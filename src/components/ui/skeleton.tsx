import * as React from "react"
import { cn } from "@/lib/utils"

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-elpis-gray-light/50",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
