"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  MapPin,
  Calendar,
  Sparkles,
  Plus,
  Compass,
  CheckCircle2,
  Flame,
  HelpCircle,
  X,
  Send,
  Camera,
  Check
} from "lucide-react";

interface Comment {
  id: string;
  author: string;
  timeAgo: string;
  text: string;
}

interface CommunityPost {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  state: string;
  timeAgo: string;
  title: string;
  content: string;
  category: "all" | "gems" | "artisan" | "traditions" | "qa";
  categoryLabel: string;
  image?: string;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  tags: string[];
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    author: "Kavita Soni",
    authorRole: "Heritage Documenter • 14 States Traveled",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    state: "Rajasthan",
    timeAgo: "2 hours ago",
    title: "The 88-year-old Bandhani Master tucked inside Jodhpur's blue alleys",
    content: "Past the chaotic spice market of Clock Tower, down an alley too narrow for autos in Navchokiya, lives Ustad Ramnarayan. He still pinches fabric with brass rings without looking, creating over 2,000 micro-knots per meter. His grandson told me fast fashion brands offered to print his motifs digitally, but he refused: 'Machine prints the color, but hand knots tie the prayer.' If you visit Jodhpur, skip the tourist shops and spend an hour watching him work.",
    category: "artisan",
    categoryLabel: "Artisan Encounter",
    image: "https://images.unsplash.com/photo-1609137144822-0d1933e4f71a?auto=format&fit=crop&w=800&q=80",
    likes: 142,
    isLiked: false,
    comments: [
      {
        id: "c-1",
        author: "Aarav Sharma",
        timeAgo: "1 hour ago",
        text: "This is magical! Could you share which lane in Navchokiya? Visiting next Tuesday."
      },
      {
        id: "c-2",
        author: "Kavita Soni",
        timeAgo: "45 mins ago",
        text: "Just ask for 'Ramnarayan Bandhani Wale' near the old well behind the blue temple gate!"
      }
    ],
    tags: ["#Rajasthan", "#Bandhani", "#LivingHeritage", "#Jodhpur"]
  },
  {
    id: "post-2",
    author: "Rahul Mishra",
    authorRole: "Archaeology Enthusiast • Patna",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    state: "Bihar",
    timeAgo: "Yesterday",
    title: "Why Bodh Gaya at 5:00 AM changes you forever",
    content: "Most tourists visit Mahabodhi Temple at noon when the sandstone warms up. Come at dawn instead. The fog lingers over the 50-meter spire, butter lamps flicker in thousands, and monks from Ladakh, Thailand, Sri Lanka, and Tibet chant simultaneously in Pali and Sanskrit. The ancient Bodhi tree rustles in the breeze—the silence between chants is louder than any monument in the country.",
    category: "traditions",
    categoryLabel: "Sacred Traditions",
    image: "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80",
    likes: 218,
    isLiked: false,
    comments: [
      {
        id: "c-3",
        author: "Sunita Patel",
        timeAgo: "18 hours ago",
        text: "Sitting under the Bodhi tree at sunrise was one of the most serene moments of my life. Beautifully captured."
      }
    ],
    tags: ["#Bihar", "#Mahabodhi", "#SpiritualIndia", "#BodhGaya"]
  },
  {
    id: "post-3",
    author: "Manu Nair",
    authorRole: "Cultural Anthropologist • Thrissur",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    state: "Kerala",
    timeAgo: "2 days ago",
    title: "Secret Kathakali Green Room ritual in Thrissur",
    content: "Before a Kathakali actor takes the stage as Ravana or Arjuna, they spend four hours lying motionless on woven rush mats while the 'Chutti' master applies ground rice paste and lime to sculpt facial ridges. There is zero conversation in the green room. The actor enters a trance-like mental state called 'Veshapparcha', where they shed human identity and invite the deity or demon inside.",
    category: "gems",
    categoryLabel: "Hidden Heritage Gems",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    likes: 189,
    isLiked: false,
    comments: [],
    tags: ["#Kerala", "#Kathakali", "#ClassicalArts", "#Thrissur"]
  },
  {
    id: "post-4",
    author: "Priyanka Sen",
    authorRole: "Solo Traveler & Blogger",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    state: "Rajasthan",
    timeAgo: "3 days ago",
    title: "Question: Where can travelers learn natural indigo block-printing in Bagru without tourist markup?",
    content: "I want to spend 2 full days in Bagru village actually mixing clay resist (Dabu) and natural fermented indigo rather than just a 15-minute souvenir stamp. Any specific artisan family or community cooperative you recommend reaching out to?",
    category: "qa",
    categoryLabel: "Q&A & Travel Help",
    likes: 87,
    isLiked: false,
    comments: [
      {
        id: "c-4",
        author: "Mohan Lal Chhipa",
        timeAgo: "2 days ago",
        text: "Reach out to the Bagru Handprinters Union near the community pond. They organize direct 2-day workshops where you prepare your own teak blocks and mud bath."
      },
      {
        id: "c-5",
        author: "Priyanka Sen",
        timeAgo: "1 day ago",
        text: "Thank you Mohan ji! Booking my train now!"
      }
    ],
    tags: ["#Bagru", "#BlockPrint", "#CraftWorkshop", "#HelpWanted"]
  }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    "post-1": true
  });
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  
  // New Story Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newState, setNewState] = useState("Rajasthan");
  const [newCategory, setNewCategory] = useState<"gems" | "artisan" | "traditions" | "qa">("gems");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");

  // Meetup RSVP state
  const [rsvps, setRsvps] = useState<Record<string, boolean>>({
    "walk-1": true
  });

  // Toggle Like
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      })
    );
  };

  // Toggle Comments
  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Add Comment
  const handleAddComment = (postId: string) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: `c-${Date.now()}`,
                author: "You (Heritage Explorer)",
                timeAgo: "Just now",
                text
              }
            ]
          };
        }
        return post;
      })
    );

    setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  // Handle Post Submit
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent || !newAuthor) return;

    const categoryLabels = {
      gems: "Hidden Heritage Gems",
      artisan: "Artisan Encounter",
      traditions: "Sacred Traditions",
      qa: "Q&A & Travel Help"
    };

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: newAuthor,
      authorRole: "Virasat Contributor",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      state: newState,
      timeAgo: "Just now",
      title: newTitle,
      content: newContent,
      category: newCategory,
      categoryLabel: categoryLabels[newCategory],
      likes: 1,
      isLiked: true,
      comments: [],
      tags: newTags
        ? newTags.split(",").map((t) => (t.trim().startsWith("#") ? t.trim() : `#${t.trim()}`))
        : [`#${newState}`, "#Heritage"]
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewAuthor("");
    setNewContent("");
    setNewTags("");
  };

  const toggleRsvp = (walkId: string) => {
    setRsvps((prev) => ({
      ...prev,
      [walkId]: !prev[walkId]
    }));
  };

  const filteredPosts = activeCategory === "all"
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2A241F] font-sans pb-24">
      {/* ── Community Hero ── */}
      <section className="relative overflow-hidden pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#E6DFD3] bg-gradient-to-b from-[#F2ECE1]/60 to-[#F9F6F0]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A23E33]/10 text-[#A23E33] text-xs sm:text-sm font-semibold mb-4 border border-[#A23E33]/20">
              <Users className="w-4 h-4" />
              <span>Virasat Sangam • The Living Archive</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-[#2A241F] tracking-tight mb-4">
              India Told By India
            </h1>
            <p className="text-sm sm:text-base text-[#5C5346] leading-relaxed">
              Unvarnished memories, hidden temple ruins, forgotten folk ballads, and direct encounters with master artisans. Shared by locals, seekers, and travelers.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 bg-[#A23E33] hover:bg-[#8A3329] text-white rounded-2xl font-bold text-sm shadow-md flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Share Your Story</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Main Feed Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Stories & Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm">
            {[
              { key: "all", label: "All Chronicles" },
              { key: "artisan", label: "Artisan Encounters" },
              { key: "gems", label: "Hidden Gems" },
              { key: "traditions", label: "Sacred Traditions" },
              { key: "qa", label: "Q&A / Travel Advice" }
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-[#A23E33] text-white shadow-xs"
                    : "bg-white text-[#5C5346] border border-[#E6DFD3] hover:border-[#A23E33]/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl border border-[#E6DFD3] p-6 shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Author Bar */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover border border-[#E6DFD3]"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#2A241F] flex items-center gap-2">
                        <span>{post.author}</span>
                        <span className="text-[10px] bg-[#EAE3D9] text-[#6E6456] px-2 py-0.5 rounded-full font-medium">
                          {post.state}
                        </span>
                      </h4>
                      <p className="text-[11px] text-[#8B7D6B]">{post.authorRole} • {post.timeAgo}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-[#A23E33] bg-[#A23E33]/10 px-3 py-1 rounded-full border border-[#A23E33]/20">
                    {post.categoryLabel}
                  </span>
                </div>

                {/* Title & Body */}
                <h3 className="font-serif font-bold text-xl text-[#2A241F] mb-3 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-[#5C5346] leading-relaxed mb-4 whitespace-pre-line">
                  {post.content}
                </p>

                {/* Optional Attached Media */}
                {post.image && (
                  <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden mb-4 border border-[#E6DFD3]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] text-[#8B7D6B] bg-[#F9F6F0] px-2.5 py-1 rounded-lg border border-[#E6DFD3]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Interaction Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F2ECE1] text-xs text-[#6E6456]">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        post.isLiked
                          ? "bg-red-50 text-red-600 font-bold"
                          : "hover:bg-[#F2ECE1] text-[#6E6456]"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          post.isLiked ? "fill-red-600 text-red-600" : ""
                        }`}
                      />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#F2ECE1] transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments.length} Comments</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Story link copied to clipboard!");
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-[#F2ECE1] text-[#8B7D6B] cursor-pointer"
                    title="Share story"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Expandable Comments Drawer */}
                {expandedComments[post.id] && (
                  <div className="mt-4 pt-4 border-t border-[#F2ECE1] space-y-3 bg-[#FBF9F5] p-4 rounded-2xl">
                    <h5 className="text-xs font-bold text-[#2A241F] uppercase tracking-wider">
                      Discussion ({post.comments.length})
                    </h5>

                    {post.comments.length === 0 ? (
                      <p className="text-xs text-[#8B7D6B] italic">No replies yet. Be the first to share your thoughts!</p>
                    ) : (
                      post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-white p-3 rounded-xl border border-[#E6DFD3] text-xs space-y-1"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#2A241F]">{comment.author}</span>
                            <span className="text-[10px] text-[#8B7D6B]">{comment.timeAgo}</span>
                          </div>
                          <p className="text-[#5C5346] leading-relaxed">{comment.text}</p>
                        </div>
                      ))
                    )}

                    {/* New Comment Input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={newCommentText[post.id] || ""}
                        onChange={(e) =>
                          setNewCommentText({
                            ...newCommentText,
                            [post.id]: e.target.value
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddComment(post.id);
                        }}
                        placeholder="Add your thought or advice..."
                        className="flex-grow px-3 py-2 bg-white border border-[#E6DFD3] rounded-xl text-xs text-[#2A241F] focus:outline-hidden focus:border-[#A23E33]"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="p-2 bg-[#A23E33] hover:bg-[#8A3329] text-white rounded-xl text-xs font-bold cursor-pointer"
                        title="Post Comment"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Meetups, Spotlight & Guidelines */}
        <div className="space-y-6">
          {/* Upcoming Heritage Walks / Meetups */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6DFD3] shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#A23E33]" />
              <h3 className="font-serif font-bold text-lg text-[#2A241F]">
                Upcoming Heritage Walks
              </h3>
            </div>
            <p className="text-xs text-[#6E6456] mb-5">
              Volunteer-led cultural strolls and artisan guild meetups. Join travelers and locals.
            </p>

            <div className="space-y-4">
              {[
                {
                  id: "walk-1",
                  title: "Old Delhi Midnight Haveli Stroll",
                  date: "Sat, Oct 18 • 6:30 PM",
                  city: "Chandni Chowk, Delhi",
                  attendees: 38
                },
                {
                  id: "walk-2",
                  title: "Amber Stepwells & Night Photography",
                  date: "Sun, Oct 26 • 7:00 PM",
                  city: "Jaipur, Rajasthan",
                  attendees: 24
                },
                {
                  id: "walk-3",
                  title: "Kochi Spice Route & Synagogue Walk",
                  date: "Fri, Nov 07 • 4:00 PM",
                  city: "Fort Kochi, Kerala",
                  attendees: 19
                }
              ].map((walk) => {
                const isAttending = rsvps[walk.id];
                return (
                  <div
                    key={walk.id}
                    className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#8B7D6B] mb-1">
                        <span>{walk.city}</span>
                        <span className="font-semibold text-[#A23E33]">{walk.date}</span>
                      </div>
                      <h4 className="font-bold text-xs text-[#2A241F] font-serif">
                        {walk.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#EAE3D9]/60">
                      <span className="text-[11px] text-[#8B7D6B]">
                        {walk.attendees + (isAttending ? 1 : 0)} Attending
                      </span>
                      <button
                        onClick={() => toggleRsvp(walk.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isAttending
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-[#A23E33] text-white hover:bg-[#8A3329]"
                        }`}
                      >
                        {isAttending ? "✓ RSVP'd" : "Join Walk"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Artisan of the Month Spotlight */}
          <div className="bg-gradient-to-br from-[#2A241F] to-[#3A322B] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A23E33]/20 rounded-bl-full pointer-events-none" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#EAE3D9] bg-white/10 px-2.5 py-0.5 rounded-full inline-block mb-3">
              Craft Legend Spotlight
            </span>
            <h4 className="font-serif font-bold text-lg mb-1">Master Weaver G. Radha</h4>
            <p className="text-xs text-[#C8BFB5] mb-4">
              50 years weaving gold Kasavu cotton in Kuthampully, Kerala. Preserving 18th-century temple motifs.
            </p>
            <Link
              href="/journey"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EAE3D9] hover:text-white underline underline-offset-4"
            >
              <span>Explore Master Interview in 3D Journey</span>
              <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Heritage Guidelines */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6DFD3] text-xs text-[#5C5346] space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#2A241F] mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#A23E33]" />
              <span>Virasat Community Code</span>
            </h4>
            <p>✦ <strong>Respect Sacred Space:</strong> Ask permissions before photographing inner sanctums or ritual rites.</p>
            <p>✦ <strong>Honor the Artisan:</strong> Credit master craftspeople by name and village clan.</p>
            <p>✦ <strong>Zero Rubbish:</strong> Leave ancient fort walls and stepwells cleaner than you found them.</p>
          </div>
        </div>
      </div>

      {/* ── Share Your Story Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E6DFD3] relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#8B7D6B] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-2xl text-[#2A241F] mb-1">
              Share Your Virasat Story
            </h3>
            <p className="text-xs text-[#6E6456] mb-6">
              Contribute a living chronicle of your heritage discovery to our community archive.
            </p>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2A241F] uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Ananya Roy, Heritage Traveler"
                  className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#E6DFD3] rounded-xl text-sm text-[#2A241F] focus:outline-hidden focus:border-[#A23E33]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2A241F] uppercase tracking-wider mb-1">
                    State / Region
                  </label>
                  <select
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FBF9F5] border border-[#E6DFD3] rounded-xl text-xs text-[#2A241F] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Pan-India">Pan-India</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#2A241F] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#FBF9F5] border border-[#E6DFD3] rounded-xl text-xs text-[#2A241F] focus:outline-hidden cursor-pointer"
                  >
                    <option value="gems">Hidden Heritage Gems</option>
                    <option value="artisan">Artisan Encounter</option>
                    <option value="traditions">Sacred Traditions</option>
                    <option value="qa">Q&A / Travel Help</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2A241F] uppercase tracking-wider mb-1">
                  Title of Chronicle
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. The forgotten Sun Temple carved into Granite"
                  className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#E6DFD3] rounded-xl text-sm text-[#2A241F] focus:outline-hidden focus:border-[#A23E33]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2A241F] uppercase tracking-wider mb-1">
                  Your Narrative / Discovery
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe your encounter, historical facts, sensory details, or questions for local guides..."
                  className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#E6DFD3] rounded-xl text-xs text-[#2A241F] focus:outline-hidden focus:border-[#A23E33]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2A241F] uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. #TempleArchitecture, #StoneCarving, #Hampi"
                  className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#E6DFD3] rounded-xl text-xs text-[#2A241F] focus:outline-hidden focus:border-[#A23E33]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#A23E33] hover:bg-[#8A3329] text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Publish to Virasat Sangam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
