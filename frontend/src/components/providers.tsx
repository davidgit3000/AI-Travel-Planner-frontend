"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TripPlanProvider } from "@/contexts/TripPlanContext";
import { AppSidebar } from "@/components/sidebar-menu/AppSidebar";
import { ModeToggler } from "@/components/mode-toggle/ModeToggler";
import { Footer } from "@/components/footer/Footer";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        enableSystem
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <AuthProvider>
          <SidebarProvider>
            <TripPlanProvider>
              <AppSidebar />
              <div className="fixed top-4 right-4 z-50">
                <ModeToggler />
              </div>
              <main className="w-full min-h-screen flex flex-col items-center">
                {children}
                <Footer />
              </main>
              <Toaster richColors position="top-center" />
            </TripPlanProvider>
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
