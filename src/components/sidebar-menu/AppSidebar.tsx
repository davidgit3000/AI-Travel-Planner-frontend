"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ClockIcon,
  HomeIcon,
  LogOut,
  Menu,
  Plane,
  PlusCircleIcon,
  UserIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTripPlan } from "@/contexts/TripPlanContext";

export function AppSidebar() {
  const pathname = usePathname();
  const { resetPlan } = useTripPlan();
  const { logout } = useAuth();
  const { toggleSidebar, isMobile, setOpenMobile, state } = useSidebar();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: <HomeIcon /> },
    { href: "/plan", label: "Plan a Trip", icon: <PlusCircleIcon /> },
    { href: "/history", label: "History", icon: <ClockIcon /> },
    // { href: "/payment", label: "Payment", icon: <CreditCardIcon /> },
    { href: "/profile", label: "My Profile", icon: <UserIcon /> },
  ];

  return (
    pathname !== "/sign-in" &&
    pathname !== "/sign-up" &&
    pathname !== "/" && (
      <>
        {/* Mobile Sidebar Toggle Button */}
        {isMobile && (
          <Button
            onClick={() => setOpenMobile(true)}
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-blue-500 text-white hover:bg-blue-600 rounded-lg p-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}

        <Sidebar
          collapsible="icon"
          className={cn(
            "border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900",
            isMobile ? "fixed inset-0 shadow-lg z-50" : ""
          )}
        >
          {/* ---------- Sidebar Header ---------- */}
          <SidebarHeader className="flex flex-row justify-between p-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pr-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            {/* Left: Brand Logo & Name */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="bg-blue-500 p-2 rounded-lg flex items-center justify-center group-data-[collapsible=icon]:hidden">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden text-slate-900 dark:text-white">
                TripMate AI
              </span>
            </Link>

            {/* Right: Collapse Button */}
            <Button
              onClick={() =>
                isMobile ? setOpenMobile(false) : toggleSidebar()
              }
              variant="ghost"
              size="icon"
              className={cn(
                "transition-colors rounded-lg",
                "text-slate-900 dark:text-white",
                "hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500"
              )}
            >
              {state === "expanded" ? (
                <ArrowLeft className="h-5 w-5 transition-transform duration-200" />
              ) : (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Menu className="h-5 w-5 transition-transform duration-200" />
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      <span>Open Menu</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Button>
          </SidebarHeader>
          {/* ---------- Sidebar Content ---------- */}
          <SidebarContent className="p-2 bg-white dark:bg-slate-900 flex-1">
            <SidebarMenu className="bg-white dark:bg-slate-900">
              {menuItems.map((item) => (
                <TooltipProvider delayDuration={0} key={item.label}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip={item.label}
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 w-full p-2 rounded-lg transition-colors",
                          pathname === item.href
                            ? "bg-blue-500 text-white"
                            : "hover:bg-blue-400 hover:text-white"
                        )}
                      >
                        {item.icon}
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </TooltipProvider>
              ))}
            </SidebarMenu>
          </SidebarContent>
          {/*---------- Sidebar Footer ---------- */}
          <SidebarFooter className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <SidebarMenu className="bg-white dark:bg-slate-900">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Log out"
                  asChild
                  onClick={() => {
                    logout();
                    resetPlan();
                    signOut({ callbackUrl: "/sign-in" });
                  }}
                >
                  <div
                    className={
                      "flex items-center gap-3 w-full p-2 rounded-lg transition-colors hover:bg-red-500/60 hover:text-black hover:font-medium cursor-pointer"
                    }
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Log out
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </>
    )
  );
}
