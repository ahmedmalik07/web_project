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
    title: "Prize Pool",
    description:
      "PKR 500,000 total prize money. Winners take home the Gully XI Trophy plus exclusive cricket gear from local sponsors across Lahore and Karachi.",
  },
  {
    icon: MapPin,
    title: "Locations",
    description:
      "Matches played across iconic mohallas: Saddar, Defence, Gulberg, Clifton, Nazimabad, and Hayatabad. From the streets of Lahore to the alleys of Karachi.",
  },
]

export function AboutTournament() {
  return (
    <section className="px-4 py-20 relative border-b border-slate-900">
      <div className="mx-auto max-w-6xl relative z-10">
        {/* Section heading */}
        <div className="mb-16 text-center">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-primary bg-primary/10 px-4 py-1.5 border-l-4 border-l-primary val-cut-sm shadow-sm">
            About the Tournament
          </span>
          <h2 className="mt-4 text-balance text-4xl font-black text-white md:text-5xl uppercase tracking-tight">
            {"Pakistan's Biggest Gully Cricket League"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-slate-400 md:text-base font-bold">
            {"From the narrow alleys of the Walled City to the wide streets of DHA, Gully XI Premier League brings together Pakistan's finest tapeball talent."}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-center perspective-1000">
          
          {/* Left Column: Native 3D Cricket Bat */}
          <div className="lg:col-span-5 flex justify-center transform-style-3d translate-z-10">
            <div className="relative w-full max-w-[360px] aspect-[4/5] val-cut border border-rose-500/20 bg-slate-950/60 p-3.5 backdrop-blur-md shadow-2xl shadow-rose-950/30 neon-border-glow transition-all hover:scale-[1.02] esports-bracket">
              <ThreeViewerClient type="bat" />
              <div className="absolute -bottom-3 -left-3 px-4 py-1.5 bg-primary text-[10px] font-black uppercase tracking-widest text-white val-cut-sm shadow-lg border border-rose-400/20 z-20">
                INSPECT 3D EQUIPMENT
              </div>
            </div>
          </div>

          {/* Right Column: Features list */}
          <div className="lg:col-span-7 space-y-6 transform-style-3d translate-z-20">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="p-6 val-cut border border-rose-500/10 bg-slate-950/50 transform-style-3d flex gap-5 items-start esports-bracket hover:border-primary/30 transition-all hover:bg-slate-950/85"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center val-cut-sm bg-primary/10 border border-primary/20 text-primary shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-black text-white tracking-wider uppercase">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-400 font-bold">
                      {feature.description}
                    </p>
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
