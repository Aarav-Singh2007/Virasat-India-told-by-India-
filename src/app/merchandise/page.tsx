"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Heart,
  Eye,
  Plus,
  Minus,
  Trash2,
  X,
  Sparkles,
  ArrowRight,
  Package,
  Award,
  Check
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: "textiles" | "pottery" | "metalcraft" | "art" | "virasat";
  categoryLabel: string;
  state: string;
  craftName: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  isGiTagged: boolean;
  artisanName: string;
  artisanCoop: string;
  description: string;
  materials: string;
  dimensions: string;
  badge?: string;
}

const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Jaipur Blue Pottery Floral Vase",
    category: "pottery",
    categoryLabel: "Pottery & Ceramics",
    state: "Rajasthan",
    craftName: "Jaipur Blue Pottery",
    price: 1850,
    originalPrice: 2400,
    rating: 4.9,
    reviewsCount: 84,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    isGiTagged: true,
    artisanName: "Kripal Kumbh Collective",
    artisanCoop: "Kot Jewar Artisan Trust, Jaipur",
    description: "Handcrafted using traditional quartz stone and fuller's earth clay without any natural clay, glazed with copper oxide turquoise pigments and fired in low-temperature wood kilns.",
    materials: "Quartz powder, Fuller's Earth, Natural Glass, Cobalt Glaze",
    dimensions: "10\" Height x 5.5\" Diameter",
    badge: "GI Tag Certified"
  },
  {
    id: "prod-2",
    name: "Sanganeri Handblock Indigo Cotton Shirt",
    category: "textiles",
    categoryLabel: "Handloom & Textiles",
    state: "Rajasthan",
    craftName: "Sanganeri Block Print",
    price: 1499,
    originalPrice: 1999,
    rating: 4.8,
    reviewsCount: 128,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    isGiTagged: true,
    artisanName: "Chhipa Artisan Guild",
    artisanCoop: "Bagru & Sanganer Handprinters Forum",
    description: "Breathable pure cambric cotton stamped with hand-carved teak wood blocks using fermented natural indigo and pomegranate rind dyes.",
    materials: "100% Organic Handspun Cotton, Natural Indigo Dyes",
    dimensions: "Available in M, L, XL (Relaxed heritage fit)",
    badge: "Bestseller"
  },
  {
    id: "prod-3",
    name: "Madhubani Handpainted Tussar Silk Stole",
    category: "art",
    categoryLabel: "Folk Paintings & Art",
    state: "Bihar",
    craftName: "Mithila Painting (Madhubani)",
    price: 2450,
    originalPrice: 3200,
    rating: 5.0,
    reviewsCount: 62,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    isGiTagged: true,
    artisanName: "Devi Mahila Sahyog Samiti",
    artisanCoop: "Jitwarpur Artisan Cooperative, Madhubani",
    description: "Hand-painted using fine nib pens and bamboo twigs dipped in soot, turmeric, and vermilion on wild Bhagalpuri Tussar silk.",
    materials: "Pure Bhagalpur Tussar Silk, Plant Extracts & Mineral Dyes",
    dimensions: "2m Length x 0.7m Width",
    badge: "GI Tag Certified"
  },
  {
    id: "prod-4",
    name: "Aranmula Metal Mirror (Aranmula Kannadi)",
    category: "metalcraft",
    categoryLabel: "Metalcraft & Brass",
    state: "Kerala",
    craftName: "Aranmula Metal Mirror",
    price: 3600,
    originalPrice: 4500,
    rating: 4.9,
    reviewsCount: 47,
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    isGiTagged: true,
    artisanName: "Parthasarathy Vishwakarma Clan",
    artisanCoop: "Aranmula Metal Mirror Heritage Society",
    description: "Unlike silvered glass mirrors, this rare front-surface reflective mirror is cast from a secretive copper-tin bell metal alloy, hand-polished with jute and velvet for 14 days.",
    materials: "Sacred Bronze Alloy (Copper, Tin, Secret Trace Metals)",
    dimensions: "3.5\" Mirror Oval in 7\" Ornate Brass Frame",
    badge: "Rare Heritage"
  },
  {
    id: "prod-5",
    name: "Nagaland Angami Handwoven Wrap Shawl",
    category: "textiles",
    categoryLabel: "Handloom & Textiles",
    state: "Nagaland",
    craftName: "Naga Backstrap Weaving",
    price: 2750,
    originalPrice: 3500,
    rating: 4.8,
    reviewsCount: 39,
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    isGiTagged: true,
    artisanName: "Khonoma Women Weavers Forum",
    artisanCoop: "Angami Tribal Artisan Guild, Kohima",
    description: "Woven on traditional Indonesian backstrap looms featuring historic warrior spear motifs and bold black-red-white contrasts representing strength and clan honor.",
    materials: "Mercerized Cotton & Indigenous Tree-bark Fibres",
    dimensions: "1.8m x 1m",
    badge: "Tribal GI Tag"
  },
  {
    id: "prod-6",
    name: "Bastar Dhokra Lost-Wax Brass Tribal Figurine",
    category: "metalcraft",
    categoryLabel: "Metalcraft & Brass",
    state: "Chhattisgarh",
    craftName: "Dhokra Bell Metal",
    price: 1599,
    originalPrice: 2100,
    rating: 4.7,
    reviewsCount: 51,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
    isGiTagged: true,
    artisanName: "Ghadwa Artisan Society",
    artisanCoop: "Bastar Tribal Craft Collective, Jagdalpur",
    description: "Cast using a 4,000-year-old non-ferrous lost-wax metal casting technique identical to the Harappan 'Dancing Girl' sculpture.",
    materials: "Recycled Brass & Bronze, Beeswax Core, Clay Mold",
    dimensions: "7\" Height x 4\" Width",
    badge: "4000-Yr Technique"
  },
  {
    id: "prod-7",
    name: "Virasat Heritage Brass Bookmark & Journal Set",
    category: "virasat",
    categoryLabel: "Virasat Specials",
    state: "Pan-India",
    craftName: "Brass Etching & Handmade Paper",
    price: 699,
    originalPrice: 999,
    rating: 4.9,
    reviewsCount: 195,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    isGiTagged: false,
    artisanName: "Virasat Design Studio x Sanganer Paper Mill",
    artisanCoop: "Rajasthan Kagzi Handmade Paper Guild",
    description: "Hand-embossed antique brass bookmark featuring Indian Jharokha window filigree paired with a 120-page diary made from upcycled cotton rags and seed paper cover.",
    materials: "Pure Etched Brass, 100% Tree-Free Cotton Rag Paper",
    dimensions: "A5 Hardbound Journal + 6\" Metal Bookmark",
    badge: "Virasat Original"
  },
  {
    id: "prod-8",
    name: "Kashmir Hand-carved Walnut Keepsake Chest",
    category: "virasat",
    categoryLabel: "Virasat Specials",
    state: "Jammu & Kashmir",
    craftName: "Kashmir Walnut Wood Carving",
    price: 1299,
    originalPrice: 1750,
    rating: 4.9,
    reviewsCount: 78,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    isGiTagged: true,
    artisanName: "Srinagar Woodcarvers Guild",
    artisanCoop: "Chinar Valley Artisan Foundation",
    description: "Chiseled from seasoned Himalayan walnut wood showcasing the intricate 'Jalidar' and chinar leaf fretwork, with secret sliding closure.",
    materials: "Seasoned Himalayan Walnut Wood, Velvet Lining",
    dimensions: "6\" x 4\" x 3\" inches",
    badge: "GI Certified"
  }
];

