import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F9F6F0]/90 backdrop-blur-md border-b border-[#E6DFD3] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <span className="text-[#A23E33] font-serif font-bold text-2xl tracking-tight">Virasat</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10 font-sans text-sm font-semibold text-[#4A433A]">
          <Link href="/" className="text-[#A23E33] border-b-2 border-[#A23E33] pb-1 transition-colors">Explore</Link>
          <Link href="#" className="hover:text-[#A23E33] transition-colors pb-1 border-b-2 border-transparent hover:border-[#A23E33]/30">Plan a trip</Link>
          <Link href="#" className="hover:text-[#A23E33] transition-colors pb-1 border-b-2 border-transparent hover:border-[#A23E33]/30">Merchandise</Link>
          <Link href="#" className="hover:text-[#A23E33] transition-colors pb-1 border-b-2 border-transparent hover:border-[#A23E33]/30">Community</Link>
          <Link href="#" className="hover:text-[#A23E33] transition-colors pb-1 border-b-2 border-transparent hover:border-[#A23E33]/30">About</Link>
        </div>
        
        {/* Action Button */}
        <div>
          {/* Note: User requested demo link will be added later, keeping it # for now */}
          <Link 
            href="#" 
            className="px-6 py-2.5 bg-[#A23E33] text-white rounded-full font-sans text-sm font-bold shadow-md hover:bg-[#8A3329] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Demo
          </Link>
        </div>
      </div>
    </nav>
  );
}
