"use client";

import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  createElement,
  useEffect,
  useRef,
  useState,
} from "react";

type ScrollRevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "left" | "right" | "scale";
} & Record<string, unknown>;

export default function ScrollReveal({
  as = "div",
  children,
  className = "",
  delay = 0,
  variant = "up",
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      ...rest,
      className: `scroll-reveal scroll-reveal--${variant} ${isVisible ? "is-visible" : ""} ${className}`.trim(),
      style: {
        "--reveal-delay": `${delay}ms`,
      } as CSSProperties,
    },
    children
  );
}
