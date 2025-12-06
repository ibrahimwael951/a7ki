import { Button } from "@/components/ui/button";
import SimpleTitle from "@/components/ui/SimpleTitle";
import React from "react";

export default function Page() {
  return (
    <main className="max-w-3xl! mx-auto space-y-16">
      <section className="mt-20 py-16">
        <SimpleTitle title="Legal" />
        <h1>Privacy & Policy</h1>
        <p>Updated - Sep 2025</p>
      </section>
      <section>
        <p className=" md:text-lg! font-semibold">
          A7KI is an anonymous platform for people to share bad moments. We
          collect minimal data and only to make the app work: a device
          fingerprint for basic authentication/anti-abuse, and optionally your
          email if you ask for newsLatter. We anonymize and delete identifying
          data automatically — messages remain but we remove anything that can
          identify you.
        </p>
      </section>
      <section>
        <h3>What we collect ?</h3>
        <ul className="text-lg leading-7 text-foreground/70 list-inside list-disc">
          <li>Device fingerprint</li>
          <li>
            <span className="text-primary dark:text-primary-foreground font-semibold">
              Optional
            </span>{" "}
            email address
          </li>
          <li>Message content</li>
          <li>Usage & diagnostics</li>
        </ul>
      </section>
      <section>
        <h3>How we use your data ?</h3>
        <ul className="text-lg leading-7 text-foreground/70 list-inside list-disc">
          <li>Authentication & abuse prevention</li>
          <li>NewsLatter</li>
          <li>Service operation & improvement</li>
          <li>Legal reasons</li>
        </ul>
      </section>
      <section>
        <h3>Automatic anonymization & deletion </h3>
        <ul className="text-lg leading-7 text-foreground/70 list-inside list-disc">
          <li>
            Within 30 days of posting (or sooner if your post is removed), we
            remove all identifying metadata tied to that message
          </li>
          <li>
            If you provided an email, we keep it only as long as needed for the
            newsLatter service or until you request deletion
          </li>
          <li>
            Full deletion requests: You can request full deletion of your
            message and any related data earlier — contact us and we will honor
            it within a reasonable time frame
          </li>
        </ul>
      </section>
      <section>
        <h3>Cookies & tracking</h3>
        <p className=" md:text-lg! font-semibold">
          We do not use tracking for advertising. Small technical cookies or
          local storage may be used for UI preferences. The primary persistent
          identifier is the hashed fingerprint (not a cookie).
        </p>
      </section>
      <section>
        <h3>Security</h3>
        <p className=" md:text-lg! font-semibold">
          We use standard security measures (HTTPS, hashed storage for
          identifiers, limited access controls). No system is perfect: we
          protect your data responsibly and will notify you if we discover a
          data breach affecting personal data.
        </p>
      </section>
      <section>
        <h3>Contact</h3>
        <Button link={"/contact"}>Contact Page</Button>
      </section>
    </main>
  );
}
