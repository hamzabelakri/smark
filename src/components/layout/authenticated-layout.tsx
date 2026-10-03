import { Outlet } from "@tanstack/react-router";
import { getCookie } from "@/lib/cookies";
import { cn } from "@/lib/utils";
import { LayoutProvider } from "@/context/layout-provider";
import { SearchProvider } from "@/context/search-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SkipToMain } from "@/components/skip-to-main";
import { Header } from "./header";

type AuthenticatedLayoutProps = {
  children?: React.ReactNode;
};

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie("sidebar_state") !== "false";

  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen} className="flex-col">
          <Header fixed />
          <div className="flex min-h-0 flex-1">
            <AppSidebar />
            <SidebarInset
              className={cn(
                "@container/content min-w-0",
                "has-data-[layout=fixed]:h-[calc(100svh-var(--header-height))]"
              )}
            >
              {children ?? <Outlet />}
            </SidebarInset>
          </div>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  );
}