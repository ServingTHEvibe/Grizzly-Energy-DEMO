import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface ParticleConfig {
  icon: string;
  x: number;
  y: number;
  size: number;
  floatAmp: number;
  floatDur: number;
  rotateDur: number;
  delay: number;
  rotateMax: number;
  opacity: number;
}

interface Props {
  flavorIdx: number;
  emojis: string[]; // kept for compat but ignored — we use SVG icons now
}

// Wild on-brand SVG icons
const WILD_ICONS = [
  // Lightning bolt
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.5 13.5H11L9 22L19.5 10H13L13 2Z"/></svg>`,
  // Paw print
  `<svg viewBox="0 0 100 100" fill="currentColor"><ellipse cx="20" cy="28" rx="9" ry="12"/><ellipse cx="42" cy="18" rx="9" ry="12"/><ellipse cx="64" cy="20" rx="9" ry="12"/><ellipse cx="82" cy="32" rx="8" ry="11"/><path d="M50 40 C28 40 15 58 18 72 C22 88 38 92 50 90 C62 92 78 88 82 72 C85 58 72 40 50 40Z"/></svg>`,
  // Flame
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 8 7 8 11C8 13.21 9.79 15 12 15C14.21 15 16 13.21 16 11C16 9 15 7.5 13.5 6C13.5 6 14 9 12 10C10 9 10.5 6 12 2ZM6 17C6 20.31 8.69 23 12 23C15.31 23 18 20.31 18 17C18 14.5 16.5 12.5 14.5 11.5C14.8 12.2 15 13 15 14C15 15.66 13.66 17 12 17C10.34 17 9 15.66 9 14C9 13 9.2 12.2 9.5 11.5C7.5 12.5 6 14.5 6 17Z"/></svg>`,
  // Claw / slash marks
  `<svg viewBox="0 0 100 100" fill="currentColor"><rect x="18" y="5" width="12" height="60" rx="6" transform="rotate(-15 24 35)"/><rect x="42" y="5" width="12" height="65" rx="6" transform="rotate(-5 48 37)"/><rect x="66" y="5" width="12" height="60" rx="6" transform="rotate(10 72 35)"/></svg>`,
  // Bear head silhouette
  `<svg viewBox="0 0 100 100" fill="currentColor"><circle cx="22" cy="25" r="16"/><circle cx="78" cy="25" r="16"/><ellipse cx="50" cy="58" rx="34" ry="36"/><circle cx="36" cy="48" r="5" fill="white"/><circle cx="64" cy="48" r="5" fill="white"/><ellipse cx="50" cy="66" rx="12" ry="8"/></svg>`,
  // Star burst / impact
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.5 8.5L23 6L17 13L23 18L14.5 15.5L12 24L9.5 15.5L1 18L7 13L1 6L9.5 8.5Z"/></svg>`,
  // Energy drop
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 5 10 5 15C5 18.87 8.13 22 12 22C15.87 22 19 18.87 19 15C19 10 12 2 12 2Z"/></svg>`,
];

// Fixed positions — won't shuffle on re-render
const PARTICLE_SLOTS = [
  { x: 8,  y: 18, size: 52, floatAmp: 24, floatDur: 3.4, rotateDur: 9,  delay: 0,   rotateMax: 18, opacity: 0.18, iconIdx: 1 }, // paw
  { x: 78, y: 10, size: 44, floatAmp: 32, floatDur: 3.8, rotateDur: 11, delay: 0.3, rotateMax: 25, opacity: 0.22, iconIdx: 0 }, // bolt
  { x: 88, y: 55, size: 36, floatAmp: 20, floatDur: 2.9, rotateDur: 7,  delay: 0.7, rotateMax: 14, opacity: 0.15, iconIdx: 2 }, // flame
  { x: 5,  y: 65, size: 40, floatAmp: 18, floatDur: 3.6, rotateDur: 10, delay: 0.2, rotateMax: 22, opacity: 0.14, iconIdx: 3 }, // claw
  { x: 62, y: 75, size: 32, floatAmp: 22, floatDur: 4.2, rotateDur: 12, delay: 1.1, rotateMax: 20, opacity: 0.12, iconIdx: 1 }, // paw
  { x: 30, y: 8,  size: 38, floatAmp: 28, floatDur: 3.0, rotateDur: 8,  delay: 0.5, rotateMax: 16, opacity: 0.16, iconIdx: 0 }, // bolt
  { x: 92, y: 28, size: 28, floatAmp: 16, floatDur: 4.6, rotateDur: 13, delay: 1.5, rotateMax: 30, opacity: 0.13, iconIdx: 5 }, // starburst
  { x: 50, y: 6,  size: 34, floatAmp: 26, floatDur: 3.2, rotateDur: 9,  delay: 0.9, rotateMax: 20, opacity: 0.10, iconIdx: 4 }, // bear
  { x: 18, y: 85, size: 30, floatAmp: 20, floatDur: 5.0, rotateDur: 14, delay: 1.8, rotateMax: 28, opacity: 0.11, iconIdx: 2 }, // flame
];

export default function GsapParticles({ flavorIdx }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  const killAll = () => {
    tweensRef.current.forEach((t) => t.kill());
    tweensRef.current = [];
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;
      killAll();

      const particles = containerRef.current.querySelectorAll<HTMLElement>(".gsap-particle");

      particles.forEach((el, i) => {
        const slot = PARTICLE_SLOTS[i];
        if (!slot) return;

        gsap.set(el, { y: 40, opacity: 0, scale: 0.3, rotation: -25 });

        tweensRef.current.push(
          gsap.to(el, {
            y: 0, opacity: slot.opacity, scale: 1, rotation: 0,
            duration: 0.9, delay: slot.delay, ease: "back.out(1.6)",
          })
        );

        tweensRef.current.push(
          gsap.to(el, {
            y: `-=${slot.floatAmp}`, repeat: -1, yoyo: true,
            duration: slot.floatDur, delay: slot.delay + 0.6, ease: "sine.inOut",
          })
        );

        tweensRef.current.push(
          gsap.to(el, {
            rotation: slot.rotateMax, repeat: -1, yoyo: true,
            duration: slot.rotateDur, delay: slot.delay + 0.4, ease: "sine.inOut",
          })
        );

        tweensRef.current.push(
          gsap.to(el, {
            scale: 1.1, repeat: -1, yoyo: true,
            duration: slot.floatDur * 1.4, delay: slot.delay + 1, ease: "sine.inOut",
          })
        );
      });

      return killAll;
    },
    { scope: containerRef, dependencies: [flavorIdx] }
  );

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLE_SLOTS.map((slot, i) => (
        <div
          key={`${flavorIdx}-${i}`}
          className="gsap-particle absolute"
          style={{
            left: `${slot.x}%`,
            top: `${slot.y}%`,
            width: slot.size,
            height: slot.size,
            opacity: 0,
            color: "white",
            willChange: "transform, opacity",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
          }}
          dangerouslySetInnerHTML={{ __html: WILD_ICONS[slot.iconIdx] }}
        />
      ))}
    </div>
  );
}
