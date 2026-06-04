import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Schedule",
  description: "Full tournament schedule for Gully XI Premier League with match dates, venues, and results.",
}

type MatchStatus = "Completed" | "Upcoming" | "Live" | "Final"

interface Match {
  id: number
  teams: string
  date: string
  venue: string
  status: MatchStatus
  score?: string
}

const matches: Match[] = [
  { id: 1, teams: "Saddar Strikers vs Defence Dragons", date: "15 Mar 2026", venue: "Gaddafi Stadium, Lahore", status: "Completed", score: "182/4 - 178/8" },
  { id: 2, teams: "Gulberg Gladiators vs Clifton Kings", date: "17 Mar 2026", venue: "National Stadium, Karachi", status: "Completed", score: "201/3 - 195/6" },
  { id: 3, teams: "Nazimabad Knights vs F-6 Falcons", date: "19 Mar 2026", venue: "Pindi Cricket Stadium, Rawalpindi", status: "Completed", score: "156/7 - 142/10" },
  { id: 4, teams: "Hayatabad Hawks vs Walled City Warriors", date: "21 Mar 2026", venue: "Arbab Niaz Stadium, Peshawar", status: "Completed", score: "175/5 - 168/7" },
  { id: 5, teams: "Model Town Titans vs Johar Jaguars", date: "24 Mar 2026", venue: "Multan Cricket Stadium", status: "Completed", score: "210/2 - 189/6" },
  { id: 6, teams: "Saddar Strikers vs Gulberg Gladiators", date: "27 Mar 2026", venue: "Gaddafi Stadium, Lahore", status: "Live", score: "145/3 (16 ov)" },
  { id: 7, teams: "Nazimabad Knights vs Hayatabad Hawks", date: "30 Mar 2026", venue: "National Stadium, Karachi", status: "Upcoming" },
  { id: 8, teams: "Model Town Titans vs Defence Dragons", date: "02 Apr 2026", venue: "Gaddafi Stadium, Lahore", status: "Upcoming" },
  { id: 9, teams: "Semi-Final 1: TBD vs TBD", date: "06 Apr 2026", venue: "National Stadium, Karachi", status: "Upcoming" },
  { id: 10, teams: "Semi-Final 2: TBD vs TBD", date: "08 Apr 2026", venue: "Gaddafi Stadium, Lahore", status: "Upcoming" },
  { id: 11, teams: "GRAND FINAL", date: "12 Apr 2026", venue: "Gaddafi Stadium, Lahore", status: "Final" },
]

function StatusBadge({ status }: { status: MatchStatus }) {
  const styles: Record<MatchStatus, string> = {
    Completed: "bg-muted text-muted-foreground",
    Live: "bg-red-900/40 text-red-400 animate-pulse",
    Upcoming: "bg-primary/15 text-primary",
    Final: "bg-accent/20 text-accent",
  }
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[status]}`}>
      {status === "Live" ? "LIVE" : status}
    </span>
  )
}

export default function SchedulePage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Page header */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
            Season 2026
          </span>
          <h1 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-5xl">
            Tournament Schedule
          </h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            {"All matches, venues, and scores for the Gully XI Premier League."}
          </p>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">#</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Match</th>
                <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground md:table-cell">Date</th>
                <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground lg:table-cell">Venue</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Score</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match, index) => (
                <tr
                  key={match.id}
                  className={`border-b border-border transition-colors ${
                    match.status === "Final"
                      ? "bg-accent/10 border-accent/30"
                      : index % 2 === 0
                        ? "bg-card"
                        : "bg-card/50"
                  } ${match.status === "Live" ? "bg-red-950/20" : ""}`}
                >
                  <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                    {match.id}
                  </td>
                  <td className={`px-4 py-3.5 font-medium ${match.status === "Final" ? "text-accent font-bold" : "text-foreground"}`}>
                    {match.teams}
                    {/* Mobile date */}
                    <span className="block text-xs text-muted-foreground md:hidden">{match.date}</span>
                  </td>
                  <td className="hidden px-4 py-3.5 text-muted-foreground md:table-cell">{match.date}</td>
                  <td className="hidden px-4 py-3.5 text-muted-foreground lg:table-cell">{match.venue}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                    {match.score || "---"}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={match.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Final match callout */}
        <div className="mt-8 rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Grand Final</p>
          <p className="mt-1 text-lg font-bold text-foreground">12 April 2026 - Gaddafi Stadium, Lahore</p>
          <p className="mt-1 text-sm text-muted-foreground">{"The ultimate showdown. One mohalla takes it all."}</p>
        </div>
      </div>
    </div>
  )
}
