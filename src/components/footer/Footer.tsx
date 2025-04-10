"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  return (
    pathname !== "/sign-in" &&
    pathname !== "/sign-up" && (
      <footer className="w-full py-6 px-8 mt-auto">
        <Separator className="mb-6" />
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 TripMate AI. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              About
            </Link>
            <Link href="/" className="hover:underline">
              Privacy
            </Link>
            <Link href="/" className="hover:underline">
              Terms
            </Link>
            <Link href="/" className="hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    )
  );
}
