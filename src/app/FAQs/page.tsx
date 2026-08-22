"use client";
import FAQ from "@/components/FAQ";
import { useRive } from "@rive-app/react-canvas";

export default function Page() {
  const { RiveComponent } = useRive({
    src: "/Animated_Images/2d_girl.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  return (
    <main className="max-w-full! flex flex-row-reverse justify-center items-center gap-15 h-screen">
      <section className="w-120 h-160 rounded-2xl overflow-hidden hidden lg:inline">
        <RiveComponent />
      </section>
      <FAQ />
    </main>
  );
}
