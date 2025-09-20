"use client";

import { useState, useEffect } from "react";

interface ScrollPosition {
  x: number;
  y: number;
}

export function useScrollPosition(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    // Set initial position
    updatePosition();

    // Add event listener
    window.addEventListener("scroll", updatePosition);

    // Cleanup
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
}

export default useScrollPosition;
