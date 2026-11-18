"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, Eye } from "lucide-react";

const H = "font-[family-name:var(--font-head)]";
const DURATION = 6500; // ms per slide

/* ------------------------------------------------------------------
   Rang yahin se badal sakte ho:
   DARK   = section ka gehra background
   MID    = gradient ka doosra rang
   ACCENT = buttons, line, progress bar (logo ke lal jaisa)
   GOLD   = visitors badge
------------------------------------------------------------------ */
const DARK = "#0B2A21";
const MID = "#14503E";
const ACCENT = "#FF6B4A";
const GOLD = "#FFD166";

/* ------------------------------------------------------------------
   EDIT HERE: 3 photos public/images/ me rakho aur naam set karo.
   Slide 1 pehle school.heroImage (API) use karta hai, agar ho.
------------------------------------------------------------------ */
const SLIDES = [
  {
    image: "/images/hero-3.jpg",
    thumb: "Morning Prayer",
    tag: "Admissions open",
    line1: "Where Every Day",
    line2: "Begins With Values.",
    text: "Our students start each morning together in prayer, building discipline, respect and a calm mind for learning.",
    cta: { label: "Apply for Admission", href: "/online-admission" },
  },
  {
    image: "/images/hero-2.jpg",
    thumb: "School Campus",
    tag: "Our campus",
    line1: "A Green Campus,",
    line2: "A Growing Future.",
    text: "A friendly and open campus in Niz Dhing where children learn, play and grow with the guidance of caring teachers.",
    cta: { label: "View Gallery", href: "/gallery" },
  },
  {
    image: "/images/hero-1.jpg",
    thumb: "Our Students",
    tag: "Discipline & learning",
    line1: "Learning Together,",
    line2: "Standing Tall.",
    text: "Hundreds of students, one school family, united by dedication and the will to do better every day.",
    cta: { label: "Meet Our Teachers", href: "/teachers" },
  },
];

