import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import Button from "../ui/Button";
import { HERO } from "../../utils/constants";

// Staggered fade-up: each child appears slightly after the previous one.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero() {
  // If the video file is missing or fails, we fall back to the gradient glow.
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background video */}
      {!videoFailed && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO.videoSrc}
          poster={HERO.posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoFailed(true)}
        />
      )}

      {/* Fallback glow, visible when there is no video */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.15),transparent_60%)]" />

      {/* Dark overlay keeps text readable and fades into the next section */}
      <div className="absolute inset-0 bg-gradient-to-b from-darkBg/70 via-darkBg/50 to-darkBg" />

      {/* Centered content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pt-16 text-center"
      >
        <motion.span
          variants={item}
          className="glass-panel mb-6 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-gold-light"
        >
          {HERO.eyebrow}
        </motion.span>

        <motion.h1
          variants={item}
          className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
        >
          {HERO.headline}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-xl text-base text-muted sm:text-lg"
        >
          {HERO.subtext}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button href="#buy-now" className="px-8 py-3.5 text-base">
            Order Cash on Delivery
          </Button>
          <Button href="#features" variant="ghost" className="px-8 py-3.5 text-base">
            See Features
          </Button>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-8 flex items-center gap-2 text-sm text-muted"
        >
          <Star size={16} className="fill-gold text-gold" />
          {HERO.rating}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#buy-now"
        aria-label="Scroll down"
        className="absolute bottom-6 z-10 text-white/60"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        <ChevronDown size={28} />
      </motion.a>
    </section>
  );
}