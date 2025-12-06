import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import How_Its_Works from "@/components/How_Its_Works";
import Ready from "@/components/Ready";

export default function page() {
  return (
    <main className="relative">
      <Hero />
      <Features />
      <How_Its_Works />
      <FAQ />
      <Ready />
    </main>
  );
}
