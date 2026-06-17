import { AppHeader } from "@/components/AppHeader/AppHeader";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/query/provider";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-slate-50">
          <AppHeader />
          <main className="p-3 sm:p-5">{children}</main>
        </SidebarInset>
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "bg-white border-slate-200 text-slate-800",
              title: "text-slate-800",
              description: "text-slate-500",
              error: "bg-red-50 border-red-200 text-red-600",
              success: "bg-cyan-50 border-cyan-200 text-cyan-700",
            },
          }}
        />
      </SidebarProvider>
    </QueryProvider>
  );
}
