import { Sidebar } from "@/components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export function DashboardLayout({ children, header }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      {header && (
        <header className="bg-background border-b border-border px-6 py-4 ml-72">
          {header}
        </header>
      )}

      {/* Main Content */}
      <main className="ml-72 p-5 space-y-5 bg-secondary/50">{children}</main>
    </div>
  );
}
