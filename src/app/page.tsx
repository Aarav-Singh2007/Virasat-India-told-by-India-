import IndiaMap3D from "@/components/IndiaMap3D";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-12 bg-[#F9F6F0] font-sans">
      <div className="z-10 w-full max-w-7xl items-center justify-between text-sm lg:flex flex-col pt-8">
        <div className="w-full text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#2A241F] mb-6 font-serif">
            Virasat
          </h1>
          <p className="text-lg md:text-xl text-[#4A433A] max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            Trace a living map of India to find festivals happening today, crafts still made by hand, and the people carrying them forward.
          </p>
          {/* ── Start Journey CTA ── */}
          <Link
            href="/journey"
            className="inline-block px-10 py-4 bg-[#A23E33] hover:bg-[#8a3329] text-white 
                       font-bold font-sans text-lg rounded-full shadow-xl shadow-[#A23E33]/20 
                       transition-all hover:scale-105 active:scale-95"
          >
            🚂 Start the Journey
          </Link>
        </div>

        {/* The interactive 3D map component */}
        <div className="w-full bg-[#FFFFFF] rounded-[2.5rem] overflow-hidden relative shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-[#EAE3D9]" style={{ height: '80vh' }}>
          <IndiaMap3D />
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-center px-4">
          <div className="p-8 bg-white rounded-3xl border border-[#EAE3D9] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-3 text-[#A23E33] font-serif">Interactive 3D Map</h3>
            <p className="text-[#635A4F] text-sm leading-relaxed">Rotate, pan, zoom, and hover over different states to see their historical significance in 3D.</p>
          </div>
          <div className="p-8 bg-white rounded-3xl border border-[#EAE3D9] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-3 text-[#A23E33] font-serif">Heritage Routes</h3>
            <p className="text-[#635A4F] text-sm leading-relaxed">Follow predefined routes connecting historical monuments and cities across India.</p>
          </div>
          <div className="p-8 bg-white rounded-3xl border border-[#EAE3D9] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-3 text-[#A23E33] font-serif">Authentic Data</h3>
            <p className="text-[#635A4F] text-sm leading-relaxed">Handcrafted UI with heavily researched authentic timelines for the best experience.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
