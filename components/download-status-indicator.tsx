/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  FileDown,
} from "lucide-react";
import { downloadApi, type DownloadTask } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import { downloadFileWithSaveDialog } from "@/lib/download-utils";

interface DownloadStatusIndicatorProps {
  className?: string;
}

export function DownloadStatusIndicator({
  className,
}: DownloadStatusIndicatorProps) {
  const { t } = useTranslation("common");
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [downloadTasks, setDownloadTasks] = useState<DownloadTask[]>([]);
  const [hasActiveDownloads, setHasActiveDownloads] = useState(false);
  const [showAttentionAnimation, setShowAttentionAnimation] = useState(false);
  const [downloadingTasks, setDownloadingTasks] = useState<Set<string>>(
    new Set()
  );
  const [recentlyDownloadedTasks, setRecentlyDownloadedTasks] = useState<
    Set<string>
  >(new Set());

  // Fetch download tasks
  const fetchDownloadTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setDownloadTasks([]);
      setHasActiveDownloads(false);
      return;
    }

    try {
      // Don't show loading spinner for background updates
      const response = await downloadApi.getDownloadTasks();

      // Handle different response formats
      let tasks: DownloadTask[] = [];
      if (response.success) {
        if (response.data?.data && Array.isArray(response.data.data)) {
          tasks = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          tasks = response.data;
        } else if (response.data) {
        }
      }

      // Sort tasks to show latest at the top
      const sortedTasks = tasks.sort((a, b) => {
        // First, prioritize recently downloaded files (those that user just downloaded)
        const aRecentlyDownloaded = recentlyDownloadedTasks.has(
          a.data?.id || ""
        );
        const bRecentlyDownloaded = recentlyDownloadedTasks.has(
          b.data?.id || ""
        );

        if (aRecentlyDownloaded && !bRecentlyDownloaded) return -1;
        if (!aRecentlyDownloaded && bRecentlyDownloaded) return 1;

        // Then prioritize by status - completed tasks at top, then active, then others
        const statusPriority = {
          completed: 1,
          downloading: 2,
          preparing: 3,
          queued: 4,
          pending: 5,
          failed: 6,
        };

        const aPriority =
          statusPriority[a.progress?.status as keyof typeof statusPriority] ||
          7;
        const bPriority =
          statusPriority[b.progress?.status as keyof typeof statusPriority] ||
          7;

        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }

        // Then sort by creation time (assuming newer tasks have higher IDs)
        return (b.data?.id || "").localeCompare(a.data?.id || "");
      });

      setDownloadTasks(sortedTasks);

      // Check if there are any active downloads
      const activeDownloads = sortedTasks.filter(
        (task) =>
          task.progress?.status === "downloading" ||
          task.progress?.status === "preparing" ||
          task.progress?.status === "queued" ||
          task.progress?.status === "pending"
      );
      setHasActiveDownloads(activeDownloads.length > 0);
    } catch (error) {
      console.error(
        "[Download Indicator] Failed to fetch download tasks:",
        error
      );
      setDownloadTasks([]);
      setHasActiveDownloads(false);
    } finally {
      // Don't set loading to false since we never set it to true
      // setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Initial fetch and periodic updates
  useEffect(() => {
    if (isAuthenticated) {
      fetchDownloadTasks();

      // Set up continuous polling to catch new tasks immediately
      const interval = setInterval(() => {
        fetchDownloadTasks();
      }, 2000); // Poll every 2 seconds to catch new tasks quickly

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchDownloadTasks]);

  // Listen for custom events when new download tasks are created
  useEffect(() => {
    if (isAuthenticated) {
      const handleTaskCreated = (event: CustomEvent) => {
        // Immediately fetch tasks when a new one is created
        fetchDownloadTasks();

        // Trigger attention animation
        setShowAttentionAnimation(true);
        setTimeout(() => setShowAttentionAnimation(false), 3000);

        // Store task details for later credit deduction
        const { taskId, sitePrice } = event.detail;
        if (taskId && sitePrice) {
          sessionStorage.setItem(`task_${taskId}_price`, sitePrice.toString());
        }
      };

      const handleStorageChange = () => {
        fetchDownloadTasks();
      };

      // Listen for custom event from download verification sheet
      window.addEventListener(
        "downloadTaskCreated",
        handleTaskCreated as EventListener
      );
      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("focus", handleStorageChange);

      return () => {
        window.removeEventListener(
          "downloadTaskCreated",
          handleTaskCreated as EventListener
        );
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("focus", handleStorageChange);
      };
    }
  }, [isAuthenticated, fetchDownloadTasks]);

  // Get status icon and color
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusIcon = (status: string, progress?: number) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "downloading":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "preparing":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "queued":
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t("download.indicator.status.completed", "Completed");
      case "failed":
        return t("download.indicator.status.failed", "Failed");
      case "downloading":
        return t("download.indicator.status.downloading", "Downloading");
      case "preparing":
        return t("download.indicator.status.preparing", "Preparing");
      case "queued":
        return t("download.indicator.status.queued", "Queued");
      default:
        return t("download.indicator.status.unknown", "Unknown");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "downloading":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "preparing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "queued":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Don't render if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const totalTasks = downloadTasks.length;
  const activeTasks = downloadTasks.filter(
    (task) =>
      task.progress.status === "downloading" ||
      task.progress.status === "preparing" ||
      task.progress.status === "queued"
  ).length;

  // Handle popover open/close
  const handlePopoverChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={handlePopoverChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          data-download-indicator
          className={cn(
            "relative h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-all duration-300",
            showAttentionAnimation && "animate-pulse bg-primary/20 scale-110",
            className
          )}
        >
          <FileDown
            className={cn(
              "h-4 w-4 transition-colors text-muted-foreground duration-300",
              showAttentionAnimation && "text-primary"
            )}
          />
          {hasActiveDownloads && (
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
          )}
          {showAttentionAnimation && (
            <div className="absolute inset-0 rounded-md bg-primary/10 animate-ping" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-80 p-0", isRTL ? "mr-2" : "ml-2")}
        align={isRTL ? "end" : "start"}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              {t("download.indicator.title", "Downloads")}
            </h3>
          </div>
          {totalTasks > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {activeTasks > 0
                ? t(
                    "download.indicator.activeCount",
                    `${activeTasks} active, ${totalTasks} total`,
                    { count: activeTasks, total: totalTasks }
                  )
                : t(
                    "download.indicator.totalCount",
                    `${totalTasks} downloads`,
                    { count: totalTasks }
                  )}
            </p>
          )}
        </div>

        <ScrollArea className="h-[300px]">
          {totalTasks === 0 ? (
            <div className="flex flex-col items-center justify-center h-[280px] p-4 text-center text-sm text-muted-foreground">
              <FileDown className="h-8 w-8 mx-auto mb-2 opacity-50" />
              {t("download.indicator.empty", "No downloads yet")}
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {downloadTasks.map((task, index) => (
                <div
                  key={`${task.data.id}-${index}`}
                  className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getStatusIcon(
                        task.progress.status,
                        task.progress.progress
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-medium truncate">
                          {task.data.platform_name ||
                            t(
                              "download.indicator.messages.unknownPlatform",
                              "Unknown Platform"
                            )}
                        </p>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            getStatusColor(task.progress.status)
                          )}
                        >
                          {getStatusText(task.progress.status)}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground truncate max-w-[250px] mb-2">
                        {task.data.downloadUrl}
                      </p>

                      {(task.progress.status === "downloading" ||
                        task.progress.status === "preparing") && (
                        <div className="space-y-1">
                          <Progress
                            value={task.progress.progress}
                            className="h-1.5"
                          />
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "download.indicator.progress.percentage",
                              "{{percent}}%",
                              { percent: task.progress.progress }
                            )}
                          </p>
                        </div>
                      )}

                      {task.progress.status === "completed" &&
                        task.download && (
                          <Button
                            size="sm"
                            variant="default"
                            className="mt-2 h-7 text-xs"
                            disabled={downloadingTasks.has(task.data.id)}
                            onClick={async () => {
                              if (
                                task.download?.downloadUrl &&
                                !downloadingTasks.has(task.data.id)
                              ) {
                                const taskId = task.data.id;

                                // Add to downloading set to prevent multiple clicks
                                setDownloadingTasks((prev) =>
                                  new Set(prev).add(taskId)
                                );

                                try {
                                  // Start file download with save dialog
                                  await downloadFileWithSaveDialog(
                                    task.download.downloadUrl,
                                    {
                                      filename: task.download?.filename,
                                      onComplete: async (filename: string) => {
                                        // Mark this task as recently downloaded to show it at the top
                                        setRecentlyDownloadedTasks((prev) => {
                                          const newSet = new Set(prev);
                                          newSet.add(taskId);
                                          return newSet;
                                        });

                                        // Remove the "recently downloaded" status after 30 seconds
                                        setTimeout(() => {
                                          setRecentlyDownloadedTasks((prev) => {
                                            const newSet = new Set(prev);
                                            newSet.delete(taskId);
                                            return newSet;
                                          });
                                        }, 30000);

                                        // Show success toast
                                        import("sonner").then(({ toast }) => {
                                          toast.success(
                                            t(
                                              "download.indicator.fileSaved",
                                              "File saved successfully!"
                                            ),
                                            {
                                              duration: 5000,
                                              description: `${filename}`,
                                            }
                                          );
                                        });

                                        // Remove from downloading set to reset button state
                                        setDownloadingTasks((prev) => {
                                          const newSet = new Set(prev);
                                          newSet.delete(taskId);
                                          return newSet;
                                        });

                                        // Refresh the task list to update the sorting
                                        fetchDownloadTasks();
                                      },
                                      onError: (error: Error) => {
                                        console.error(
                                          "File download error:",
                                          error
                                        );
                                        import("sonner").then(({ toast }) => {
                                          toast.error(
                                            t(
                                              "download.indicator.downloadError",
                                              "Download failed"
                                            ),
                                            {
                                              duration: 5000,
                                              description: error.message,
                                            }
                                          );
                                        });

                                        // Remove from downloading set
                                        setDownloadingTasks((prev) => {
                                          const newSet = new Set(prev);
                                          newSet.delete(taskId);
                                          return newSet;
                                        });
                                      },
                                    }
                                  );
                                } catch (error) {
                                  console.error(
                                    "Download initiation error:",
                                    error
                                  );
                                  import("sonner").then(({ toast }) => {
                                    toast.error(
                                      t(
                                        "download.indicator.downloadInitError",
                                        "Failed to start download"
                                      ),
                                      {
                                        duration: 5000,
                                        description:
                                          error instanceof Error
                                            ? error.message
                                            : "Unknown error",
                                      }
                                    );
                                  });

                                  // Remove from downloading set
                                  setDownloadingTasks((prev) => {
                                    const newSet = new Set(prev);
                                    newSet.delete(taskId);
                                    return newSet;
                                  });
                                }
                              }
                            }}
                          >
                            {downloadingTasks.has(task.data.id) ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                {t("download.indicator.saving", "Saving...")}
                              </>
                            ) : (
                              <>
                                <Download className="w-3 h-3" />
                                {t(
                                  "download.indicator.downloadFile",
                                  "Save File"
                                )}
                              </>
                            )}
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
