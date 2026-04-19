import { AppHeader } from "@/components/AppHeader/AppHeader";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
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
        <section className="w-full bg-slate-950">
          <AppHeader />
          <main className="p-5 mt-20">{children}</main>
        </section>
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "bg-slate-900 border-slate-800 text-white",
              title: "text-white",
              description: "text-slate-400",
              error: "bg-red-950 border-red-900 text-red-400",
              success: "bg-cyan-950 border-cyan-900 text-cyan-400",
            },
          }}
        />
      </SidebarProvider>
    </QueryProvider>
  );
}
