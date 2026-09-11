"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Search,
  CheckCircle2,
  Tag,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Percent,
  Sparkles,
  Luggage,
  Clock,
  Star,
  Copy,
  Check,
  Building2,
  Train,
  Plane,
  ChevronRight,
  X,
  Info
} from "lucide-react";

interface HeritageCircuit {
  id: string;
  title: string;
  state: string;
  duration: string;
  route: string[];
  description: string;
  highlights: string[];
  theme: string;
  image: string;
  mmtDeal: {
    price: number;
    originalPrice: number;
    stayType: string;
    perk: string;
    code: string;
  };
  goibiboDeal: {
    price: number;
    originalPrice: number;
    stayType: string;
    perk: string;
    code: string;
  };
}

const HERITAGE_CIRCUITS: HeritageCircuit[] = [
  {
    id: "rajasthan-royal",
    title: "Royal Rajputana Grandeur",
    state: "Rajasthan",
    duration: "6 Days / 5 Nights",
    route: ["Jaipur", "Jodhpur", "Udaipur"],
    description: "Explore majestic hill forts, mirror palaces, authentic block-printing workshops in Bagru, and sunset boat rides across Lake Pichola.",
    highlights: ["Amber Fort Sound & Light", "Mehrangarh Palace Private Tour", "Sanganer Artisan Masterclass", "Lake Pichola Sunset Cruise"],
    theme: "Royal Forts & Palaces",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    mmtDeal: {
      price: 24999,
      originalPrice: 31200,
      stayType: "MMT Assured 4★ Heritage Haveli",
      perk: "Free room upgrade + Fort entry passes",
      code: "VIRASATMMT"
    },
    goibiboDeal: {
      price: 22450,
      originalPrice: 28900,
      stayType: "Goibibo Smart Heritage Homestay",
      perk: "goCash 12% cashback + Intercity cab included",
      code: "VIRASATIBIBO"
    }
  },
  {
    id: "kerala-backwaters",
    title: "God's Own Heritage & Arts",
    state: "Kerala",
    duration: "5 Days / 4 Nights",
    route: ["Kochi", "Alleppey", "Thrissur"],
    description: "Journey through 16th-century Jewish Synagogues, Dutch Palaces, Kathakali greenroom makeup rituals, and serene backwater houseboats.",
    highlights: ["Kathakali Center Front-row Access", "Traditional Kettuvallam Houseboat", "Fort Kochi Heritage Walk", "Aranmula Metal Mirror Workshop"],
    theme: "Artisan & Classical Arts",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    mmtDeal: {
      price: 21500,
      originalPrice: 26800,
      stayType: "MMT Signature Backwater Resort",
      perk: "Ayurvedic massage coupon + Houseboat breakfast",
      code: "VIRASATMMT"
    },
    goibiboDeal: {
      price: 19800,
      originalPrice: 25400,
      stayType: "Goibibo Certified Eco-Heritage Stay",
      perk: "Flat ₹1,500 off on flight + free kayak tour",
      code: "VIRASATIBIBO"
    }
  },
  {
    id: "bihar-buddhist",
    title: "Enlightenment & Ancient Wisdom",
    state: "Bihar",
    duration: "4 Days / 3 Nights",
    route: ["Patna", "Nalanda", "Rajgir", "Bodh Gaya"],
    description: "Trace the birthplaces of world universities and enlightenment, from the 5th-century ruins of Nalanda to the sacred Bodhi Tree.",
    highlights: ["Nalanda University UNESCO Site", "Mahabodhi Temple Morning Chants", "Rajgir Ropeway & Gridhakuta Hill", "Madhubani Village Folk Art Stop"],
    theme: "Spiritual & Ancient History",
    image: "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80",
    mmtDeal: {
      price: 16800,
      originalPrice: 21000,
      stayType: "MMT Curated Pilgrim Boutique Hotel",
      perk: "Private historian guide at Nalanda",
      code: "VIRASATMMT"
    },
    goibiboDeal: {
      price: 15400,
      originalPrice: 19900,
      stayType: "Goibibo Verified Spiritual Stay",
      perk: "Direct station pickup + Prasad souvenir pack",
      code: "VIRASATIBIBO"
    }
  },
  {
    id: "nagaland-tribal",
    title: "Naga Lore & Mystic Hills",
    state: "Nagaland",
    duration: "5 Days / 4 Nights",
    route: ["Dimapur", "Kohima", "Khonoma", "Tuophema"],
    description: "Immerse in ancient indigenous cultures, hornbill folk songs, exquisite handwoven shawls, and Asia's first green tribal conservation village.",
    highlights: ["Khonoma Green Village Walk", "Angami Tribal Weaving Demonstration", "Kohima War Memorial & Museum", "Traditional Naga Morung Dinner"],
    theme: "Indigenous & Living Heritage",
    image: "https://images.unsplash.com/photo-1628178129774-6019a8ea3f8b?auto=format&fit=crop&w=800&q=80",
    mmtDeal: {
      price: 27900,
      originalPrice: 34500,
      stayType: "MMT Assured Traditional Morung Stay",
      perk: "Tribal cultural pass + Village conservation fee",
      code: "VIRASATMMT"
    },
    goibiboDeal: {
      price: 25800,
      originalPrice: 32000,
      stayType: "Goibibo Community Homestay",
      perk: "4x4 Jeep transfer discount + Local storyteller guide",
      code: "VIRASATIBIBO"
    }
  }
];

