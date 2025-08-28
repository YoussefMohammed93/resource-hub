import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Statistics Cards Skeleton (Total Users, Messages Sent Today, Messages in Queue, Failed Messages)
export function BroadcastStatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      {Array.from({ length: 2 }, (_, i) => (
        <Card key={i} className="group dark:bg-muted/50">
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="space-y-3 sm:space-y-4 flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
                    <Skeleton className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <Skeleton className="h-4 sm:h-5 lg:h-6 w-32 mb-2" />
                    <Skeleton className="h-3 sm:h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <Skeleton className="h-8 sm:h-10 lg:h-12 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Broadcast Form Skeleton
export function BroadcastFormSkeleton() {
  return (
    <Card className="dark:bg-muted/50">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
            <Skeleton className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold">
              <Skeleton className="h-5 w-32" />
            </CardTitle>
            <Skeleton className="h-3 w-48 mt-1" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Message Title */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Message Content */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-32 w-full" />
        </div>

        {/* Message Category */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full sm:w-48" />
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full sm:w-48" />
        </div>

        {/* Send Button */}
        <div className="pt-4">
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

// Recent Activity Skeleton
export function BroadcastRecentActivitySkeleton() {
  return (
    <Card className="dark:bg-muted/50">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
            <Skeleton className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              <Skeleton className="h-4 w-28" />
            </CardTitle>
            <Skeleton className="h-3 w-36 mt-1" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="flex items-start space-x-3 p-3 rounded-lg bg-muted"
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-border">
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Broadcast Messages Log Skeleton
export function BroadcastMessagesLogSkeleton({
  isRTL = false,
}: {
  isRTL?: boolean;
}) {
  return (
    <Card className="dark:bg-muted/50">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
            <Skeleton className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              <Skeleton className="h-5 w-40" />
            </CardTitle>
            <Skeleton className="h-3 w-48 mt-1" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {Array.from({ length: 6 }, (_, i) => (
                  <th
                    key={i}
                    className={`${isRTL ? "text-right" : "text-left"} py-4 px-4`}
                  >
                    <Skeleton className="h-3 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: 5 }, (_, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, j) => (
                  <div key={j} className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Complete Broadcast Page Skeleton
export function BroadcastPageSkeleton({ isRTL = false }: { isRTL?: boolean }) {
  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "font-tajawal" : "font-sans"}`}
    >
      {/* Header */}
      <header
        className={`bg-background border-b border-border px-4 sm:px-5 py-4 ${isRTL ? "lg:mr-72" : "lg:ml-72"}`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}
          >
            {/* Mobile Hamburger Menu */}
            <div className="cursor-pointer lg:hidden p-2 hover:bg-muted rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center">
              <Skeleton className="w-5 h-5" />
            </div>
            <div
              className={`${isRTL && "ml-2"} w-8 h-8 bg-primary rounded-lg flex items-center justify-center`}
            >
              <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar placeholder */}
        <div
          className={`hidden lg:block w-72 h-screen bg-background border-r border-border fixed ${isRTL ? "right-0" : "left-0"} top-0`}
        >
          <div className="p-4 space-y-4">
            <div
              className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}
            >
              <div
                className={`${isRTL && "ml-2"} w-8 h-8 bg-primary rounded-lg flex items-center justify-center`}
              >
                <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
              </div>
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className={`flex items-center ${isRTL ? "space-x-reverse space-x-3" : "space-x-3"} p-3 rounded-lg`}
                >
                  <Skeleton className="w-5 h-5" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 ${isRTL ? "lg:mr-72" : "lg:ml-72"} p-4 sm:p-5 space-y-4 sm:space-y-5 bg-secondary/50`}
        >
          <BroadcastStatsCardsSkeleton />

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-5">
            {/* Broadcast Form - Center (4 columns) */}
            <div className="lg:col-span-4">
              <BroadcastFormSkeleton />
            </div>

            {/* Recent Activity - Right Sidebar (2 columns) */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
              <BroadcastRecentActivitySkeleton />
            </div>
          </div>

          {/* Broadcast Messages Log Section */}
          <BroadcastMessagesLogSkeleton isRTL={isRTL} />
        </main>
      </div>
    </div>
  );
}
