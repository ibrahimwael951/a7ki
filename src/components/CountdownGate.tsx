 "use client";

import { useEffect, useState } from "react";

// 🔒 FIXED target date — set this ONCE to your real launch date/time.
// Don't calculate this as "now + 10 days" inside the component,
// or it recalculates on every visit and never actually unlocks.
// ISO format: "YYYY-MM-DDTHH:mm:ss" (24h time, your local timezone)
const TARGET_DATE = new Date("2026-08-25T00:00:00");

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(): TimeLeft | null {
  const now = new Date().getTime();
  const target = TARGET_DATE.getTime();
  const diff = target - now;

  if (diff <= 0) return null; // date has passed -> unlock

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownGate({
  children,
}: {
  children: React.ReactNode;
}) {
  // Start as `undefined` so server and client render the same thing
  // on first paint (avoids hydration mismatch), then swap in real value.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | undefined>(
    undefined
  );

  useEffect(() => {
    // Check immediately on mount
    setTimeLeft(getTimeLeft());

    // Then check every second against the REAL clock (Date.now()),
    // not a stored countdown number that could drift or be faked.
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Still checking on first client render -> render nothing (or a skeleton)
  if (timeLeft === undefined) {
    return null;
  }

  // Date has passed -> show the real content
  if (timeLeft === null) {
    return <>{children}</>;
  }

  // Still counting down -> show the countdown
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 text-center">
      <p className="text-2xl uppercase tracking text-primary! dark:text-primary-foreground!">
        Unlocking in
      </p>
      <div className="flex items-center gap-4 md:gap-8">
        <TimeBlock value={timeLeft.days} label="Days" />
        <Separator />
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <Separator />
        <TimeBlock value={timeLeft.minutes} label="Minutes" />
        <Separator />
        <TimeBlock value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-6xl font-bold tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs md:text-sm text-muted-foreground mt-1">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span className="text-3xl md:text-5xl font-bold text-muted-foreground/40">
      :
    </span>
  );
}