export default function PlanTripPage() {
  // Search Form State
  const [origin, setOrigin] = useState("New Delhi");
  const [destination, setDestination] = useState("Rajasthan Royal Circuit");
  const [departureDate, setDepartureDate] = useState("2026-10-15");
  const [returnDate, setReturnDate] = useState("2026-10-21");
  const [travelers, setTravelers] = useState("2 Adults");
  const [selectedTheme, setSelectedTheme] = useState("All");

  // Partner Modal State
  const [activePartnerModal, setActivePartnerModal] = useState<{
    partner: "MakeMyTrip" | "Goibibo";
    circuitTitle?: string;
    promoCode: string;
    dealPrice?: number;
    destinationName: string;
  } | null>(null);

  // Copied Promo Code feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const openPartnerSearch = (partner: "MakeMyTrip" | "Goibibo", circuit?: HeritageCircuit) => {
    setActivePartnerModal({
      partner,
      circuitTitle: circuit ? circuit.title : undefined,
      destinationName: circuit ? `${circuit.title} (${circuit.state})` : destination,
      promoCode: partner === "MakeMyTrip" ? "VIRASATMMT" : "VIRASATIBIBO",
      dealPrice: circuit ? (partner === "MakeMyTrip" ? circuit.mmtDeal.price : circuit.goibiboDeal.price) : undefined
    });
  };

  const getPartnerSearchUrl = (partner: "MakeMyTrip" | "Goibibo") => {
    const query = encodeURIComponent(`${destination} heritage holiday tour`);
    if (partner === "MakeMyTrip") {
      return `https://www.makemytrip.com/holidays-india/search?search=${query}&referrer=virasat`;
    } else {
      return `https://www.goibibo.com/holidays/search?destination=${query}&campaign=virasat`;
    }
  };

  const filteredCircuits = selectedTheme === "All" 
    ? HERITAGE_CIRCUITS 
    : HERITAGE_CIRCUITS.filter(c => c.theme.toLowerCase().includes(selectedTheme.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2A241F] font-sans pb-24">
      {/* ── Top Hero Section ── */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E6DFD3] bg-gradient-to-b from-[#F2ECE1]/70 to-[#F9F6F0]">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A23E33]/10 text-[#A23E33] text-xs sm:text-sm font-semibold mb-6 border border-[#A23E33]/20">
            <Compass className="w-4 h-4" />
            <span>Official Travel Booking Partners: MakeMyTrip & Goibibo</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-[#2A241F] tracking-tight mb-6">
            Plan Your Heritage Journey
          </h1>
          <p className="text-base sm:text-xl text-[#5C5346] max-w-3xl mx-auto font-light leading-relaxed mb-10">
            Step beyond tourist crowds. Explore living forts, ancient monastic trails, and master craft villages with curated heritage stays and verified partner discounts.
          </p>

          {/* Partner Badges Carousel / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            {/* MakeMyTrip Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E6DFD3] shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E41F26]/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E41F26]/10 text-[#E41F26] flex items-center justify-center font-bold font-serif text-lg">
                    MMT
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2A241F] text-base leading-snug">MakeMyTrip Heritage Assured</h3>
                    <p className="text-xs text-[#8B7D6B]">Official Stays & Holiday Partner</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
                  Flat 15% OFF
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5C5346] mb-4">
                Verified heritage havelis, palace suites, and guided monument circuits with 24x7 concierge assistance.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-[#F2ECE1]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8B7D6B]">Promo code:</span>
                  <span className="font-mono text-xs font-bold bg-[#F9F6F0] px-2.5 py-1 rounded border border-[#E6DFD3] text-[#A23E33]">
                    VIRASATMMT
                  </span>
                  <button
                    onClick={() => handleCopyCode("VIRASATMMT")}
                    className="p-1 text-[#8B7D6B] hover:text-[#A23E33] transition-colors"
                    title="Copy code"
                  >
                    {copiedCode === "VIRASATMMT" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => openPartnerSearch("MakeMyTrip")}
                  className="text-xs font-bold text-[#E41F26] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Book with MMT <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Goibibo Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E6DFD3] shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F26A21]/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F26A21]/10 text-[#F26A21] flex items-center justify-center font-bold font-serif text-lg">
                    gO
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2A241F] text-base leading-snug">Goibibo Travel Pass</h3>
                    <p className="text-xs text-[#8B7D6B]">Flights, Cabs & Smart Homestays</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                  Flat ₹1,500 OFF
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5C5346] mb-4">
                Exclusive partner deals on heritage train routes, airport pickups, and certified village homestays.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-[#F2ECE1]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8B7D6B]">Promo code:</span>
                  <span className="font-mono text-xs font-bold bg-[#F9F6F0] px-2.5 py-1 rounded border border-[#E6DFD3] text-[#A23E33]">
                    VIRASATIBIBO
                  </span>
                  <button
                    onClick={() => handleCopyCode("VIRASATIBIBO")}
                    className="p-1 text-[#8B7D6B] hover:text-[#A23E33] transition-colors"
                    title="Copy code"
                  >
                    {copiedCode === "VIRASATIBIBO" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => openPartnerSearch("Goibibo")}
                  className="text-xs font-bold text-[#F26A21] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Book with Goibibo <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Trip Search Widget ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E6DFD3]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-6 border-b border-[#F2ECE1] gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2A241F]">
                Customize Your Heritage Itinerary
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6456]">
                Compare live pricing & exclusive deals directly across MakeMyTrip and Goibibo
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[#8B7D6B]">Trip Style:</span>
              {["All", "Royal", "Spiritual", "Artisan"].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    selectedTheme === theme
                      ? "bg-[#A23E33] text-white border-[#A23E33] font-semibold"
                      : "bg-[#F9F6F0] text-[#5C5346] border-[#E6DFD3] hover:border-[#A23E33]"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Starting From */}
            <div className="p-3.5 bg-[#FBF9F5] rounded-2xl border border-[#EAE3D9] focus-within:border-[#A23E33] transition-colors">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8B7D6B] block mb-1">
                Departing From
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A23E33] shrink-0" />
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="bg-transparent font-medium text-sm text-[#2A241F] w-full focus:outline-hidden cursor-pointer"
                >
                  <option value="New Delhi">New Delhi (DEL)</option>
                  <option value="Mumbai">Mumbai (BOM)</option>
                  <option value="Bengaluru">Bengaluru (BLR)</option>
                  <option value="Kolkata">Kolkata (CCU)</option>
                  <option value="Chennai">Chennai (MAA)</option>
                  <option value="Jaipur">Jaipur (JAI)</option>
                  <option value="Hyderabad">Hyderabad (HYD)</option>
                </select>
              </div>
            </div>

            {/* Destination */}
            <div className="p-3.5 bg-[#FBF9F5] rounded-2xl border border-[#EAE3D9] focus-within:border-[#A23E33] transition-colors">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8B7D6B] block mb-1">
                Heritage Destination
              </label>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#A23E33] shrink-0" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent font-medium text-sm text-[#2A241F] w-full focus:outline-hidden cursor-pointer"
                >
                  <option value="Rajasthan Royal Circuit">Rajasthan (Jaipur • Jodhpur • Udaipur)</option>
                  <option value="Kerala Backwaters & Arts">Kerala (Kochi • Alleppey • Thrissur)</option>
                  <option value="Bihar Buddhist Trail">Bihar (Nalanda • Bodh Gaya • Rajgir)</option>
                  <option value="Nagaland Tribal Trail">Nagaland (Kohima • Khonoma • Dzukou)</option>
                  <option value="Varanasi & Sarnath Ghats">Varanasi & Sarnath Heritage</option>
                  <option value="Hampi & Vijayanagara Ruins">Hampi & Deccan Boulder Ruins</option>
                </select>
              </div>
            </div>

            {/* Travel Dates */}
            <div className="p-3.5 bg-[#FBF9F5] rounded-2xl border border-[#EAE3D9] focus-within:border-[#A23E33] transition-colors">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8B7D6B] block mb-1">
                Dates of Travel
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#A23E33] shrink-0" />
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="bg-transparent font-medium text-xs sm:text-sm text-[#2A241F] w-full focus:outline-hidden cursor-pointer"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="p-3.5 bg-[#FBF9F5] rounded-2xl border border-[#EAE3D9] focus-within:border-[#A23E33] transition-colors">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8B7D6B] block mb-1">
                Travelers
              </label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#A23E33] shrink-0" />
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="bg-transparent font-medium text-sm text-[#2A241F] w-full focus:outline-hidden cursor-pointer"
                >
                  <option value="1 Solo Explorer">1 Solo Explorer</option>
                  <option value="2 Adults">2 Adults (Couple / Friends)</option>
                  <option value="Family (3-4)">Family (3-4 Members)</option>
                  <option value="Group (5+)">Heritage Group (5+)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Search Buttons for Both Partners */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              onClick={() => openPartnerSearch("MakeMyTrip")}
              className="w-full sm:w-auto px-6 py-3 bg-[#E41F26] hover:bg-[#c91920] text-white rounded-xl font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Search on MakeMyTrip</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={() => openPartnerSearch("Goibibo")}
              className="w-full sm:w-auto px-6 py-3 bg-[#F26A21] hover:bg-[#db5d19] text-white rounded-xl font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Search on Goibibo</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Curated Circuits Comparison (MMT vs Goibibo) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-[#A23E33] font-bold text-xs uppercase tracking-widest block mb-2">
              Featured Itineraries
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A241F]">
              Handcrafted Heritage Circuits
            </h2>
            <p className="text-[#6E6456] text-sm mt-2 max-w-xl">
              Compare transparent package offerings between MakeMyTrip and Goibibo with Virasat-exclusive bonuses.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs text-[#8B7D6B] bg-white px-3 py-1.5 rounded-full border border-[#E6DFD3]">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>100% Verified Local Guides & Artisan Support</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCircuits.map((circuit) => (
            <div
              key={circuit.id}
              className="bg-white rounded-3xl border border-[#E6DFD3] shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col"
            >
              {/* Circuit Header Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={circuit.image}
                  alt={circuit.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
                    {circuit.state}
                  </span>
                  <span className="px-3 py-1 bg-[#A23E33] text-white text-xs font-semibold rounded-full">
                    {circuit.duration}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">
                    {circuit.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-200">
                    <MapPin className="w-3.5 h-3.5 text-[#E6DFD3]" />
                    <span>{circuit.route.join(" → ")}</span>
                  </div>
                </div>
              </div>

              {/* Circuit Content */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-sm text-[#5C5346] leading-relaxed mb-4">
                    {circuit.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B7D6B] mb-2">
                      Trip Highlights
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {circuit.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-[#4A433A]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#A23E33] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Side-by-Side Partner Deal Comparison Box */}
                <div className="pt-4 border-t border-[#F2ECE1] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* MakeMyTrip Deal Option */}
                  <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#FED7D7] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#E41F26] uppercase tracking-wide">
                          MakeMyTrip
                        </span>
                        <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                          Save ₹{circuit.mmtDeal.originalPrice - circuit.mmtDeal.price}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-[#2A241F]">
                        ₹{circuit.mmtDeal.price.toLocaleString("en-IN")}
                        <span className="text-xs text-[#8B7D6B] line-through ml-2">
                          ₹{circuit.mmtDeal.originalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4A433A] font-medium mt-1">
                        {circuit.mmtDeal.stayType}
                      </p>
                      <p className="text-[10px] text-green-700 font-semibold mt-1">
                        ✦ {circuit.mmtDeal.perk}
                      </p>
                    </div>

                    <button
                      onClick={() => openPartnerSearch("MakeMyTrip", circuit)}
                      className="mt-3 w-full py-2 bg-[#E41F26] hover:bg-[#c91920] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Book on MMT</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Goibibo Deal Option */}
                  <div className="p-4 rounded-2xl bg-[#FFF8F2] border border-[#FEEBC8] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#F26A21] uppercase tracking-wide">
                          Goibibo
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                          Save ₹{circuit.goibiboDeal.originalPrice - circuit.goibiboDeal.price}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-[#2A241F]">
                        ₹{circuit.goibiboDeal.price.toLocaleString("en-IN")}
                        <span className="text-xs text-[#8B7D6B] line-through ml-2">
                          ₹{circuit.goibiboDeal.originalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4A433A] font-medium mt-1">
                        {circuit.goibiboDeal.stayType}
                      </p>
                      <p className="text-[10px] text-amber-800 font-semibold mt-1">
                        ✦ {circuit.goibiboDeal.perk}
                      </p>
                    </div>

                    <button
                      onClick={() => openPartnerSearch("Goibibo", circuit)}
                      className="mt-3 w-full py-2 bg-[#F26A21] hover:bg-[#db5d19] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Book on Goibibo</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Partner Perks & Guarantees ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-[#EAE3D9]/50 rounded-3xl p-8 sm:p-12 border border-[#E6DFD3]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A241F]">
              Why Book Through Virasat x Partners?
            </h2>
            <p className="text-sm text-[#6E6456] mt-2">
              Our official collaboration with MakeMyTrip and Goibibo guarantees both premium traveler convenience and ethical local engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E6DFD3] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#A23E33]/10 text-[#A23E33] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#2A241F] mb-2 font-serif text-lg">Verified Heritage Havelis</h3>
              <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed">
                Stay in government-certified heritage properties and family-run havelis restored with historical fidelity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6DFD3] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#A23E33]/10 text-[#A23E33] flex items-center justify-center mb-4">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#2A241F] mb-2 font-serif text-lg">Exclusive Partner Coupons</h3>
              <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed">
                Use codes <code className="font-mono text-[#A23E33] bg-[#F9F6F0] px-1.5 py-0.5 rounded">VIRASATMMT</code> and <code className="font-mono text-[#A23E33] bg-[#F9F6F0] px-1.5 py-0.5 rounded">VIRASATIBIBO</code> for guaranteed markdowns.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6DFD3] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#A23E33]/10 text-[#A23E33] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#2A241F] mb-2 font-serif text-lg">Direct Artisan Benefit</h3>
              <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed">
                A percentage of booking partner fees is channeled directly into rural artisan cooperatives across Rajasthan, Bihar, and Kerala.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partner Booking / Redirection Modal ── */}
      {activePartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E6DFD3] relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActivePartnerModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#8B7D6B] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-white ${
                activePartnerModal.partner === "MakeMyTrip" ? "bg-[#E41F26]" : "bg-[#F26A21]"
              }`}>
                {activePartnerModal.partner === "MakeMyTrip" ? "MMT" : "gO"}
              </div>
              <div>
                <span className="text-xs font-semibold text-[#8B7D6B] uppercase tracking-wider">
                  Partner Booking Link
                </span>
                <h3 className="text-xl font-bold font-serif text-[#2A241F]">
                  {activePartnerModal.partner} Exclusive
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#5C5346] mb-6 leading-relaxed">
              You are booking the heritage experience for:{" "}
              <strong className="text-[#2A241F]">{activePartnerModal.destinationName}</strong>.
            </p>

            {/* Voucher Box */}
            <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#E6DFD3] mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#8B7D6B]">Special Partner Code:</span>
                <span className="text-xs font-bold text-green-700">Valid Pan-India</span>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#EAE3D9]">
                <code className="font-mono font-bold text-base text-[#A23E33]">
                  {activePartnerModal.promoCode}
                </code>
                <button
                  onClick={() => handleCopyCode(activePartnerModal.promoCode)}
                  className="px-3 py-1.5 bg-[#A23E33]/10 hover:bg-[#A23E33]/20 text-[#A23E33] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode === activePartnerModal.promoCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#8B7D6B] mt-2">
                Apply this promo code at checkout on {activePartnerModal.partner} to redeem your Virasat traveler discount.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <a
                href={getPartnerSearchUrl(activePartnerModal.partner)}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3.5 rounded-xl text-white font-bold text-center text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:opacity-95 ${
                  activePartnerModal.partner === "MakeMyTrip" ? "bg-[#E41F26]" : "bg-[#F26A21]"
                }`}
              >
                <span>Continue to {activePartnerModal.partner}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setActivePartnerModal(null)}
                className="w-full py-2.5 text-xs text-[#8B7D6B] hover:text-[#2A241F] transition-colors text-center cursor-pointer"
              >
                Return to Itineraries
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
