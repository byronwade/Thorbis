import { useEffect, useRef } from "react";

export function useHoverGradient() {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const PERCENTAGE_MULTIPLIER = 100;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * PERCENTAGE_MULTIPLIER;
      const y = ((e.clientY - rect.top) / rect.height) * PERCENTAGE_MULTIPLIER;

      element.style.setProperty("--mouse-x", `${x}%`);
      element.style.setProperty("--mouse-y", `${y}%`);
    };

    const handleMouseLeave = () => {
      element.style.removeProperty("--mouse-x");
      element.style.removeProperty("--mouse-y");
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return elementRef;
}
