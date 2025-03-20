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
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ClockIcon,
  CreditCardIcon,
  HomeIcon,
  LogOut,
  Menu,
  Plane,
  PlusCircleIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const { toggleSidebar, state } = useSidebar();

  const menuItems = [
    { href: "/", label: "Home", icon: <HomeIcon /> },
    { href: "/plan", label: "Plan a Trip", icon: <PlusCircleIcon /> },
    { href: "/history", label: "History", icon: <ClockIcon /> },
    { href: "/payment", label: "Payment", icon: <CreditCardIcon /> },
    { href: "/profile", label: "My Profile", icon: <UserIcon /> },
  ];

  return (
    pathname !== "/sign-in" &&
    pathname !== "/sign-up" && (
      <Sidebar collapsible="icon" className="border-slate-200">
        {/* ---------- Sidebar Header ---------- */}
        <SidebarHeader className="flex flex-row justify-between p-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pr-2 border-b border-slate-200">
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
            onClick={toggleSidebar}
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
        <SidebarContent className="p-2">
          <SidebarMenu>
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
        <SidebarFooter className="border-t border-slate-200">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Log out" asChild>
                <Link
                  href="/sign-in"
                  className={
                    "flex items-center gap-3 w-full p-2 rounded-lg transition-colors hover:bg-red-500/60 hover:text-black hover:font-medium"
                  }
                >
                  <LogOut className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Log out
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  );
}
