import { Trophy, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ThreeViewerClient } from "@/components/three-viewer-client"

export function HeroHeader() {
  return (
    <header className="relative w-full overflow-hidden min-h-[85vh] flex items-center justify-center bg-[#05070a] py-12 lg:py-20 border-b border-slate-900">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(239,68,68,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(239,68,68,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      
      {/* Decorative Glow Overlays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[20rem] rounded-full bg-gradient-to-r from-rose-500/5 to-orange-500/5 blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 perspective-1000 transform-style-3d">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left transform-style-3d translate-z-10">
            {/* Esports Badge */}
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 border-l-4 border-l-primary bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.25em] shadow-[0_0_15px_rgba(239,68,68,0.1)] w-fit val-cut-sm">
              <Trophy className="h-4 w-4 text-primary animate-bounce" />
              Pakistan's Tapeball Tournament
            </div>

            {/* 3D Title */}
            <h1 className="text-balance text-5xl font-black uppercase tracking-tight text-white md:text-7xl lg:text-8xl leading-none">
              Gully XI
              <span className="block bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500 bg-clip-text text-transparent text-glow-primary">
                PREMIER LEAGUE
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-sm md:text-base text-slate-400 font-bold uppercase tracking-wide">
              {"Pakistan's ultimate tapeball cricket leaderboard. Register your mohalla's elite roster, trace match scores in real time, and fight for the ultimate street crown."}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/players"
                className="val-btn val-cut w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-sm"
              >
                Register Player
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                href="/leaderboard"
                className="w-full sm:w-auto text-center px-8 py-4 val-cut border border-slate-850 bg-slate-950/40 hover:bg-slate-950 hover:border-primary/40 text-slate-300 hover:text-white transition-all text-sm font-black uppercase tracking-wider shadow-sm"
              >
                Live Leaderboard
              </Link>
            </div>

            {/* Stats Row */}
            <div className="mt-12 flex items-center gap-6 md:gap-10 border border-rose-500/10 bg-[#05070a]/60 backdrop-blur-md p-5 val-cut-sm esports-bracket transform-style-3d">
              <div className="text-center">
                <div className="text-3xl font-black text-primary text-glow-primary md:text-4xl">
                  150+
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                  Mohallas
                </div>
              </div>
              <div className="h-10 w-px bg-slate-850" />
              <div className="text-center">
                <div className="text-3xl font-black text-primary text-glow-primary md:text-4xl">
                  5K+
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                  Players
                </div>
              </div>
              <div className="h-10 w-px bg-slate-850" />
              <div className="text-center">
                <div className="text-3xl font-black text-white text-glow-primary md:text-4xl">
                  PKR 500K
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                  Prize Pool
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Native 3D Gold Trophy */}
          <div className="lg:col-span-5 w-full flex justify-center items-center transform-style-3d translate-z-20">
            <div className="relative w-full max-w-[420px] aspect-square val-cut border border-rose-500/20 bg-slate-950/60 p-3.5 backdrop-blur-md shadow-2xl shadow-rose-950/30 neon-border-glow transition-all hover:scale-[1.02] esports-bracket">
              <ThreeViewerClient type="trophy" />
              {/* Float badge */}
              <div className="absolute -bottom-3 -right-3 px-4 py-1.5 bg-primary text-[10px] font-black uppercase tracking-widest text-white val-cut-sm shadow-lg border border-rose-400/20 z-20">
                DRAG TO ROTATE 3D
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}
