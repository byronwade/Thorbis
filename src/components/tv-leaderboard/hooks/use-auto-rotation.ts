import { useCallback, useEffect, useRef, useState } from "react";
import type { SlideSettings } from "../slide-types";

type UseAutoRotationProps = {
  slideCount: number;
  currentSlide: number;
  onSlideChange: (index: number) => void;
  settings: SlideSettings;
  isEditMode: boolean;
};

export function useAutoRotation({
  slideCount,
  currentSlide,
  onSlideChange,
  settings,
  isEditMode,
}: UseAutoRotationProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const startRotation = useCallback(() => {
    if (!settings.autoRotate || slideCount <= 1 || isEditMode) {
      return;
    }

    clearTimers();
    setProgress(0);

    // Progress animation (60fps for smooth animation)
    const progressStep = 100 / (settings.rotationInterval / 16.67); // ~60fps
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressStep;
        return next >= 100 ? 100 : next;
      });
    }, 16.67);

    // Slide transition timer
    timerRef.current = setTimeout(() => {
      const nextSlide = (currentSlide + 1) % slideCount;
      onSlideChange(nextSlide);
    }, settings.rotationInterval);
  }, [
    settings,
    slideCount,
    currentSlide,
    onSlideChange,
    isEditMode,
    clearTimers,
  ]);

  const pauseRotation = useCallback(() => {
    if (!settings.pauseOnInteraction) {
      return;
    }

    setIsPaused(true);
    clearTimers();

    // Resume after inactivity timeout
    inactivityTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, settings.inactivityTimeout);
  }, [settings, clearTimers]);

  const resumeRotation = useCallback(() => {
    setIsPaused(false);
    startRotation();
  }, [startRotation]);

  // Start/restart rotation when conditions change
  useEffect(() => {
    if (!(isPaused || isEditMode) && settings.autoRotate && slideCount > 1) {
      startRotation();
    }

    return () => {
      clearTimers();
    };
  }, [
    isPaused,
    isEditMode,
    settings.autoRotate,
    slideCount,
    startRotation,
    clearTimers,
  ]);

  // Handle user interaction
  const handleInteraction = useCallback(() => {
    if (settings.pauseOnInteraction && !isEditMode) {
      pauseRotation();
    }
  }, [settings.pauseOnInteraction, isEditMode, pauseRotation]);

  return {
    isPaused,
    progress,
    pauseRotation,
    resumeRotation,
    handleInteraction,
  };
}
