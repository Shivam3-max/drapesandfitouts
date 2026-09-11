import type { Metadata } from "next";
import { Section, Note } from "@/components/ui";
import { DataControls } from "@/components/data-controls";

export const metadata: Metadata = {
  title: "Privacy & your data",
  description:
    "What we collect through the Space Assessment, why, how long we keep it, and how to withdraw your consent. Written under the UAE Personal Data Protection Law.",
};

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-rule bg-stone">
        <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-16">
          <p className="eyebrow">Privacy</p>
          <h1 className="display mt-5 max-w-[20ch] text-[clamp(30px,4.8vw,52px)]">
            Your space is personal. We treat it that way.
          </h1>
          <p className="mt-6 max-w-[62ch] text-[18px] leading-relaxed text-ink-2">
            The Space Assessment asks for photographs of your home or workplace. That is personal
            data under the UAE Personal Data Protection Law, and this page says plainly what happens
            to it.
          </p>
        </div>
      </header>

      <Section tone="paper">
        <div className="max-w-[70ch] space-y-10">
          <Block title="Who is responsible">
            <p>
              Drapes &amp; Fitouts, Office B40-003, Block B, SRTIP, Sharjah, United Arab Emirates.
              Questions about your data: <a className="brass-link text-ink" href="mailto:info@drapesandfitouts.ae">info@drapesandfitouts.ae</a>.
            </p>
          </Block>

          <Block title="What we collect, and why">
            <ul className="space-y-3">
              <li>
                <strong>Your assessment answers</strong> — room type, orientation, glazing, problems,
                approximate sizes. Used to produce your recommendation.
              </li>
              <li>
                <strong>Photographs you choose to add</strong> — used to understand the space and to
                prepare a proposal. While you are using this site they are downscaled and held in your
                own browser; they reach us only when you send them to us.
              </li>
              <li>
                <strong>Your contact details</strong> — name, WhatsApp number, email if you give one.
                Used to send your result and to arrange a visit.
              </li>
              <li>
                <strong>Project records</strong> — if you become a customer: measurements, selections,
                installation photographs, warranty and service history. Kept so we can honour the
                warranty and service what we installed.
              </li>
            </ul>
          </Block>

          <Block title="What we do not do">
            <ul className="space-y-3">
              <li>We do not sell your data, and we do not share it with advertisers.</li>
              <li>We do not use photographs of your property in marketing without asking you separately, in writing, for that specific purpose.</li>
              <li>We do not bundle your consent — agreeing to be contacted about your assessment is not agreement to receive marketing.</li>
            </ul>
          </Block>

          <Block title="How long we keep it">
            <ul className="space-y-3">
              <li><strong>Assessments that do not become enquiries</strong> — 12 months, then deleted.</li>
              <li><strong>Enquiries that do not convert</strong> — 24 months, then deleted.</li>
              <li><strong>Customer project records</strong> — for the life of the warranty plus the period UAE law requires us to keep commercial records.</li>
            </ul>
          </Block>

          <Block title="Your rights">
            <p>
              You can ask what we hold, ask for it to be corrected or deleted, object to how we use
              it, ask for a copy, and withdraw your consent at any time without penalty. Write to us
              and we will respond within 30 days.
            </p>
          </Block>

          <Block title="Data held in this browser">
            <p>
              Assessments you complete on this site are stored in your own browser so you can come
              back to the result. You can remove them yourself at any time — nothing is sent anywhere
              when you do.
            </p>
            <div className="mt-6">
              <DataControls />
            </div>
          </Block>

          <Note title="Arabic">
            <p>
              An Arabic version of this notice is published alongside the Arabic site. Where the two
              differ, please contact us and we will clarify — we would rather fix a translation than
              rely on a disclaimer.
            </p>
          </Note>
        </div>
      </Section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="h-sec text-[22px]">{title}</h2>
      <div className="mt-4 space-y-3 text-[16.5px] leading-relaxed text-ink-2">{children}</div>
    </section>
  );
}
