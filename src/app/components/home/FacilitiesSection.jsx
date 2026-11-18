"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const H = "font-[family-name:var(--font-head)]";
const wrap = "mx-auto max-w-7xl px-5 md:px-8";
const DURATION = 5200; // ms per facility (desktop autoplay)

/* Every panel gets its own colour (blue, green, purple, orange, pink, teal), repeated if there are more facilities */
const LOOKS = [
  "from-sky-500 via-blue-600 to-blue-950",
  "from-emerald-500 via-green-600 to-emerald-950",
  "from-violet-500 via-purple-600 to-purple-950",
  "from-amber-400 via-orange-500 to-orange-900",
  "from-rose-500 via-pink-600 to-rose-950",
  "from-cyan-500 via-teal-600 to-teal-950",
];

/* facilities = [{ icon: LucideIcon, title, desc }, ...] */
export default function FacilitiesSection({ facilities = [] }) {
  const n = facilities.length;
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* autoplay only on desktop (on mobile the list would jump around) */
  const autoplay = shown && desktop && !reduced && !paused && n > 1;
  useEffect(() => {
    if (!autoplay) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % n), DURATION);
    return () => clearTimeout(id);
  }, [autoplay, active, n]);

  if (!n) return null;

  const go = (i) => setActive((i + n) % n);
  const hoverActivate = (i) => (e) => {
    if (e.pointerType === "mouse" && window.matchMedia("(min-width: 1024px)").matches) setActive(i);
  };

  return (
    <section
      id="facilities"
      style={{ scrollMarginTop: "5rem", background: "linear-gradient(180deg,#07111F 0%,#0E1B30 100%)" }}
      className="relative overflow-hidden py-16 text-white sm:py-20 md:py-28"
    >
      <style>{`
        @keyframes fc-bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes fc-up{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:none}}
        .fc-up{opacity:0;animation:fc-up .9s cubic-bezier(.22,1,.36,1) forwards}
        @media (prefers-reduced-motion:reduce){.fc-up,.fc-bar{animation:none!important;opacity:1!important}}
      `}</style>

      {/* multicolour glows + fine dots */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 right-1/4 h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-[24rem] w-[24rem] rounded-full bg-emerald-500/20 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-1/2 h-[20rem] w-[20rem] rounded-full bg-sky-500/20 blur-[120px]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(rgba(226,232,240,.6) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          WebkitMaskImage: "linear-gradient(180deg,#000,transparent 65%)",
          maskImage: "linear-gradient(180deg,#000,transparent 65%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/50 to-transparent" />

      <div className={`${wrap} relative`}>
        {/* Heading + controls */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2
              className={`${H} bg-gradient-to-b from-white to-sky-200 bg-clip-text text-3xl font-black leading-[1.1] text-transparent sm:text-4xl md:text-5xl lg:text-6xl`}
            >
              Everything students need to grow
            </h2>
            <span aria-hidden="true" className="mt-5 block h-1 w-24 rounded-full bg-gradient-to-r from-sky-300 via-white to-transparent" />
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300/90 sm:text-lg">
              A comfortable, safe and modern environment designed to support learning and student development.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <p className={`${H} mr-1 text-sm font-bold`}>
              0{active + 1} <span className="text-white/50">/ 0{n}</span>
            </p>
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous facility"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25 transition hover:bg-white hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next facility"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25 transition hover:bg-white hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Expanding panels: vertical accordion on mobile, horizontal on desktop */}
        <div
          ref={ref}
          className="mt-10 flex flex-col gap-3 md:mt-14 lg:h-[30rem] lg:flex-row lg:gap-4 xl:h-[34rem]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {facilities.map(({ icon: Icon, title, desc }, i) => {
            const on = i === active;
            return (
              <article
                key={title}
                data-active={on}
                className={`${shown ? "fc-up" : "opacity-0"} group relative overflow-hidden rounded-3xl bg-gradient-to-br ${
                  LOOKS[i % LOOKS.length]
                } shadow-2xl shadow-black/40 ring-1 ring-white/15 transition-[height,flex-grow,filter] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none h-[4.75rem] data-[active=true]:h-[19.5rem] sm:data-[active=true]:h-[18rem] lg:h-auto lg:flex-[1_1_0%] lg:data-[active=true]:h-auto lg:data-[active=true]:flex-[5_1_0%] ${
                  on ? "ring-white/40" : "brightness-[0.8] hover:brightness-100"
                }`}
                style={shown ? { animationDelay: `${i * 90}ms` } : undefined}
                onPointerEnter={hoverActivate(i)}
              >
                {/* full-cover toggle (keeps the Link below clickable via z-index) */}
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={on}
                  aria-label={title}
                  className="absolute inset-0 z-10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                />

                {/* texture + glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.12]"
                  style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
                />
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/25 blur-3xl transition-opacity duration-700 ${
                    on ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* giant icon watermark */}
                <Icon
                  aria-hidden="true"
                  strokeWidth={1}
                  className={`pointer-events-none absolute -bottom-8 -right-8 h-56 w-56 text-white transition duration-700 lg:h-80 lg:w-80 ${
                    on ? "rotate-0 opacity-[0.14]" : "-rotate-12 opacity-0"
                  }`}
                />

                {/* header row */}
                <div className="pointer-events-none relative flex h-[4.75rem] items-center gap-3.5 px-4 lg:absolute lg:inset-x-0 lg:top-0 lg:h-auto lg:flex-col lg:items-start lg:gap-3 lg:p-6">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/40 backdrop-blur transition duration-500 lg:h-12 lg:w-12 ${
                      on ? "scale-105 bg-white text-slate-900" : ""
                    }`}
                  >
                    <Icon size={22} />
                  </span>
                  <span className={`${H} text-sm font-black text-white/70 lg:text-base`}>0{i + 1}</span>
                  <span className={`${H} min-w-0 flex-1 truncate text-base font-black lg:hidden`}>{title}</span>
                </div>

                {/* vertical title when collapsed (desktop) */}
                <span
                  aria-hidden="true"
                  className={`${H} pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 rotate-180 whitespace-nowrap text-xl font-black transition-opacity duration-500 [writing-mode:vertical-rl] lg:block ${
                    on ? "opacity-0" : "opacity-100 delay-200"
                  }`}
                >
                  {title}
                </span>

                {/* expanded body */}
                <div
                  className={`relative px-4 pb-5 transition-opacity duration-500 lg:absolute lg:inset-x-0 lg:bottom-0 lg:px-8 lg:pb-8 ${
                    on ? "opacity-100 delay-300" : "pointer-events-none opacity-0"
                  }`}
                >
                  <h3 className={`${H} hidden text-3xl font-black leading-tight lg:block xl:text-4xl`}>{title}</h3>
                  <p className="mt-1 max-w-md text-[14px] leading-6 text-white/90 lg:mt-3 lg:text-base lg:leading-7">{desc}</p>
                  {on && (
                    <Link
                      href="/gallery"
                      className="pointer-events-auto relative z-20 mt-3 inline-flex items-center gap-2 text-sm font-bold text-white underline decoration-white/60 decoration-2 underline-offset-4 transition hover:decoration-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:mt-5"
                    >
                      See it in the gallery <ArrowRight size={15} />
                    </Link>
                  )}
                </div>

                {/* autoplay progress (desktop) */}
                {on && autoplay && (
                  <span className="pointer-events-none absolute inset-x-6 bottom-4 hidden h-1 overflow-hidden rounded-full bg-white/25 lg:block">
                    <span
                      key={active}
                      className="fc-bar absolute inset-0 origin-left bg-white"
                      style={{ animation: `fc-bar ${DURATION}ms linear forwards` }}
                    />
                  </span>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center md:mt-14">
          <Link
            href="/gallery"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-700 px-7 py-3.5 font-bold text-white shadow-[0_10px_28px_-8px_rgba(56,189,248,0.8)] transition hover:from-sky-400 hover:to-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            See our campus in the gallery
            <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}