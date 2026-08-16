"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  phase: number;
};

type ShootingStar = {
  startedAt: number;
  duration: number;
  x: number;
  y: number;
  travel: number;
  tail: number;
};

const HOVER_RADIUS = 145;

export default function DynamicSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const currentCanvas = canvasRef.current;
    const currentContext = currentCanvas?.getContext("2d");
    if (!currentCanvas || !currentContext) return;

    // Preserve the non-null narrowing inside animation and event callbacks.
    const canvas = currentCanvas;
    const context = currentContext;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000, active: false };
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let shootingStar: ShootingStar | null = null;
    let animationFrame = 0;
    let shootingStarTimer = 0;

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const starCount = Math.max(58, Math.min(220, Math.round((width * height) / 9000)));
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: height * (0.025 + Math.random() * 0.7),
        radius: 0.45 + Math.random() * 1.1,
        opacity: 0.18 + Math.random() * 0.48,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height;
    }

    function handlePointerLeave() {
      pointer.active = false;
    }

    function scheduleShootingStar(first = false) {
      window.clearTimeout(shootingStarTimer);
      if (reducedMotion.matches) return;

      // The first one arrives sooner so the interaction can be discovered.
      // Later streaks remain intentionally rare.
      const delay = first
        ? 14_000 + Math.random() * 16_000
        : 50_000 + Math.random() * 70_000;

      shootingStarTimer = window.setTimeout(() => {
        shootingStar = {
          startedAt: performance.now(),
          duration: 850 + Math.random() * 450,
          x: width * (0.08 + Math.random() * 0.54),
          y: height * (0.07 + Math.random() * 0.26),
          travel: 180 + Math.random() * 190,
          tail: 80 + Math.random() * 75,
        };
        scheduleShootingStar();
      }, delay);
    }

    function draw(timestamp: number) {
      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        const distance = pointer.active
          ? Math.hypot(star.x - pointer.x, star.y - pointer.y)
          : HOVER_RADIUS;
        const proximity = Math.max(0, 1 - distance / HOVER_RADIUS);
        const twinkle = reducedMotion.matches
          ? 0
          : Math.sin(timestamp * 0.0007 + star.phase) * 0.055;
        const opacity = Math.min(1, star.opacity + twinkle + proximity * 0.82);
        const radius = star.radius * (1 + proximity * 1.25);

        context.beginPath();
        context.fillStyle = `rgba(218, 234, 255, ${opacity})`;
        context.shadowColor = `rgba(116, 189, 255, ${proximity})`;
        context.shadowBlur = proximity * 14;
        context.arc(star.x, star.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      context.shadowBlur = 0;
      drawShootingStar(timestamp);
      animationFrame = window.requestAnimationFrame(draw);
    }

    function drawShootingStar(timestamp: number) {
      if (!shootingStar) return;
      const progress = (timestamp - shootingStar.startedAt) / shootingStar.duration;
      if (progress >= 1) {
        shootingStar = null;
        return;
      }

      const eased = 1 - Math.pow(1 - progress, 3);
      const angle = Math.PI / 5.4;
      const headX = shootingStar.x + Math.cos(angle) * shootingStar.travel * eased;
      const headY = shootingStar.y + Math.sin(angle) * shootingStar.travel * eased;
      const fade = Math.sin(progress * Math.PI);
      const tailX = headX - Math.cos(angle) * shootingStar.tail;
      const tailY = headY - Math.sin(angle) * shootingStar.tail;
      const gradient = context.createLinearGradient(tailX, tailY, headX, headY);
      gradient.addColorStop(0, "rgba(176, 216, 255, 0)");
      gradient.addColorStop(0.78, `rgba(200, 229, 255, ${fade * 0.55})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${fade})`);

      context.beginPath();
      context.moveTo(tailX, tailY);
      context.lineTo(headX, headY);
      context.strokeStyle = gradient;
      context.lineWidth = 1.4;
      context.shadowColor = "rgba(135, 199, 255, .85)";
      context.shadowBlur = 8;
      context.stroke();
      context.shadowBlur = 0;
    }

    function handleMotionPreference() {
      if (reducedMotion.matches) {
        shootingStar = null;
        window.clearTimeout(shootingStarTimer);
      } else {
        scheduleShootingStar(true);
      }
    }

    resize();
    scheduleShootingStar(true);
    animationFrame = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(shootingStarTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return <canvas ref={canvasRef} className="dynamicSky" aria-hidden="true" />;
}
