import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dashboard Header Skeleton
export function DashboardHeaderSkeleton({
  isRTL = false,
}: {
  isRTL?: boolean;
}) {
  return (
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
        <div className="flex items-center space-x-3">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </header>
  );
}

// Stats Cards Skeleton
export function DashboardStatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: 3 }, (_, i) => (
        <Card key={i} className="group dark:bg-muted/50">
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="space-y-3 sm:space-y-4 flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
                    <Skeleton className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 sm:h-5 lg:h-6 w-32" />
                    <Skeleton className="h-3 sm:h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <Skeleton className="h-8 sm:h-10 lg:h-12 w-16 sm:w-20" />
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

// Users Management Table Skeleton
export function DashboardUsersTableSkeleton({
  isRTL = false,
}: {
  isRTL?: boolean;
}) {
  return (
    <Card className="dark:bg-muted/50">
      <CardHeader className="w-full flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="w-full max-w-lg">
          <CardTitle className="text-lg font-semibold">
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <Skeleton className="h-4 w-64 mt-1" />
        </div>
        <div className="w-full flex flex-col sm:flex-row items-stretch md:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <Skeleton className="h-10 w-full md:w-64" />
          </div>
          <Skeleton className="h-10 w-full md:w-48" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto max-h-[278px] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {Array.from({ length: 6 }, (_, i) => (
                  <th
                    key={i}
                    className={`${isRTL ? "text-right" : "text-left"} py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                  >
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: 5 }, (_, i) => (
                <tr
                  key={i}
                  className="hover:bg-muted/50 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Skeleton className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="py-4 px-6">
                    <div
                      className={`flex items-center ${isRTL ? "justify-end" : "justify-end"}`}
                    >
                      <Skeleton className="h-8 w-20 rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3 max-h-[400px] overflow-y-auto">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-3 space-y-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Skeleton className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-green-100 border border-green-200 flex-shrink-0">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, j) => (
                  <div key={j} className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-border">
                <Skeleton className="h-10 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
        {/* Table Footer with Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border space-y-3 sm:space-y-0">
          <Skeleton className="h-4 w-48" />
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-muted-foreground">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${i === 0 ? "bg-green-500" : i === 1 ? "bg-destructive" : "bg-muted-foreground"}`}
                ></div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Action Cards Row Skeleton (Add Subscription, Credit History, Credit Analytics)
export function DashboardActionCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: 3 }, (_, i) => (
        <Card key={i} className="dark:bg-muted/50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                <Skeleton className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-lg font-semibold">
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Credit History Card - Special layout */}
            {i === 1 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {Array.from({ length: 3 }, (_, j) => (
                  <div
                    key={j}
                    className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-32" />
                        <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-3 w-24 mt-1" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : i === 2 ? (
              /* Credit Analytics Card - Special layout */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }, (_, j) => (
                    <div key={j} className="space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Add Subscription Card - Form layout */
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full rounded" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Management Actions Row Skeleton (Upgrade, Extend, Delete Subscription)
export function DashboardManagementCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: 3 }, (_, i) => (
        <Card
          key={i}
          className={`dark:bg-muted/50 ${i === 2 ? "border-destructive/20" : ""}`}
        >
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 ${i === 2 ? "bg-destructive/10 border border-destructive/10" : "bg-primary/10 border border-primary/10"} rounded-lg flex items-center justify-center`}
              >
                <Skeleton className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-lg font-semibold">
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Warning for delete card */}
              {i === 2 && (
                <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Skeleton className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                </div>
              )}
              <Skeleton
                className={`h-10 w-full rounded ${i === 2 ? "bg-destructive/20" : ""}`}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Sites Management Skeleton
export function DashboardSitesManagementSkeleton({
  isRTL = false,
}: {
  isRTL?: boolean;
}) {
  return (
    <Card className="dark:bg-muted/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <Skeleton className="h-10 w-24 rounded" />
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto max-h-[240px] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {Array.from({ length: 5 }, (_, i) => (
                  <th
                    key={i}
                    className={`${isRTL ? "text-right" : "text-left"} py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                  >
                    <Skeleton className="h-4 w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: 3 }, (_, i) => (
                <tr
                  key={i}
                  className="hover:bg-muted/50 transition-colors group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                        <Skeleton className="w-4 h-4" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div
                      className={`flex items-center ${isRTL ? "justify-end" : "justify-end"}`}
                    >
                      <Skeleton className="h-8 w-16 rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 space-y-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Skeleton className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="inline-flex items-center justify-center mt-4 space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-green-100 border border-green-200 flex-shrink-0">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-8 w-full rounded-lg" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-8 w-full rounded-lg" />
                </div>
              </div>
              <div className="w-full pt-4 border-t border-border">
                <Skeleton className="h-10 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Package Management Skeleton
export function DashboardPackageManagementSkeleton({}: { isRTL?: boolean }) {
  return (
    <Card className="dark:bg-muted/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <Skeleton className="h-10 w-28 rounded" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 hover:bg-muted/20 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <Skeleton className="w-4 h-4" />
                    </div>
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-16 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 3 }, (_, j) => (
                      <Skeleton key={j} className="h-6 w-16 rounded-full" />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <div className="space-y-1">
                    {Array.from({ length: 3 }, (_, j) => (
                      <div key={j} className="flex items-center space-x-2">
                        <Skeleton className="w-3 h-3 rounded-full" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Complete Dashboard Skeleton
export function DashboardSkeleton({ isRTL = false }: { isRTL?: boolean }) {
  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "font-tajawal" : "font-sans"}`}
    >
      <DashboardHeaderSkeleton isRTL={isRTL} />
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
          <DashboardStatsCardsSkeleton />
          <DashboardUsersTableSkeleton isRTL={isRTL} />
          <DashboardActionCardsSkeleton />
          <DashboardManagementCardsSkeleton />
          <DashboardSitesManagementSkeleton isRTL={isRTL} />
          <DashboardPackageManagementSkeleton isRTL={isRTL} />
        </main>
      </div>
    </div>
  );
}
