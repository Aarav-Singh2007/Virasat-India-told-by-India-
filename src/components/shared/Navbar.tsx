"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Menu, X, Compass, ShoppingBag, Users, Calendar, Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Explore", href: "/" },
    { name: "Plan a trip", href: "/plan-trip" },
    { name: "Merchandise", href: "/merchandise" },
    { name: "Community", href: "/community" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F9F6F0]/90 backdrop-blur-md border-b border-[#E6DFD3] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Virasat Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="text-[#A23E33] font-serif font-bold text-2xl tracking-tight">
            Virasat
          </span>
          <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase font-semibold text-[#8B7D6B] bg-[#EAE3D9]/60 px-2 py-0.5 rounded-full">
            India Told By India
          </span>
        </Link>
        
        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium text-[#4A433A]">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`pb-1 transition-all ${
                  active
                    ? "text-[#A23E33] font-semibold border-b-2 border-[#A23E33]"
                    : "hover:text-[#A23E33] border-b-2 border-transparent hover:border-[#A23E33]/30"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
        
        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link 
            href="/journey" 
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#A23E33] text-white rounded-full font-sans text-xs sm:text-sm font-bold shadow-xs hover:bg-[#8A3329] hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Journey</span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-[#E6DFD3] text-[#4A433A] hover:bg-[#EAE3D9]/50 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F9F6F0] border-b border-[#E6DFD3] px-6 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#A23E33]/10 text-[#A23E33] font-bold"
                    : "text-[#4A433A] hover:bg-[#EAE3D9]/40 hover:text-[#A23E33]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/journey"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#A23E33] text-white rounded-xl text-sm font-bold shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Interactive Journey</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
