import {Skeleton} from "./skeleton";
import {Card, CardContent, CardHeader} from "./card";

const SkeletonCard = () => (
  <Card>
    <CardHeader className="gap-2">
      <Skeleton className="h-5 w-1/3" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-24" />
    </CardContent>
  </Card>
);

const SkeletonListItem = () => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
    <Skeleton className="h-4 w-16" />
  </div>
);

export { SkeletonCard, SkeletonListItem };
