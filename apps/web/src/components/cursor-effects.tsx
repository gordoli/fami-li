"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// Keep pointer animation outside React renders; particles remove themselves on completion.
export function CursorEffects() {
  const cursor = useRef<HTMLDivElement>(null);
  const aura = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || reducedMotion) return;
    const arrow = cursor.current;
    const smoke = aura.current;
    if (!arrow || !smoke) return;
    document.documentElement.classList.add("custom-pointer");
    let auraX = 0,
      auraY = 0,
      targetX = 0,
      targetY = 0;
    let frame = 0;
    let hasMoved = false;
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!hasMoved) {
        auraX = targetX;
        auraY = targetY;
        hasMoved = true;
      }
      arrow.style.opacity = "1";
      smoke.style.opacity = "1";
      arrow.style.transform = `translate3d(${targetX - 5}px,${targetY - 3}px,0)`;
      const target = event.target;
      arrow.classList.toggle(
        "is-interactive",
        target instanceof Element &&
          Boolean(target.closest("button,a,input,textarea,[role=button]")),
      );
    };
    const animate = () => {
      auraX += (targetX - auraX) * 0.065;
      auraY += (targetY - auraY) * 0.065;
      smoke.style.transform = `translate3d(${auraX - 130}px,${auraY - 130}px,0)`;
      frame = requestAnimationFrame(animate);
    };
    const particles = new Set<HTMLElement>();
    const click = (event: MouseEvent) => {
      for (let index = 0; index < 9; index++) {
        const particle = document.createElement("i");
        particle.className = "cursor-particle";
        particle.style.left = `${event.clientX}px`;
        particle.style.top = `${event.clientY}px`;
        const angle = (index / 9) * Math.PI * 2;
        const distance = 24 + Math.random() * 30;
        document.body.append(particle);
        particles.add(particle);
        const animation = particle.animate(
          [
            { transform: "translate(-50%,-50%) scale(1)", opacity: 0.8 },
            {
              transform: `translate(${Math.cos(angle) * distance}px,${Math.sin(angle) * distance}px) scale(0)`,
              opacity: 0,
            },
          ],
          {
            duration: 480 + Math.random() * 180,
            easing: "cubic-bezier(.2,.7,.2,1)",
          },
        );
        animation.onfinish = () => {
          particle.remove();
          particles.delete(particle);
        };
      }
    };
    const leave = () => {
      arrow.style.opacity = "0";
      smoke.style.opacity = "0";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("click", click);
    document.addEventListener("mouseleave", leave);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("click", click);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("custom-pointer");
      particles.forEach((particle) => particle.remove());
    };
  }, [reducedMotion]);
  return (
    <>
      <div ref={aura} className="cursor-aura" aria-hidden="true" />
      <div ref={cursor} className="cursor-arrow" aria-hidden="true">
        <svg width="29" height="34" viewBox="0 0 29 34">
          <defs>
            <linearGradient id="cursor-shade" x1="0" x2="1" y1="0" y2="1">
              <stop stopColor="#39333f" />
              <stop offset="1" stopColor="#08060d" />
            </linearGradient>
          </defs>
          <path
            d="M5 3c-1.1-.9-2.5-.2-2.5 1.2v25c0 1.5 1.7 2.1 2.7 1l6.5-7.1 9.6-.3c1.5 0 2.1-1.7 1-2.7Z"
            fill="url(#cursor-shade)"
            stroke="white"
            strokeWidth="2.3"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
