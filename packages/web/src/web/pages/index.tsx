import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import GsapParticles from "../components/GsapParticles";
import { FlippingCard } from "../components/ui/flipping-card";

gsap.registerPlugin(useGSAP);

// Flavor data
const flavors = [
  {
    id: 0,
    name: "Gummy Bear",
    slug: "GUMMY BEAR",
    tagline: "Sweet. Savage. Unstoppable.",
    description:
      "Gummy bear flavor with a wild kick. Bold sweetness with zero artificial colors — just pure, untamed energy.",
    bg: "from-[#FF6B1A] via-[#FF8C00] to-[#CC4400]",
    bgSolid: "#FF6B1A",
    glow: "#FF8C00",
    accent: "#FFE135",
    textColor: "#FFE135",
    can: "/can-sour-gummy.png",
    video: "/can-sour-gummy-spin.mp4",
    floatEmoji: ["🐾", "⚡", "🔥", "💥", "🐻", "❄️", "⚡", "🔥", "🐾"],
    gradient: "radial-gradient(ellipse at 60% 50%, #FF8C00 0%, #FF6B1A 40%, #8B2000 100%)",
  },
  {
    id: 1,
    name: "Strawberry Kiwi",
    slug: "STRAWBERRY",
    tagline: "Fresh. Fierce. Unstoppable.",
    description:
      "A tropical twist that hits clean and finishes wild. Zero sugar, zero artificial taste — just crisp strawberry kiwi perfection.",
    bg: "from-[#C41E3A] via-[#E8175D] to-[#7B0028]",
    bgSolid: "#E8175D",
    glow: "#FF2D6B",
    accent: "#FF9EC6",
    textColor: "#FFB3D1",
    can: "/can-strawberry-kiwi.png",
    video: "/can-strawberry-kiwi-spin.mp4",
    floatEmoji: ["⚡", "🐾", "💥", "🔥", "⚡", "🐻", "💥", "🔥", "🐾"],
    gradient: "radial-gradient(ellipse at 60% 50%, #FF2D6B 0%, #E8175D 40%, #5C0020 100%)",
  },
  {
    id: 2,
    name: "Orange Mango",
    slug: "ORANGE MANGO",
    tagline: "Sunshine in every sip.",
    description:
      "Ripe mango meets fresh citrus — naturally flavored, artificially nothing. Clean energy that tastes like summer.",
    bg: "from-[#FF9500] via-[#FFB830] to-[#CC6600]",
    bgSolid: "#FF9500",
    glow: "#FFCC00",
    accent: "#FFF176",
    textColor: "#FFF176",
    can: "/can-orange-mango.png",
    video: "/can-orange-mango-spin.mp4",
    floatEmoji: ["🔥", "⚡", "🐾", "💥", "🔥", "🐻", "⚡", "💥", "🐾"],
    gradient: "radial-gradient(ellipse at 60% 50%, #FFCC00 0%, #FF9500 40%, #7A3300 100%)",
  },
  {
    id: 3,
    name: "Rocket Pop",
    slug: "ROCKET POP",
    tagline: "Blast off. No limits.",
    description:
      "Bold patriotic flavor reimagined as pure energy. Cherry, blue raspberry, and lime — zero sugar, 160mg caffeine.",
    bg: "from-[#0D2B6E] via-[#1A4DA8] to-[#000D33]",
    bgSolid: "#1A4DA8",
    glow: "#4D9FFF",
    accent: "#FF4466",
    textColor: "#7EC8FF",
    can: "/can-rocket-pop.png",
    video: "/can-rocket-pop-spin.mp4",
    floatEmoji: ["💥", "⚡", "🔥", "🐾", "💥", "🐻", "⚡", "🔥", "💥"],
    gradient: "radial-gradient(ellipse at 60% 50%, #4D9FFF 0%, #1A4DA8 40%, #000D33 100%)",
  },
];

// ─── Hero text refs for GSAP stagger ───────────────────────────────────────
// (FloatingParticle removed — replaced by GsapParticles component)

