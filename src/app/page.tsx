import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Hero from "@/components/Hero";

export default function page() {
  return (
    <main className="relative">
      <Hero />
      <Features />
      <FAQ />
    </main>
  );
}
