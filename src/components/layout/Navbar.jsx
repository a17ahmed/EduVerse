"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  GraduationCap,
  Home,
  BookOpen,
  Users,
  Phone,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "About", href: "/about", icon: Users },
  { name: "Contact", href: "/contact", icon: Phone },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/20"
          : "bg-transparent"
      )}
    >
      {/* Gradient line on top when scrolled */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 transition-opacity duration-300",
        isScrolled ? "opacity-100" : "opacity-0"
      )} />

      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300" />

              {/* Logo container */}
              <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
            </motion.div>

            <div className="flex flex-col">
              <span className={cn(
                "text-xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent",
                !isScrolled && "drop-shadow-lg"
              )}>
                EduVerse
              </span>
              <span className={cn(
                "text-[10px] font-medium tracking-wider uppercase",
                isScrolled ? "text-muted-foreground" : "text-white/70"
              )}>
                Education Excellence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className={cn(
              "flex items-center gap-1 p-1.5 rounded-full transition-all duration-300",
              isScrolled
                ? "bg-muted/50"
                : "bg-white/10 backdrop-blur-sm"
            )}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={cn(
                      "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                      isActive
                        ? "text-white"
                        : isScrolled
                          ? "text-foreground/70 hover:text-foreground"
                          : "text-white/80 hover:text-white"
                    )}
                  >
                    {/* Active/Hover background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBg"
                        className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full shadow-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    {/* Hover effect */}
                    {hoveredLink === link.name && !isActive && (
                      <motion.div
                        layoutId="hoverNavBg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "absolute inset-0 rounded-full",
                          isScrolled ? "bg-muted" : "bg-white/10"
                        )}
                      />
                    )}

                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="h-4 w-4" />
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className={cn(
                "rounded-full transition-all duration-300",
                isScrolled
                  ? "text-foreground hover:bg-muted"
                  : "text-white hover:bg-white/10"
              )}
            >
              <Link href="/contact">
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Link>
            </Button>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                className="relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25 border-0 px-6"
              >
                <Link href="/apply" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isScrolled
                    ? "bg-muted hover:bg-muted/80"
                    : "bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                )}
              >
                <Menu className={cn(
                  "h-6 w-6",
                  isScrolled ? "text-foreground" : "text-white"
                )} />
              </motion.button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0 border-l-0">
              <div className="h-full bg-gradient-to-b from-violet-950 via-indigo-950 to-slate-950 p-6">
                {/* Mobile Logo */}
                <div className="flex items-center gap-3 mb-10">
                  <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-white">EduVerse</span>
                    <span className="text-[10px] font-medium tracking-wider uppercase text-white/60">
                      Education Excellence
                    </span>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-2">
                  {navLinks.map((link, index) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;

                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300",
                            isActive
                              ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 text-white"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <div className={cn(
                            "p-2 rounded-lg",
                            isActive
                              ? "bg-gradient-to-br from-violet-600 to-indigo-600"
                              : "bg-white/10"
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-lg font-medium">{link.name}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile CTA Buttons */}
                <div className="flex flex-col gap-3 mt-10 pt-10 border-t border-white/10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      variant="outline"
                      asChild
                      className="w-full rounded-xl h-12 border-white/20 bg-white/5 text-white hover:bg-white/10"
                    >
                      <Link href="/contact" onClick={() => setIsOpen(false)}>
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Us
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      asChild
                      className="w-full rounded-xl h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25 border-0"
                    >
                      <Link href="/apply" onClick={() => setIsOpen(false)}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Apply Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-center text-white/40 text-xs">
                    © 2025 EduVerse. All rights reserved.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