export default function HeroSlider({
  schoolName = "Our School",
  school = {},
  visitorsValue = "—",
  studentsValue = "—",
  teachersValue = "—",
  yearsOfService = 0,
}) {
  const total = SLIDES.length;
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const [touchX, setTouchX] = useState(null);

  const images = SLIDES.map((s, i) => (i === 0 ? school.heroImage || s.image : s.image));

  const goTo = useCallback(
    (next) => {
      const n = (next + total) % total;
      if (n === current) return;
      setPrev(current);
      setCurrent(n);
      setTick((t) => t + 1);
    },
    [current, total]
  );

  // Autoplay (restarts whenever the slide changes or hover ends)
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => goTo(current + 1), DURATION);
    return () => clearTimeout(id);
  }, [current, paused, tick, goTo]);

  const slide = SLIDES[current];
  const bar = (key) => (
    <span
      key={key}
      className="hs-anim absolute inset-y-0 left-0 w-full origin-left"
      style={{
        background: ACCENT,
        animation: `hs-bar ${DURATION}ms linear forwards`,
        animationPlayState: paused ? "paused" : "running",
      }}
    />
  );

  return (
    <section
      id="home"
      aria-label={`${schoolName} welcome`}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-20"
      style={{ background: DARK }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setTick((t) => t + 1);
      }}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
        setTouchX(null);
      }}
    >
      <style>{`
        @keyframes hs-reveal{from{clip-path:inset(0 0 0 100%)}to{clip-path:inset(0 0 0 0)}}
        @keyframes hs-zoom{from{transform:scale(1.18)}to{transform:scale(1)}}
        @keyframes hs-up{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
        @keyframes hs-bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes hs-line{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        .hs-reveal{animation:hs-reveal 1.1s cubic-bezier(.77,0,.18,1) both}
        .hs-zoom{animation:hs-zoom 8s ease-out both}
        .hs-up{opacity:0;animation:hs-up .8s cubic-bezier(.22,1,.36,1) forwards}
        @media (prefers-reduced-motion:reduce){.hs-anim,.hs-reveal,.hs-zoom,.hs-up{animation:none!important;opacity:1!important;clip-path:none!important}}
      `}</style>

      {/* Slides */}
      <div className="absolute inset-x-0 top-20 h-[240px] sm:h-[340px] md:inset-0 md:top-0 md:h-auto">
        {SLIDES.map((s, i) => {
          const active = i === current;
          const leaving = i === prev;
          return (
            <div
              key={s.image}
              aria-hidden={!active}
              className={`absolute inset-0 ${
                active ? "hs-reveal z-20" : leaving ? "z-10" : "invisible z-0"
              }`}
            >
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${MID}, ${DARK})` }}
              />
              <img
                src={images[i]}
                alt={s.thumb}
                onError={(e) => (e.currentTarget.style.display = "none")}
                className={`h-full w-full object-cover ${active ? "hs-zoom" : ""}`}
              />
            </div>
          );
        })}
        {/* Readability overlays */}
        <div
          className="absolute inset-0 z-20 hidden md:block"
          style={{
            background: `linear-gradient(to right, ${DARK}, ${DARK}c0 45%, ${DARK}1a)`,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 z-20 hidden h-1/2 md:block"
          style={{ background: `linear-gradient(to top, ${DARK}, transparent)` }}
        />
        <div
          className="absolute inset-x-0 bottom-0 z-20 h-20 md:hidden"
          style={{ background: `linear-gradient(to top, ${DARK}, transparent)` }}
        />
        <div
          className="absolute inset-0 z-20 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
      </div>

      {/* Content */}
      <div className="h-[216px] shrink-0 sm:h-[316px] md:hidden" />
      <div className="relative z-30 mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pb-8 pt-2 md:px-8 md:py-12">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_300px]">
          <div key={current} className="max-w-2xl">
            <div className="hs-up flex flex-wrap items-center gap-3" style={{ animationDelay: "0.35s" }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50 ring-1 ring-white/20 backdrop-blur md:gap-2 md:px-4 md:py-2 md:text-sm">
                <span className="h-1.5 w-1.5 rounded-full md:h-2 md:w-2" style={{ background: ACCENT }} />
                {slide.tag}
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur md:gap-2 md:px-3.5 md:py-2 md:text-sm"
                style={{
                  color: GOLD,
                  background: `${GOLD}1a`,
                  boxShadow: `inset 0 0 0 1px ${GOLD}40`,
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                    style={{ background: GOLD }}
                  />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: GOLD }} />
                </span>
                <Eye size={15} /> {visitorsValue} visitors
              </span>
            </div>

            <h1 className={`${H} mt-4 text-[26px] font-black leading-[1.15] text-white sm:text-4xl md:mt-6 md:text-5xl lg:text-6xl`}>
              <span className="hs-up block" style={{ animationDelay: "0.5s" }}>
                {slide.line1}
              </span>
              <span className="hs-up block" style={{ animationDelay: "0.65s", color: ACCENT }}>
                {slide.line2}
              </span>
            </h1>

            <span
              className="hs-anim mt-4 block h-1 w-14 origin-left rounded-full md:mt-6 md:w-20"
              style={{ background: GOLD, animation: "hs-line .9s .8s cubic-bezier(.22,1,.36,1) both" }}
            />

            <p
              className="hs-up mt-4 line-clamp-3 max-w-xl text-[13px] leading-6 text-emerald-50/90 sm:text-sm md:mt-6 md:line-clamp-none md:text-lg md:leading-8"
              style={{ animationDelay: "0.85s" }}
            >
              {slide.text}
            </p>

            <div className="hs-up mt-5 flex gap-2.5 md:mt-8 md:gap-3" style={{ animationDelay: "1s" }}>
              <Link
                href={slide.cta.href}
                className="group inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-3 text-[13px] font-bold text-white shadow-lg transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex-none sm:px-6 md:gap-2 md:rounded-xl md:px-7 md:py-4 md:text-base"
                style={{ background: ACCENT, boxShadow: `0 10px 25px -8px ${ACCENT}99` }}
              >
                <span className="truncate">{slide.cta.label}</span>
                <ArrowRight size={16} className="shrink-0 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/homework"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-3 text-[13px] font-bold text-white ring-1 ring-white/35 backdrop-blur transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex-none sm:px-6 md:gap-2 md:rounded-xl md:px-7 md:py-4 md:text-base"
              >
                <BookOpen size={16} className="shrink-0" /> <span className="truncate">Homework</span>
              </Link>
            </div>
          </div>

          {/* Thumbnail selector (large screens) */}
          <div className="hidden flex-col gap-3 lg:flex">
            {SLIDES.map((s, i) => {
              const active = i === current;
              return (
                <button
                  key={s.thumb}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}: ${s.thumb}`}
                  className={`group relative h-24 overflow-hidden rounded-2xl text-left transition ${
                    active ? "ring-2" : "opacity-70 ring-1 ring-white/20 hover:opacity-100"
                  }`}
                  style={active ? { boxShadow: `0 0 0 2px ${ACCENT}` } : undefined}
                >
                  <img
                    src={images[i]}
                    alt=""
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    style={{ background: MID }}
                  />
                  <span
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to right, ${DARK}e6, ${DARK}33)` }}
                  />
                  <span className="relative flex h-full items-center gap-4 px-4">
                    <span
                      className={`${H} text-2xl font-black`}
                      style={{ color: active ? ACCENT : "rgba(255,255,255,0.6)" }}
                    >
                      0{i + 1}
                    </span>
                    <span className="text-sm font-semibold text-white">{s.thumb}</span>
                  </span>
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-white/20">
                      {bar(`t-${current}-${tick}`)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom bar: controls + stats */}
      <div
        className="relative z-30 border-t border-white/10 backdrop-blur-md"
        style={{ background: `${DARK}b3` }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:gap-5 md:px-8 md:py-5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              aria-label="Previous slide"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white hover:text-[#0B2A21]"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white hover:text-[#0B2A21]"
            >
              <ChevronRight size={20} />
            </button>
            <p className={`${H} text-sm font-bold text-white`}>
              0{current + 1} <span className="text-white/40">/ 0{total}</span>
            </p>
            <div className="flex items-center gap-2 lg:hidden">
              {SLIDES.map((s, i) => (
                <button
                  key={s.thumb}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`relative h-1.5 overflow-hidden rounded-full bg-white/30 transition-all ${
                    i === current ? "w-12" : "w-6"
                  }`}
                >
                  {i === current && bar(`d-${current}-${tick}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/15 md:min-w-[420px]">
            {[
              [`${yearsOfService}+`, "Years of Excellence"],
              [studentsValue, "Students"],
              [teachersValue, "Teachers"],
            ].map(([v, l], i) => (
              <div key={l} className={i ? "pl-4 sm:pl-6" : "pr-4"}>
                <p className={`${H} text-xl font-black text-white sm:text-2xl`}>{v}</p>
                <p className="text-[11px] text-emerald-100/75 sm:text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}