import Link from "next/link"

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16 md:px-8 md:py-24">
      <section className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div className="flex flex-col gap-6">
          <span className="inline-flex max-w-fit items-center rounded-full border border-border/80 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
            Astrology, Numerology & AI
          </span>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl md:leading-tight">
            Discover your cosmic blueprint with Zynra.
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Zynra brings together precise astrology, Pythagorean numerology, and
            an adaptive AI guide to help you understand patterns in your life,
            relationships, and purpose.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/onboarding"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Begin your chart
            </Link>
            <Link
              href="#features"
              className="inline-flex h-10 items-center justify-center rounded-md border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Explore features
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-10 text-sm text-muted-foreground shadow-lg shadow-primary/5">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Coming Soon
          </p>
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            Daily Alignment Report
          </h2>
          <ul className="space-y-3">
            <li className="grid grid-cols-[auto_1fr] gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Sun
              </span>
              <span className="text-foreground/90">
                Focus on creative projects—Leo energy amplifies your voice today.
              </span>
            </li>
            <li className="grid grid-cols-[auto_1fr] gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Numerology
              </span>
              <span className="text-foreground/90">
                Personal Year 3: express, experiment, and connect intentionally.
              </span>
            </li>
            <li className="grid grid-cols-[auto_1fr] gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                AI Insight
              </span>
              <span className="text-foreground/90">
                Prompt: &ldquo;How can I align my schedule with today&apos;s energy?&rdquo;
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section id="features" className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Precise astrology engine",
            description:
              "Compute natal placements, houses, and aspects using astronomy-grade calculations backed by the Astronomia library.",
          },
          {
            title: "Guided numerology insights",
            description:
              "Reveal life path, expression, and soul urge numbers with modern interpretations rooted in Pythagorean tradition.",
          },
          {
            title: "Conversational AI mentor",
            description:
              "Ask questions about your chart and receive contextual guidance synthesized from your cosmic fingerprint.",
          },
        ].map((feature) => (
          <article
            key={feature.title}
            className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-6 shadow-sm shadow-primary/5"
          >
            <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </article>
        ))}
      </section>

      <section
        id="roadmap"
        className="grid gap-8 rounded-3xl border border-border/60 bg-secondary/30 px-6 py-10 md:grid-cols-[1fr_auto]"
      >
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold">Phase 1 is underway</h2>
          <p className="text-sm text-muted-foreground">
            We&rsquo;re currently laying the foundation for Zynra—framework setup,
            design system, and secure integrations. Follow along as we bring the
            cosmos to your screen.
          </p>
        </div>
        <div className="self-start rounded-full border border-border bg-background px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Foundation Build
        </div>
      </section>

      <section
        id="contact"
        className="rounded-3xl border border-border/60 bg-card px-6 py-10 shadow-inner shadow-primary/5"
      >
        <h2 className="text-2xl font-semibold">Stay in the loop</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          We&rsquo;ll let you know when beta access opens. Share your email below to receive
          early invitations and astrological insights curated for the community.
        </p>
        <form className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="you@example.com"
            className="h-11 flex-1 rounded-md border border-border bg-background px-4 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Notify me
          </button>
        </form>
      </section>
    </div>
  )
}
