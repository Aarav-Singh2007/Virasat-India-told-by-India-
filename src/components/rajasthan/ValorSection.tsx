"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const VALOR_STORIES = [
  {
    id: "pratap",
    title: "Maharana Pratap",
    subtitle: "He could have surrendered. He chose the hills instead.",
    images: ["/Rajasthan/MaharanaPratap_Portrait.jpg", "/Rajasthan/HaldighatiMap.jpg"],
    imageLabels: ["Maharana Pratap", "Battle of Haldighati — 1576"],
    body: [
      "In 1576, the Mughal Emperor Akbar sent an army of 80,000 men to bring Rajasthan to heel. Maharana Pratap met them at Haldighati pass with 20,000.",
      "He lost the battle. He won the legend.",
      "For the next 25 years, Pratap refused to sign any treaty with the Mughal court. He lived in the Aravalli forests, ate grass rotis when grain ran out, and never stopped fighting. By the time he died in 1597, he had recaptured most of Mewar. Without a single treaty.",
      "Akbar — the greatest Mughal emperor — is said to have wept when he heard of Pratap's death. That is the measure of the man.",
    ],
    quote: "\"Better to live in the jungles and eat wild berries than to bow before the Mughal throne.\"",
    quoteAttr: "— Maharana Pratap",
  },
  {
    id: "chetak",
    title: "Chetak — The Horse of Legend",
    subtitle: "He carried his master to safety. Then he stopped.",
    images: ["/Rajasthan/Chetak_Statue.jpg"],
    imageLabels: ["Chetak's statue — Haldighati"],
    body: [
      "At Haldighati, surrounded and outnumbered, Maharana Pratap was gravely wounded. His horse Chetak — already injured, one leg bleeding — galloped for miles to carry Pratap beyond the Mughal line.",
      "Then Chetak collapsed. He died crossing a stream. His master survived.",
      "Rajasthan built him a statue at Haldighati. Every child in the state learns his story before they learn long division. A horse. A legend. Still remembered 450 years later.",
    ],
    quote: "\"Chetak, my horse, you did what no man could.\"",
    quoteAttr: "— Folk verse, Rajasthan",
  },
  {
    id: "padharo",
    title: "Padharo Mhare Desh",
    subtitle: "The hospitality code — not a tourism slogan. A way of life.",
    images: ["/Rajasthan/SepiaphotoofJaipurroyalcourt.jpg"],
    imageLabels: ["Jaipur royal court — early 20th century"],
    body: [
      "\"Padharo Mhare Desh\" — Welcome to my land — is not a tourism tagline invented by a marketing department.",
      "It is a Rajasthani folk phrase that predates the state by centuries. In the desert, where a traveller arriving without water could die, hospitality was not optional. It was the law.",
      "The Rajput code of \"Atithi Devo Bhava\" (the guest is God) meant that even an enemy who arrived at your door as a guest could not be harmed under your roof. The phrase is still used today — in homes, at weddings, and, yes, now on Rajasthan Tourism posters.",
    ],
    quote: "\"The guest is God. Even if he is your enemy.\"",
    quoteAttr: "— Rajput hospitality code",
  },
];

export default function ValorSection() {
  const [active, setActive] = useState(0);
  const story = VALOR_STORIES[active];

  return (
    <section id="valor" className="relative w-full bg-[#0D0700] py-20">
      {/* Header */}
      <div className="px-6 md:px-16 text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#A23E33] text-xs font-bold tracking-[0.3em] uppercase font-sans mb-3"
        >
          Chapter II
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold text-[#E9E4D8] font-serif mb-4"
        >
          They Chose the Hill
        </motion.h2>
        <p className="text-[#6B6355] text-lg max-w-xl mx-auto font-sans">
          The human story behind the stone. Valor wasn't performed — it was the only option they had.
        </p>
      </div>

      {/* Story selector */}
      <div className="flex justify-center gap-3 mb-10 px-6 flex-wrap">
        {VALOR_STORIES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold font-sans transition-all ${
              active === i
                ? "bg-[#A23E33] text-white shadow-lg shadow-[#A23E33]/30"
                : "border border-[#3D3428] text-[#6B6355] hover:border-[#A23E33]/50 hover:text-[#A89880]"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Story display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={story.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="px-6 md:px-16 max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Images */}
            <div className="flex flex-col gap-4">
              {story.images.map((src, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-2xl shadow-2xl ${
                    story.images.length === 1 ? "h-72 md:h-96" : "h-52 md:h-64"
                  }`}
                >
                  <Image
                    src={src}
                    alt={story.imageLabels[i]}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0700]/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[#A89880] text-xs font-sans bg-[#0D0700]/70 px-2.5 py-1 rounded-full">
                    {story.imageLabels[i]}
                  </span>
                </div>
              ))}

              {/* Quote block */}
              <div className="border-l-2 border-[#A23E33] pl-5 py-2 mt-2">
                <p className="text-[#D9A404] font-serif text-lg italic leading-relaxed">
                  {story.quote}
                </p>
                <p className="text-[#6B6355] text-xs font-sans mt-2">{story.quoteAttr}</p>
              </div>
            </div>

            {/* Text */}
            <div>
              <h3 className="text-3xl font-bold text-[#E9E4D8] font-serif mb-1">{story.title}</h3>
              <p className="text-[#A23E33] font-sans text-sm mb-6 italic">{story.subtitle}</p>

              <div className="flex flex-col gap-4">
                {story.body.map((para, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className={`font-sans leading-relaxed ${
                      para.length < 60
                        ? "text-xl text-[#D9A404] font-semibold"
                        : "text-[#A89880] text-base md:text-lg"
                    }`}
                  >
                    {para}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
