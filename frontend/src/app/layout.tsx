import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggler } from "@/components/mode-toggle/ModeToggler";
import { Footer } from "@/components/footer/Footer";
import { TripPlanProvider } from "@/contexts/TripPlanContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/sidebar-menu/AppSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Travel Planner",
  description:
    "Plan your next adventure with AI-powered travel recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          enableSystem
          defaultTheme="light"
          disableTransitionOnChange
        >
          <AuthProvider>
            <SidebarProvider>
              <AppSidebar />
              <div className="fixed top-4 right-4 z-50">
                <ModeToggler />
              </div>
              <TripPlanProvider>
                <main className="w-full min-h-screen flex flex-col items-center">
                  {children}
                  <Footer />
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </main>
              </TripPlanProvider>
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
