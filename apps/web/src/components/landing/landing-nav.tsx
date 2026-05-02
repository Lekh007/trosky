"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "#problem", label: "Problem" },
  { href: "#platform", label: "Platform" },
  { href: "#comparison", label: "Compare" },
  { href: "#process", label: "Process" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      aria-label="Main navigation"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 26 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-landing border-b bg-background/95 shadow-md backdrop-blur-md"
          : "border-landing border-b border-transparent bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight landing-text transition-opacity hover:opacity-90"
        >
          <BarChart3 className="h-6 w-6 text-primary" aria-hidden />
          Trosky
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium landing-text-muted transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link href="/login">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="sm"
                className="gap-2 font-medium"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </motion.div>
          </Link>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="landing-mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="landing-mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-landing border-t bg-background/95 px-4 py-3 shadow-md backdrop-blur-md md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-3 text-sm font-medium landing-text-muted transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between rounded-md px-3 py-2">
                <span className="text-sm font-medium landing-text-muted">Theme</span>
                <ThemeToggle />
              </div>
              <Link href="/login" className="mt-2" onClick={() => setMobileOpen(false)}>
                <Button className="w-full gap-2 font-medium">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