// Scroll fade-up component
function FadeUp({ children, delay = 0, className = "" }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Index() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const canWrapRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const canY = useTransform(scrollY, [0, 600], [0, 80]);
  const textY = useTransform(scrollY, [0, 600], [0, 40]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const flavor = flavors[active];

  // ─── GSAP: hero text stagger on mount ────────────────────────────────────
  useGSAP(() => {
    if (!heroTextRef.current) return;
    const els = heroTextRef.current.querySelectorAll(".gsap-hero-stagger");
    gsap.set(els, { y: 50, opacity: 0 });
    gsap.to(els, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: "expo.out",
      delay: 0.3,
    });
  }, { scope: heroTextRef });

  // Can entrance handled by Framer AnimatePresence inside canWrapRef

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning || idx === active) return;
      setPrev(active);
      setDirection(idx > active ? 1 : -1);
      setIsTransitioning(true);
      setActive(idx);
      setTimeout(() => {
        setPrev(null);
        setIsTransitioning(false);
      }, 800);
    },
    [active, isTransitioning]
  );

  const next = () => goTo((active + 1) % flavors.length);
  const prev2 = () => goTo((active - 1 + flavors.length) % flavors.length);

  // Mouse parallax
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Auto-advance
  useEffect(() => {
    const t = setTimeout(() => next(), 5000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="bg-[#0A0A0A] text-white font-sans overflow-x-hidden">
      {/* ─── HERO SLIDER ─── */}
      <div ref={heroRef} className="relative w-full h-screen overflow-hidden" style={{ minHeight: "100svh" }}>

        {/* ── BEAR VIDEO — full-bleed background, always visible ── */}
        <div className="absolute inset-0 z-0">
          <video
            src="/hero-bear.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-top"
            style={{ filter: "brightness(0.75) contrast(1.1)" }}
          />
          {/* Deep dark gradient at bottom so text sits clean */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          {/* Left dark fade for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        </div>

        {/* ── Flavor color tint overlay — shifts mood per flavor ── */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`tint-${active}`}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 70% 40%, ${flavor.glow}33 0%, transparent 65%)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>

        {/* ── Noise grain ── */}
        <div
          className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── GSAP Particles ── */}
        <div className="absolute inset-0 z-10">
          <GsapParticles flavorIdx={active} emojis={flavor.floatEmoji} />
        </div>

        {/* ── Giant ghost flavor text ── */}
        <motion.div
          className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none overflow-hidden pb-32"
          style={{ y: textY }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={`slug-${active}`}
              className="font-black italic uppercase tracking-tighter leading-none select-none"
              style={{
                fontSize: "clamp(5rem, 18vw, 20rem)",
                color: "white",
                opacity: 0.06,
                letterSpacing: "-0.03em",
                fontFamily: "'Barlow Condensed', 'Impact', sans-serif",
                whiteSpace: "nowrap",
              }}
              initial={{ x: direction > 0 ? "25%" : "-25%", opacity: 0 }}
              animate={{ x: "0%", opacity: 0.06 }}
              exit={{ x: direction > 0 ? "-25%" : "25%", opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              GO WILD
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* ── NAV ── */}
        <nav className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-16 py-6">
          <div
            className="flex items-center gap-3 font-black italic text-white text-xl md:text-2xl tracking-wider uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
          >
            <img src="/grizzly-logo.webp" alt="Grizzly" className="w-10 h-10 object-contain" />
            GRIZZLY
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold tracking-widest uppercase text-white/80">
            {["Flavors", "About Us", "Store", "Follow"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
          <a
            href="#pricing"
            className="px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: flavor.accent, transition: "background-color 0.5s ease" }}
          >
            Buy Now
          </a>
        </nav>

        {/* ── CAN VIDEO — right side, mid-lower ── */}
        <div
          ref={canWrapRef}
          className="absolute z-20 pointer-events-none hidden md:block"
          style={{
            right: "-2%",
            bottom: "8%",
            width: "min(44vw, 520px)",
            height: "min(44vw, 520px)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`can-img-${active}`}
              className="w-full h-full"
              initial={{ opacity: 0, x: -120, scale: 0.82, rotate: -8 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, x: -80, scale: 0.9, rotate: 4 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={flavor.can}
                alt={flavor.name}
                className="w-full h-full object-contain"
                style={{ filter: `drop-shadow(0 0 50px ${flavor.glow}99) drop-shadow(0 20px 40px rgba(0,0,0,0.6))` }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── MAIN HERO COPY — bottom-left ── */}
        <div className="absolute inset-0 flex items-end z-30 pointer-events-none pb-28 md:pb-20">
          <div className="w-full px-8 md:px-16">
            <div ref={heroTextRef} className="lg:max-w-lg pointer-events-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`copy-${active}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 60 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Eyebrow */}
                  <p
                    className="gsap-hero-stagger text-xs font-black tracking-[0.4em] uppercase mb-3"
                    style={{ color: flavor.accent }}
                  >
                    ⚡ GRIZZLY Energy — Go Wild
                  </p>
                  {/* Flavor name */}
                  <h2
                    className="gsap-hero-stagger font-black italic uppercase leading-none mb-3"
                    style={{
                      fontSize: "clamp(2.8rem, 6vw, 6.5rem)",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      color: "white",
                      textShadow: `0 0 60px ${flavor.glow}99, 0 4px 20px rgba(0,0,0,0.8)`,
                      lineHeight: 0.95,
                    }}
                  >
                    {flavor.name}
                  </h2>
                  {/* Tagline */}
                  <p
                    className="gsap-hero-stagger font-bold italic text-lg md:text-2xl mb-4"
                    style={{ color: flavor.accent, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
                  >
                    {flavor.tagline}
                  </p>
                  {/* Description */}
                  <p className="gsap-hero-stagger text-white/60 text-sm md:text-base max-w-sm leading-relaxed mb-8">
                    {flavor.description}
                  </p>
                  {/* CTAs */}
                  <div className="gsap-hero-stagger flex flex-wrap gap-4">
                    <a
                      href="#pricing"
                      className="px-8 py-4 rounded-full font-black text-black uppercase tracking-wider text-sm transition-transform hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: flavor.accent,
                        boxShadow: `0 0 30px ${flavor.accent}66`,
                      }}
                    >
                      Buy Now — $34.99
                    </a>
                    <button className="px-8 py-4 rounded-full font-bold text-white/90 uppercase tracking-wider text-sm border border-white/25 hover:border-white/60 hover:bg-white/10 transition-all backdrop-blur-sm">
                      All Flavors
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile can — shown below text on small screens */}
        <div className="absolute z-20 pointer-events-none md:hidden"
          style={{ right: "-5%", top: "12%", width: "55vw", height: "55vw" }}>
          <AnimatePresence mode="wait">
            <motion.div key={`can-mob-${active}`} className="w-full h-full"
              initial={{ opacity: 0, x: -60, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <img src={flavor.can} alt={flavor.name}
                className="w-full h-full object-contain"
                style={{ filter: `drop-shadow(0 0 30px ${flavor.glow}99)` }} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SLIDER CONTROLS */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-center gap-6">
          {/* Prev */}
          <button
            onClick={prev2}
            className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95 backdrop-blur-sm"
            aria-label="Previous flavor"
          >
            ←
          </button>
          {/* Dots */}
          <div className="flex gap-3 items-center">
            {flavors.map((f, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative transition-all duration-300"
                style={{ width: i === active ? 32 : 8, height: 8 }}
                aria-label={`Go to ${f.name}`}
              >
                <div
                  className="absolute inset-0 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: i === active ? flavor.accent : "rgba(255,255,255,0.35)",
                    boxShadow: i === active ? `0 0 12px ${flavor.accent}` : "none",
                  }}
                />
              </button>
            ))}
          </div>
          {/* Next */}
          <button
            onClick={next}
            className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95 backdrop-blur-sm"
            aria-label="Next flavor"
          >
            →
          </button>
        </div>

        {/* Flavor strip at bottom */}
        <div className="absolute bottom-20 left-0 right-0 z-20 hidden lg:flex justify-center gap-2 px-16">
          {flavors.map((f, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: i === active ? f.accent : "rgba(255,255,255,0.1)",
                color: i === active ? "#000" : "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* ─── BRAND BAR ─── */}
      <div className="bg-[#111] border-y border-white/5 py-5 overflow-hidden">
        <div className="flex gap-16 animate-marquee whitespace-nowrap" style={{ animation: "marquee 20s linear infinite" }}>
          {[...Array(4)].map((_, rep) =>
            ["⚡ 160mg CAFFEINE", "🚫 ZERO SUGAR", "🎨 NO ARTIFICIAL COLORS", "✅ NATURALLY FLAVORED", "🐻 GO WILD", "💪 CLEAN ENERGY"].map(
              (item, i) => (
                <span key={`${rep}-${i}`} className="text-white/50 text-sm font-bold tracking-widest uppercase mx-8">
                  {item}
                </span>
              )
            )
          )}
        </div>
      </div>

      {/* ─── FLAVORS FLIP CARDS ─── */}
      <section id="flavors" className="py-28 px-8 md:px-16 bg-[#0A0A0A] relative overflow-hidden">
        {/* ambient glow bg */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, #D4A84722 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-xs font-black tracking-[0.4em] uppercase mb-4" style={{ color: "#D4A847" }}>
                🐻 Go Wild
              </p>
              <h2
                className="font-black italic uppercase leading-none"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontFamily: "'Barlow Condensed', 'Impact', sans-serif" }}
              >
                Choose Your Wild
              </h2>
              <p className="text-white/50 mt-4 text-lg max-w-lg mx-auto">
                Hover to flip — four flavors, zero sugar, 160mg caffeine. All naturally colored.
              </p>
            </div>
          </FadeUp>

          <div className="flex flex-wrap justify-center gap-8">
            {flavors.map((f, i) => (
              <FadeUp key={f.id} delay={i * 0.1}>
                <FlippingCard
                  width={280}
                  height={420}
                  frontContent={
                    <div
                      className="flex flex-col h-full w-full rounded-2xl overflow-hidden relative"
                      style={{ border: `1px solid ${f.glow}33` }}
                    >
                      {/* Top: white bg zone for the spin video so multiply removes white bg */}
                      <div className="flex-1 flex items-center justify-center relative overflow-hidden"
                        style={{ background: "linear-gradient(180deg, #f5f5f0 0%, #e8e4da 100%)" }}>
                        {/* subtle flavor tint on white bg */}
                        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 60%, ${f.glow}33 0%, transparent 70%)` }} />
                        <video
                          src={f.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="h-60 w-auto object-contain relative z-10"
                          style={{ mixBlendMode: "multiply" }}
                        />
                      </div>
                      {/* Bottom: dark info zone */}
                      <div className="px-5 pb-6 pt-5" style={{ background: `linear-gradient(160deg, #1a1a1a 0%, #0d0d0d 100%)` }}>
                        <h3 className="font-black italic uppercase text-xl leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: f.textColor }}>
                          {f.name}
                        </h3>
                        <p className="text-white/50 text-xs mt-1 font-semibold tracking-wider uppercase">{f.tagline}</p>
                        <p className="text-white/20 text-[10px] mt-3 font-medium tracking-widest uppercase">Flip for stats →</p>
                      </div>
                    </div>
                  }
                  backContent={
                    <div
                      className="flex flex-col items-center justify-center h-full w-full rounded-2xl px-7 py-8 relative overflow-hidden"
                      style={{ background: `linear-gradient(160deg, ${f.bgSolid}ee 0%, #0d0d0d 100%)`, border: `1px solid ${f.glow}55` }}
                    >
                      <div className="absolute inset-0 rounded-2xl" style={{ background: `radial-gradient(ellipse at 50% 0%, ${f.glow}44 0%, transparent 60%)` }} />
                      <div className="relative z-10 flex flex-col items-center text-center gap-5">
                        <img src="/grizzly-logo-full.webp" className="w-20 h-20 object-contain" alt="Grizzly" style={{ filter: "drop-shadow(0 0 12px rgba(255,255,255,0.25))" }} />
                        <h3 className="font-black italic uppercase text-2xl leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {f.name}
                        </h3>
                        <p className="text-white/80 text-sm leading-relaxed">{f.description}</p>
                        <div className="flex flex-col gap-2 w-full mt-2">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                            <span className="text-white/50">Caffeine</span><span style={{ color: f.accent }}>160mg</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                            <span className="text-white/50">Sugar</span><span style={{ color: f.accent }}>0g</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                            <span className="text-white/50">Calories</span><span style={{ color: f.accent }}>10</span>
                          </div>
                        </div>
                        <a
                          href="#pricing"
                          className="mt-2 w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider text-center text-black transition-all hover:scale-105 active:scale-95"
                          style={{ backgroundColor: f.accent, boxShadow: `0 0 20px ${f.accent}66` }}
                        >
                          Buy Now →
                        </a>
                      </div>
                    </div>
                  }
                />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BRAND STORY ─── */}
      <section id="about" className="py-32 px-8 md:px-16 lg:px-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 50%, #D4A847 0%, transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div>
              <span className="text-[#D4A847] text-sm font-bold tracking-[0.3em] uppercase block mb-4">Our Story</span>
              <h2
                className="font-black italic uppercase text-white leading-none mb-6"
                style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Claw Your Way
                <br />
                <span className="text-[#D4A847]">To The Top.</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                Here at GRIZZLY Energy we pride ourselves on providing high quality beverages free of any artificial colors
                or flavors — and they taste delicious. That typical "energy drink aftertaste" doesn't exist with GRIZZLY.
              </p>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Our story is one of hard work, dedication, and a commitment to excellence. We don't take shortcuts, and we
                don't make promises we can't keep. We stand behind our products and our customers, striving every day to
                make the best tasting energy drinks on the market.
              </p>
              <a
                href="#pricing"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A847] text-black rounded-full font-black uppercase tracking-wider text-sm hover:scale-105 transition-transform active:scale-95"
              >
                Shop All Flavors →
              </a>
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="relative">
              <img
                src="/hero-hand.png"
                alt="Grizzly Energy Can"
                className="w-full max-w-md mx-auto rounded-2xl object-cover"
                style={{
                  filter: "drop-shadow(0 30px 60px rgba(212,168,71,0.3))",
                }}
              />
              {/* Stats overlay */}
              <div className="absolute -bottom-6 -left-6 bg-[#D4A847] text-black rounded-2xl p-5 text-center shadow-2xl">
                <div className="text-4xl font-black">160mg</div>
                <div className="text-xs font-bold uppercase tracking-widest mt-1">Caffeine</div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white text-black rounded-2xl p-5 text-center shadow-2xl">
                <div className="text-4xl font-black">0g</div>
                <div className="text-xs font-bold uppercase tracking-widest mt-1">Sugar</div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 px-8 md:px-16 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="text-[#D4A847] text-sm font-bold tracking-[0.3em] uppercase block mb-3">Why Grizzly</span>
            <h2
              className="font-black italic uppercase text-white leading-none"
              style={{ fontSize: "clamp(2rem, 4vw, 4rem)", fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Energy Without Compromise
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎨",
                title: "Zero Artificial Colors",
                desc: "What you see is what nature made. No dyes, no fake pigments — just clean, transparent ingredients.",
              },
              {
                icon: "🌿",
                title: "Naturally Flavored",
                desc: "Every sip tastes exactly like it should — real fruit-inspired flavors with no chemical aftertaste.",
              },
              {
                icon: "⚡",
                title: "160mg Caffeine",
                desc: "The perfect dose to fuel your focus, sharpen your edge, and power through whatever the day throws.",
              },
              {
                icon: "🚫",
                title: "Zero Sugar",
                desc: "Full flavor, zero guilt. Grizzly delivers the taste you want without the sugar crash you don't.",
              },
              {
                icon: "💧",
                title: "Hydration Boost",
                desc: "Formulated with B vitamins and taurine to keep you sharp, hydrated, and performing at your peak.",
              },
              {
                icon: "🐻",
                title: "Crisp Clean Finish",
                desc: "No lingering bitterness. No artificial aftertaste. Just a clean, refreshing finish every single time.",
              },
            ].map((feat, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="group relative p-8 rounded-2xl border border-white/5 bg-white/3 hover:bg-white/6 transition-all hover:border-[#D4A847]/30 hover:-translate-y-1 cursor-default overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4A847]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl mb-4">{feat.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-3">{feat.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="py-16 px-8 md:px-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="text-center text-white/30 text-xs font-bold tracking-[0.4em] uppercase mb-10">
              As Seen In & Trusted By
            </p>
          </FadeUp>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {["Amazon", "GNC", "Walmart", "Vitamin Shoppe", "Target", "Bodybuilding.com"].map((brand, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="text-white/20 font-black text-xl tracking-widest uppercase hover:text-white/50 transition-colors cursor-default">
                  {brand}
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="reviews" className="py-32 px-8 md:px-16 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="text-[#D4A847] text-sm font-bold tracking-[0.3em] uppercase block mb-3">Reviews</span>
            <h2
              className="font-black italic uppercase text-white leading-none"
              style={{ fontSize: "clamp(2rem, 4vw, 4rem)", fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              The Grizzly Nation Speaks
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Finally an energy drink that doesn't taste like a chemistry lab. The Sour Gummy Bear flavor is insanely good — I replaced my morning coffee completely.",
                name: "Marcus T.",
                title: "Personal Trainer, Austin TX",
                rating: 5,
                avatar: "MT",
                color: "#FF6B1A",
              },
              {
                quote:
                  "I'm super picky about what I put in my body. Grizzly is the only energy drink I trust — no artificial junk, clean ingredients, and it actually works.",
                name: "Sarah K.",
                title: "Nutritionist & Athlete",
                rating: 5,
                avatar: "SK",
                color: "#E8175D",
              },
              {
                quote:
                  "The Rocket Pop flavor is fire. I've tried every energy drink out there and nothing comes close to the clean finish Grizzly delivers. Zero crash, zero regret.",
                name: "Devon R.",
                title: "Content Creator & Gamer",
                rating: 5,
                avatar: "DR",
                color: "#1A4DA8",
              },
            ].map((t, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="p-8 rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-all hover:-translate-y-1 group relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-60"
                    style={{ backgroundColor: t.color }}
                  />
                  <div className="flex text-[#D4A847] text-sm mb-4 gap-0.5">
                    {[...Array(t.rating)].map((_, s) => (
                      <span key={s}>★</span>
                    ))}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{t.name}</div>
                      <div className="text-white/40 text-xs">{t.title}</div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-32 px-8 md:px-16 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="text-[#D4A847] text-sm font-bold tracking-[0.3em] uppercase block mb-3">Stock Up</span>
            <h2
              className="font-black italic uppercase text-white leading-none mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 4rem)", fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Choose Your Pack
            </h2>
            <p className="text-white/50 max-w-md mx-auto">Free shipping on all orders. 30-day satisfaction guarantee.</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {[
              {
                name: "Starter Pack",
                qty: "6-Can Sampler",
                price: "$17.99",
                per: "$3.00/can",
                features: ["Try all 4 flavors", "Free shipping", "Perfect intro", "30-day guarantee"],
                cta: "Buy Now",
                highlight: false,
              },
              {
                name: "Beast Mode",
                qty: "12-Can Variety",
                price: "$34.99",
                per: "$2.92/can",
                features: ["Pick your flavors", "Priority shipping", "Most popular", "30-day guarantee", "Save 8%"],
                cta: "Buy Now",
                highlight: true,
              },
              {
                name: "Alpha Pack",
                qty: "24-Can Case",
                price: "$59.99",
                per: "$2.50/can",
                features: ["Full case — any flavor", "Free 2-day shipping", "Best value", "30-day guarantee", "Save 17%"],
                cta: "Buy Now",
                highlight: false,
              },
            ].map((plan, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div
                  className={`relative rounded-2xl p-8 flex flex-col h-full transition-all hover:-translate-y-1 ${
                    plan.highlight
                      ? "border-2 border-[#D4A847] bg-gradient-to-b from-[#D4A847]/10 to-transparent"
                      : "border border-white/8 bg-white/3 hover:border-white/15"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4A847] text-black text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full">
                      Best Value
                    </div>
                  )}
                  <div className="mb-6">
                    <p className="text-[#D4A847] text-xs font-bold tracking-widest uppercase mb-1">{plan.qty}</p>
                    <h3 className="text-white font-black text-2xl mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white">{plan.price}</span>
                    </div>
                    <span className="text-white/40 text-sm">{plan.per}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-3 text-sm text-white/70">
                        <span className="text-[#D4A847]">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://drinkgrizzly.com"
                    target="_blank"
                    rel="noopener"
                    className={`block text-center py-4 rounded-full font-black uppercase tracking-wider text-sm transition-all hover:scale-105 active:scale-95 ${
                      plan.highlight ? "bg-[#D4A847] text-black" : "border border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative py-32 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4A847]/20 via-[#FF6B1A]/10 to-transparent" />
        <div className="absolute inset-0 bg-[#0A0A0A]/70" />
        <FadeUp className="relative z-10 text-center max-w-3xl mx-auto">
          <h2
            className="font-black italic uppercase text-white leading-none mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)", fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Go Wild.{" "}
            <span className="text-[#D4A847]">No Limits.</span>
          </h2>
          <p className="text-white/60 text-xl mb-10">
            With GRIZZLY by your side, there's no limit to what you can achieve.
          </p>
          <a
            href="https://drinkgrizzly.com"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#D4A847] text-black rounded-full font-black uppercase tracking-wider text-base hover:scale-105 transition-transform active:scale-95 shadow-2xl"
            style={{ boxShadow: "0 0 60px rgba(212,168,71,0.4)" }}
          >
            Buy Now — Shop All Flavors →
          </a>
        </FadeUp>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-16 px-8 md:px-16 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 font-black italic text-white text-2xl mb-4 uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                <img src="/grizzly-logo.webp" alt="Grizzly" className="w-10 h-10 object-contain" />
                GRIZZLY
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                High-quality energy drinks. Zero artificial colors. Zero aftertaste. 100% wild.
              </p>
            </div>
            {[
              {
                title: "Products",
                links: ["Sour Gummy Bear", "Strawberry Kiwi", "Orange Mango", "Rocket Pop", "All Flavors"],
              },
              { title: "Company", links: ["About Us", "Our Story", "Blog", "Press", "Careers"] },
              { title: "Support", links: ["FAQ", "Shipping", "Returns", "Contact Us", "Store Locator"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-white/40 text-sm hover:text-white/70 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
            <p className="text-white/20 text-xs">© 2025 GRIZZLY Energy Drinks. All rights reserved.</p>
            <div className="flex gap-4">
              {["Instagram", "TikTok", "YouTube", "Twitter"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-white/30 text-xs hover:text-white/70 transition-colors font-medium uppercase tracking-wider"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;0,900;1,700;1,800;1,900&family=Inter:wght@400;500;600;700&display=swap');

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        * { box-sizing: border-box; }
        
        html { scroll-behavior: smooth; }
        
        body { 
          background: #0A0A0A; 
          font-family: 'Inter', sans-serif;
        }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #D4A847; border-radius: 2px; }
      `}</style>
    </div>
  );
}
