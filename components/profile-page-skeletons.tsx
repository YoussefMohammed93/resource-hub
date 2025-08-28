import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Profile Header Skeleton
export function ProfileHeaderSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <header className="bg-background border-b border-border">
      <header className="px-4 sm:px-5 py-4">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"}`}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>
    </header>
  );
}

// User Info Card Skeleton
export function UserInfoCardSkeleton({}: { isRTL: boolean }) {
  return (
    <Card className="overflow-hidden dark:bg-muted/50 border-none shadow-xs py-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="relative p-6 sm:p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <Skeleton className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-background/80 backdrop-blur-sm" />
              {/* Online Status Indicator */}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-background rounded-full animate-pulse"></div>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left flex-1 space-y-4">
              <div className="space-y-2 flex flex-col">
                <Skeleton className="h-8 sm:h-10 lg:h-12 w-64 mx-auto sm:mx-0" />
                <Skeleton className="h-5 sm:h-6 w-48 mx-auto sm:mx-0" />
                {/* Status Badge */}
                <div className="flex justify-center sm:justify-start">
                  <Skeleton className="h-8 w-32 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Stats Cards Skeleton
export function StatsCardsSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i} className="group dark:bg-muted/50">
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="space-y-3 sm:space-y-4 flex-1">
                <div
                  className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
                >
                  <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 sm:h-5 w-32" />
                    <Skeleton className="h-3 sm:h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-8 sm:h-10 lg:h-12 w-20" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Subscription Card Skeleton
export function SubscriptionCardSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <Card className="dark:bg-muted/50">
      <CardHeader>
        <div
          className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
        >
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

// Credits Card Skeleton
export function CreditsCardSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <Card className="dark:bg-muted/50">
      <CardHeader>
        <div
          className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
        >
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="text-center space-y-2 w-fit bg-secondary/75 dark:bg-secondary p-4 rounded-xl">
            <Skeleton className="h-12 w-16 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        <Skeleton className="h-px w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

// Change Password Card Skeleton
export function ChangePasswordCardSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <Card className="dark:bg-muted/50">
      <CardHeader>
        <div
          className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
        >
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Current Password Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Password Requirements */}
          <Skeleton className="h-3 w-64" />
        </div>

        <Skeleton className="h-px w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

// Download History Card Skeleton - Full Width
export function DownloadHistoryCardSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <Card className="dark:bg-muted/50">
      <CardHeader className="space-y-6">
        <div
          className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
        >
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Filter */}
          <div className="flex sm:justify-end w-full sm:w-auto">
            <Skeleton className="h-10 w-full sm:w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[450px] overflow-y-auto">
          {Array.from({ length: 6 }, (_, i) => (
            <DownloadHistoryItemSkeleton key={i} isRTL={isRTL} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Skeleton className="h-10 w-32 mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
}

// Download History Item Skeleton (for individual items)
export function DownloadHistoryItemSkeleton({}: { isRTL: boolean }) {
  return (
    <div className="bg-secondary/50 dark:bg-muted border rounded-lg p-4 space-y-4 hover:bg-muted/50 transition-all duration-200">
      {/* Header with source and debug ID */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* File ID and format info */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>

      {/* Preview Image */}
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Footer with source URL and download button */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  );
}

// Empty State Skeleton (for when there's no data)
export function EmptyStateSkeleton() {
  return (
    <div className="py-12 text-center">
      <div className="flex flex-col items-center space-y-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-3 w-64 mx-auto" />
        </div>
      </div>
    </div>
  );
}

// Complete Profile Page Skeleton
export function ProfilePageSkeleton() {
  const isRTL = false; // Default to false for skeleton, will be handled by actual component

  return (
    <div className="min-h-screen bg-secondary/50 font-sans">
      <ProfileHeaderSkeleton isRTL={isRTL} />

      <main className="px-5 py-6 sm:py-8 space-y-4 sm:space-y-5">
        <UserInfoCardSkeleton isRTL={isRTL} />
        <StatsCardsSkeleton isRTL={isRTL} />

        {/* Subscription, Credits & Change Password Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <SubscriptionCardSkeleton isRTL={isRTL} />
          <CreditsCardSkeleton isRTL={isRTL} />
          <ChangePasswordCardSkeleton isRTL={isRTL} />
        </div>

        {/* Download History - Full Width */}
        <DownloadHistoryCardSkeleton isRTL={isRTL} />
      </main>
    </div>
  );
}
