import { Trophy, MapPin, ScrollText } from "lucide-react"
import { ThreeViewerClient } from "@/components/three-viewer-client"

const features = [
  {
    icon: ScrollText,
    title: "Rules of the Gully",
    description:
      "Classic tapeball rules: one-tip-one-hand catches, roof hits are 6 and out, last-man batting applies. Pure street cricket as played across Pakistan.",
  },
  {
    icon: Trophy,
    title: "PKR 500,000 Prize Pool",
    description:
      "Winners take home the Gully XI Trophy plus exclusive cricket gear from local sponsors across Lahore and Karachi.",
  },
  {
    icon: MapPin,
    title: "9 Venues Across Pakistan",
    description:
      "Saddar, Defence, Gulberg, Clifton, Nazimabad, and Hayatabad — from the streets of Lahore to the alleys of Karachi.",
  },
]

export function AboutTournament() {
  return (
    <section className="px-4 py-20 border-b border-border">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-14 text-center">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
            About the Tournament
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Pakistan&apos;s Biggest
            <span className="gradient-text"> Gully Cricket League</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
            From the narrow alleys of the Walled City to the wide streets of DHA, Gully XI brings together Pakistan&apos;s finest tapeball talent.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* 3D Bat */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-4 shadow-xl neon-border-glow transition-all hover:scale-[1.02]">
              <ThreeViewerClient type="bat" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/80 backdrop-blur px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                Inspect 3D equipment
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group flex gap-4 rounded-2xl border border-border bg-card/60 p-5 transition-all duration-200 hover:border-primary/30 hover:bg-card hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-bold text-foreground">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
