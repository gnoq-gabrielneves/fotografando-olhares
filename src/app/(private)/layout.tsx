import { AppSidebar } from "@/shared/components/AppSidebar/AppSidebar";
import { FloatingSidebarTrigger } from "@/shared/components/AppSidebar/FloatingSidebarTrigger";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { Toaster } from "@/shared/components/ui/sonner";
import { QueryProvider } from "@/shared/lib/query/provider";

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
          <FloatingSidebarTrigger />
          <main className="px-4 pb-4 pt-16 sm:px-6 sm:pb-6 md:p-6 lg:p-7">
            {children}
          </main>
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
