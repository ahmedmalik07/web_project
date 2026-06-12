"use client"

import { useState } from "react"
import { PlayersTab } from "./players-tab"
import { RegistrationsTab } from "./registrations-tab"
import { PaymentsTab } from "./payments-tab"
import { UsersTab } from "./users-tab"
import type { Player, Registration, Payment, Profile } from "@/lib/types"
import { Trophy, Users, CreditCard, Shield } from "lucide-react"

interface AdminPanelProps {
  initialPlayers: Player[]
  initialRegistrations: Registration[]
  initialPayments: Payment[]
  initialProfiles: Profile[]
}

const tabs = [
  { id: "players", label: "Players", icon: Trophy },
  { id: "registrations", label: "Registrations", icon: Users },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "users", label: "Users", icon: Shield },
] as const

type TabId = typeof tabs[number]["id"]

export function AdminPanel({ initialPlayers, initialRegistrations, initialPayments, initialProfiles }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("players")

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === "players" && <PlayersTab initialPlayers={initialPlayers} />}
      {activeTab === "registrations" && <RegistrationsTab initialRegistrations={initialRegistrations} />}
      {activeTab === "payments" && <PaymentsTab initialPayments={initialPayments} />}
      {activeTab === "users" && <UsersTab initialProfiles={initialProfiles} />}
    </div>
  )
}
