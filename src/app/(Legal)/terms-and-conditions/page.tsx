import SimpleTitle from "@/components/ui/SimpleTitle";
import React from "react";

export default function Page() {
  return (
    <main className="max-w-3xl! mx-auto space-y-16">
      <section className="mt-20 py-16">
        <SimpleTitle title="Legal" />
        <h1>Terms of Service</h1>
        <p>Updated - Sep 2025</p>
      </section>
      <section>
        <h3>Acceptance of terms</h3>
        <p className=" md:text-lg! font-semibold">
          By using A7KI (the website and services at A7Ki.vercel.app), you agree
          to these Terms. If you don’t agree, don’t use the website
        </p>
      </section>
      <section>
        <h3>What A7KI is ?</h3>
        <p className=" md:text-lg! font-semibold">
          A7KI is an anonymous platform where users post personal stories and
          moments. The service provides a place to share and read user-submitted
          content.{" "}
        </p>
      </section>
      <section>
        <h3>Posting rules & content policy</h3>
        <ul className="text-lg leading-7 text-foreground/70 list-inside list-disc">
          <li>You may post your own stories and content. Keep it truthful.</li>
          <li>
            Prohibited content: illegal activity (planning/committing crimes),
            threats, targeted harassment, hate speech
          </li>
          <li>
            Allowed but limited: descriptions of personal struggles, feelings,
            mistakes — allowed but may be moderated if they violate other rules.
          </li>
          <li>
            We reserve the right to remove content that violates these rules or
            our policies.
          </li>
        </ul>
      </section>
    </main>
  );
}