interface CartItem {
  product: Product;
  quantity: number;
}

export default function MerchandisePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 1 }
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [orderConfirmedId, setOrderConfirmedId] = useState<string | null>(null);

  // Quick View Modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    const randomId = "VIR-" + Math.floor(100000 + Math.random() * 900000);
    setOrderConfirmedId(randomId);
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  // Filter & Search
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.craftName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2A241F] font-sans pb-24">
      {/* ── Storefront Hero Header ── */}
      <section className="relative overflow-hidden pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#E6DFD3] bg-gradient-to-b from-[#F2ECE1]/60 to-[#F9F6F0]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A23E33]/10 text-[#A23E33] text-xs sm:text-sm font-semibold mb-4 border border-[#A23E33]/20">
              <Sparkles className="w-4 h-4" />
              <span>Virasat Haat • Fair Trade Artisan Marketplace</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-[#2A241F] tracking-tight mb-4">
              Handcrafted Heritage & Collectibles
            </h1>
            <p className="text-sm sm:text-base text-[#5C5346] leading-relaxed">
              Skip industrial imitations. Each piece is hand-fashioned in registered artisan clusters, carrying generational lineage and protected GI designations. 100% direct cooperative proceeds.
            </p>
          </div>

          {/* Floating Cart Trigger Button */}
          <div className="shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-6 py-3.5 bg-[#2A241F] hover:bg-[#1A1410] text-white rounded-2xl font-bold text-sm shadow-md flex items-center gap-3 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#EAE3D9]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#A23E33] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-[#B8ACA0] block leading-tight">Your Bag</span>
                <span className="text-sm font-bold">₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ── Filter Bar & Search ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none text-xs sm:text-sm">
            {[
              { key: "all", label: "All Heritage Items" },
              { key: "textiles", label: "Handloom & Textiles" },
              { key: "pottery", label: "Pottery & Ceramics" },
              { key: "metalcraft", label: "Metalcraft & Brass" },
              { key: "art", label: "Folk Paintings" },
              { key: "virasat", label: "Virasat Originals" }
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? "bg-[#A23E33] text-white shadow-xs"
                    : "bg-white text-[#5C5346] border border-[#E6DFD3] hover:border-[#A23E33]/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-grow sm:w-64">
              <Search className="w-4 h-4 text-[#8B7D6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search craft, state, GI-tag..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E6DFD3] rounded-xl text-xs sm:text-sm text-[#2A241F] placeholder:text-[#8B7D6B] focus:outline-hidden focus:border-[#A23E33]"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-[#E6DFD3] rounded-xl text-xs sm:text-sm text-[#5C5346] focus:outline-hidden cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-[#E6DFD3] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              {/* Product Image Box */}
              <div className="relative h-60 w-full overflow-hidden bg-[#F2ECE1]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.badge && (
                    <span className="px-2.5 py-0.5 bg-[#A23E33] text-white text-[10px] font-bold rounded-full shadow-xs">
                      {product.badge}
                    </span>
                  )}
                  {product.isGiTagged && (
                    <span className="px-2 py-0.5 bg-emerald-800 text-white text-[9px] font-bold rounded-full flex items-center gap-1 shadow-xs">
                      <ShieldCheck className="w-3 h-3" /> GI Protected
                    </span>
                  )}
                </div>

                {/* State Tag */}
                <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[11px] rounded-lg">
                  {product.state}
                </span>

                {/* Quick view button overlay */}
                <button
                  onClick={() => setQuickViewProduct(product)}
                  className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-[#2A241F] rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Quick View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#8B7D6B] mb-1">
                    <span>{product.craftName}</span>
                    <div className="flex items-center gap-1 text-amber-700 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{product.rating}</span>
                      <span className="text-[10px] text-[#8B7D6B]">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#2A241F] line-clamp-1 mb-1 group-hover:text-[#A23E33] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#6E6456] line-clamp-2 mb-3">
                    {product.description}
                  </p>
                </div>

                {/* Pricing & Add To Bag */}
                <div className="pt-3 border-t border-[#F2ECE1]">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-bold text-[#2A241F]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-[#8B7D6B] line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-green-700 font-semibold ml-auto">
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-2.5 bg-[#A23E33] hover:bg-[#8A3329] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Value Guarantee Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-white rounded-3xl p-8 border border-[#E6DFD3] grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#A23E33]/10 text-[#A23E33] flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#2A241F] mb-1 font-serif">100% GI Tag & Origin Authenticity</h4>
            <p className="text-xs text-[#6E6456]">Verified by state craft boards and certified cooperative registries.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#A23E33]/10 text-[#A23E33] flex items-center justify-center mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#2A241F] mb-1 font-serif">Free Pan-India Delivery</h4>
            <p className="text-xs text-[#6E6456]">Insured transit packaging for delicate ceramics, brass, and handlooms.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#A23E33]/10 text-[#A23E33] flex items-center justify-center mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#2A241F] mb-1 font-serif">Direct Artisan FPO Model</h4>
            <p className="text-xs text-[#6E6456]">Eliminates middlemen. 85%+ retail price reaches rural craftsman clusters.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#A23E33]/10 text-[#A23E33] flex items-center justify-center mb-3">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#2A241F] mb-1 font-serif">Virasat Story Card Included</h4>
            <p className="text-xs text-[#6E6456]">Every delivery includes a printed artisan lineage certificate & craft backstory.</p>
          </div>
        </div>
      </section>

      {/* ── Slide-Over Cart Drawer ── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#E6DFD3] animate-in slide-in-from-right duration-300">
            {/* Cart Header */}
            <div className="p-5 border-b border-[#F2ECE1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#A23E33]" />
                <h3 className="font-serif font-bold text-lg text-[#2A241F]">
                  Your Heritage Bag ({cartItemCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#8B7D6B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-5 overflow-y-auto flex-grow divide-y divide-[#F2ECE1]">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[#F2ECE1] flex items-center justify-center mx-auto mb-4 text-[#8B7D6B]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#2A241F] mb-1">Your bag is empty</h4>
                  <p className="text-xs text-[#8B7D6B] mb-6">Discover authentic handcrafts made by India&apos;s master artisans.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2 bg-[#A23E33] text-white text-xs font-bold rounded-xl"
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="py-4 flex gap-4 items-start">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-[#E6DFD3] shrink-0"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-[#2A241F] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#8B7D6B] hover:text-red-600 p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[10px] text-[#8B7D6B] mb-2">{item.product.craftName} • {item.product.state}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-[#E6DFD3] rounded-lg bg-[#FBF9F5]">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="px-2 py-1 text-xs text-[#5C5346] hover:bg-[#EAE3D9] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#2A241F]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="px-2 py-1 text-xs text-[#5C5346] hover:bg-[#EAE3D9] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-[#2A241F]">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-[#F2ECE1] bg-[#FBF9F5] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#6E6456]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2A241F]">₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#6E6456]">
                  <span>Pan-India Shipping</span>
                  <span className="text-green-700 font-bold uppercase tracking-wider text-[10px]">FREE</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-[#2A241F] pt-2 border-t border-[#E6DFD3]">
                  <span>Total Amount</span>
                  <span className="text-base text-[#A23E33]">₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-[#A23E33] hover:bg-[#8A3329] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-[#8B7D6B]">
                  🔒 Secured checkout • Supporting rural craft artisans directly
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Quick View Modal ── */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E6DFD3] relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#8B7D6B] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 h-64 rounded-2xl overflow-hidden bg-[#F2ECE1] border border-[#E6DFD3]">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#A23E33] block mb-1">
                    {quickViewProduct.state} • {quickViewProduct.craftName}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-[#2A241F] mb-2">
                    {quickViewProduct.name}
                  </h3>

                  <div className="text-lg font-bold text-[#2A241F] mb-4">
                    ₹{quickViewProduct.price.toLocaleString("en-IN")}{" "}
                    <span className="text-xs text-[#8B7D6B] line-through font-normal">
                      ₹{quickViewProduct.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className="text-xs text-[#5C5346] leading-relaxed mb-4">
                    {quickViewProduct.description}
                  </p>

                  <div className="text-xs space-y-1.5 p-3 rounded-xl bg-[#F9F6F0] border border-[#EAE3D9] mb-4 text-[#5C5346]">
                    <div><strong>Materials:</strong> {quickViewProduct.materials}</div>
                    <div><strong>Dimensions:</strong> {quickViewProduct.dimensions}</div>
                    <div><strong>Craft Cluster:</strong> {quickViewProduct.artisanCoop}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-3 bg-[#A23E33] hover:bg-[#8A3329] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Confirmed Checkout Modal ── */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#E6DFD3] text-center relative animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-[#2A241F] mb-2">
              Heritage Order Placed!
            </h3>
            <p className="text-xs text-[#6E6456] leading-relaxed mb-6">
              Thank you for carrying India&apos;s living traditions forward. Your order <strong className="text-[#2A241F]">#{orderConfirmedId}</strong> has been transmitted directly to our partner artisan guilds.
            </p>

            <div className="bg-[#F9F6F0] p-4 rounded-2xl border border-[#EAE3D9] text-left text-xs space-y-2 mb-6 text-[#5C5346]">
              <div className="flex justify-between">
                <span>Dispatch Origin:</span>
                <strong className="text-[#2A241F]">Kot Jewar & Bagru Cooperative</strong>
              </div>
              <div className="flex justify-between">
                <span>Estimated Arrival:</span>
                <strong className="text-[#2A241F]">3–5 Business Days</strong>
              </div>
              <div className="flex justify-between">
                <span>Heritage Story Card:</span>
                <strong className="text-green-700">Enclosed with Seal</strong>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCheckoutModalOpen(false);
                setCart([]);
              }}
              className="w-full py-3 bg-[#A23E33] hover:bg-[#8A3329] text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
            >
              Back to Virasat Haat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
