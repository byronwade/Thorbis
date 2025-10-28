"use client";

import { useEffect, useState } from "react";

type ClientTimestampProps = {
  date: Date;
  className?: string;
};

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / MS_PER_MINUTE);
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const days = Math.floor(hours / HOURS_PER_DAY);

  if (minutes < MINUTES_PER_HOUR) {
    return `${minutes}m ago`;
  }
  if (hours < HOURS_PER_DAY) {
    return `${hours}h ago`;
  }
  if (days < 7) {
    return `${days}d ago`;
  }
  return date.toLocaleDateString();
}

/**
 * Client-only timestamp component that prevents hydration mismatches
 * by only rendering the timestamp after client-side hydration is complete.
 */
export function ClientTimestamp({ date, className }: ClientTimestampProps) {
  const [timestamp, setTimestamp] = useState<string | null>(null);

  useEffect(() => {
    // Set initial timestamp
    setTimestamp(formatTimestamp(date));

    // Update every minute
    const interval = setInterval(() => {
      setTimestamp(formatTimestamp(date));
    }, MS_PER_MINUTE);

    return () => {
      clearInterval(interval);
    };
  }, [date]);

  // During SSR, show a placeholder
  if (!timestamp) {
    return (
      <span className={className} suppressHydrationWarning>
        ...
      </span>
    );
  }

  return <span className={className}>{timestamp}</span>;
}
