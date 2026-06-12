export interface Player {
  id: string
  name: string
  score: number
  mohalla: string
  timestamp: number
  created_at?: string
  updated_at?: string
}

export interface Registration {
  id: string
  name: string
  nickname: string
  mohalla: string
  contact_number: string
  batting_style: string
  payment_method: string
  payment_status: string
  registered_at: string
  created_at?: string
}

export interface Payment {
  id: string
  registration_id: string
  amount: number
  currency: string
  method: string
  status: string
  tx_hash: string
  payment_date: string
  created_at?: string
}

export interface Profile {
  id: string
  email: string
  role: 'user' | 'admin'
  created_at?: string
}
