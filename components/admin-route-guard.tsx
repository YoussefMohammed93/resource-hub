"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface AdminRouteGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export function AdminRouteGuard({ 
  children, 
  fallbackPath = "/" 
}: AdminRouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        router.push("/login");
        return;
      }

      if (user && user.role !== "admin") {
        // Authenticated but not admin, redirect to fallback
        router.push(fallbackPath);
        return;
      }

      if (user && user.role === "admin") {
        // User is admin, allow access
        setIsChecking(false);
      }
    }
  }, [isAuthenticated, isLoading, user, router, fallbackPath]);

  // Show loading while checking authentication and role
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // If we reach here, user is authenticated and has admin role
  return <>{children}</>;
}
