
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const NotificationSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2].map((i) => (
        <Card key={i} className="border-[rgba(130,122,255,0.41)]">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
