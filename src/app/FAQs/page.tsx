"use client";
import FAQ from "@/components/FAQ";
import { useIsMobile } from "@/hooks/IsMobile";
import { useRive } from "@rive-app/react-canvas";

export default function Page() {
  const isMobile = useIsMobile();
  const { RiveComponent } = useRive({
    src: "/Animated_Images/2d_girl.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  return (
    <main className="max-w-full! flex flex-row-reverse justify-center items-center gap-15 mb-20 md:mb-0 h-screen">
      {!isMobile && (
        <section className="w-120 h-160 rounded-2xl overflow-hidden">
          <RiveComponent />
        </section>
      )}  
      <FAQ />
    </main>
  );
}
