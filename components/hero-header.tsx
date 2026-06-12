import { Trophy, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"
import { ThreeViewerClient } from "@/components/three-viewer-client"

export function HeroHeader() {
  return (
    <header className="relative w-full overflow-hidden min-h-[88vh] flex items-center justify-center py-16 lg:py-24">
      {/* Subtle grid background */}
      <div className="absolute inset-0 cyber-grid-red pointer-events-none" />

      {/* Indigo radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-primary/8 blur-[120px] pointer-events-none dark:bg-primary/12" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-accent/6 blur-[100px] pointer-events-none dark:bg-accent/10" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <div className="grid gap-16 lg:grid-cols-2 items-center">

          {/* Left: Text */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs font-semibold text-primary">
              <Zap className="h-3.5 w-3.5" />
              Pakistan&apos;s #1 Tapeball Cricket League
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-black tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Gully XI
              <span className="block gradient-text mt-1">Premier League</span>
            </h1>

            <p className="mt-5 max-w-lg text-base text-muted-foreground leading-relaxed">
              Register your mohalla&apos;s elite roster, track match scores in real time, and fight for Pakistan&apos;s ultimate street cricket crown.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                href="/players"
                className="val-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm"
              >
                Register Player
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/leaderboard"
                className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold"
              >
                View Leaderboard
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 w-full max-w-sm lg:max-w-none">
              {[
                { value: "150+", label: "Mohallas" },
                { value: "5K+",  label: "Players" },
                { value: "₨500K", label: "Prize Pool" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center lg:text-left">
                  <div className="text-2xl font-black text-foreground md:text-3xl">{value}</div>
                  <div className="mt-0.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Trophy */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-[400px] aspect-square rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-4 shadow-2xl neon-border-glow transition-all duration-300 hover:scale-[1.02]">
              <ThreeViewerClient type="trophy" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/80 backdrop-blur px-4 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                Drag to rotate
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}
