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
            Unlock the secrets of your cosmic blueprint.
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Get instant access to your complete birth chart, numerology profile, and AI-powered insights.
            Discover patterns in your life, relationships, and purpose—all calculated from your birth data in seconds.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/onboarding"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Get Your Free Chart Now
            </Link>
            <Link
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              See What's Inside
            </Link>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <span>Export to PDF</span>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-8 text-sm shadow-lg shadow-primary/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              What You'll Get
            </h2>
            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
              FREE
            </span>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="mt-0.5 text-primary">🌟</span>
              <div>
                <div className="font-semibold text-foreground">Complete Birth Chart</div>
                <div className="text-xs text-muted-foreground">
                  All planetary positions, houses, and aspects calculated with precision
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-primary">🔢</span>
              <div>
                <div className="font-semibold text-foreground">Numerology Profile</div>
                <div className="text-xs text-muted-foreground">
                  Life path, expression, soul urge, personality, and birthday numbers
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-primary">🤖</span>
              <div>
                <div className="font-semibold text-foreground">AI-Powered Insights</div>
                <div className="text-xs text-muted-foreground">
                  Personalized interpretations combining astrology and numerology
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-primary">📄</span>
              <div>
                <div className="font-semibold text-foreground">PDF Export</div>
                <div className="text-xs text-muted-foreground">
                  Download your complete cosmic report to keep forever
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section id="features" className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Powered by Advanced Technology</h2>
          <p className="mt-2 text-muted-foreground">
            Professional-grade calculations combined with AI to deliver accurate, personalized insights
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: "🔭",
              title: "Astronomy-Grade Astrology",
              description:
                "Your natal chart is calculated using the Astronomia library—the same precision used by professional astronomers. Get accurate planetary positions, house cusps, and aspect calculations.",
            },
            {
              icon: "🔢",
              title: "Pythagorean Numerology",
              description:
                "Discover your life path, expression, soul urge, personality, and birthday numbers. Each calculation follows traditional Pythagorean methods with modern interpretations.",
            },
            {
              icon: "🤖",
              title: "AI-Powered Synthesis",
              description:
                "Our AI analyzes your complete cosmic profile to generate personalized insights about your strengths, challenges, and guidance for your unique path.",
            },
          ].map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm shadow-primary/5 transition-all hover:shadow-md hover:shadow-primary/10"
            >
              <div className="text-3xl">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 text-center md:p-12">
        <h2 className="text-2xl font-bold md:text-3xl">Ready to explore your cosmic identity?</h2>
        <p className="mt-3 text-muted-foreground md:text-lg">
          Join thousands who have discovered deeper insights into their life path and purpose.
        </p>
        <Link
          href="/onboarding"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
        >
          Start Your Free Analysis
        </Link>
        <p className="mt-4 text-xs text-muted-foreground">
          No credit card required • Results in under 60 seconds
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-border/60 bg-card p-8">
          <h3 className="mb-2 text-xl font-semibold">How It Works</h3>
          <ol className="space-y-4 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                1
              </span>
              <div>
                <div className="font-medium text-foreground">Enter Your Birth Details</div>
                <div>Provide your name, birth date, time, and location</div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                2
              </span>
              <div>
                <div className="font-medium text-foreground">Instant Calculation</div>
                <div>Our engine computes your complete astrological and numerological profile</div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                3
              </span>
              <div>
                <div className="font-medium text-foreground">Explore Your Results</div>
                <div>View detailed interpretations and download your PDF report</div>
              </div>
            </li>
          </ol>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-8">
          <h3 className="mb-2 text-xl font-semibold">What Makes Zynra Different</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span><strong className="text-foreground">Completely Free</strong> - No hidden fees or premium tiers</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span><strong className="text-foreground">Scientific Accuracy</strong> - Astronomy-grade calculations</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span><strong className="text-foreground">AI-Enhanced</strong> - Personalized insights beyond generic readings</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span><strong className="text-foreground">Comprehensive</strong> - Astrology + Numerology combined</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span><strong className="text-foreground">Export Ready</strong> - Save your report as PDF</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
