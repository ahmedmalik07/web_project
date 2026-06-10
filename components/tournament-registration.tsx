'use client'

import { useEffect, useState } from 'react'
import {
  Trash2,
  Plus,
  Users,
  CreditCard,
  Lock,
  Database,
  Sparkles,
  CheckCircle,
  Settings,
  Shield,
  Edit2,
  Search,
  RefreshCw,
  Coins,
  QrCode,
  X,
  Smartphone
} from 'lucide-react'

interface RegisteredPlayer {
  id: string
  name: string
  mohalla: string
  nickname: string
  contactNumber: string
  battingStyle: string
  paymentMethod: string
  paymentStatus: string
  registeredAt: string
}

const MOHALLA_OPTIONS = [
  'Saddar Strikers',
  'Defence Dragons',
  'Gulberg Gladiators',
  'Clifton Kings',
  'Nazimabad Knights',
  'F-6 Falcons',
  'Hayatabad Hawks',
  'Model Town Titans',
  'Walled City Warriors',
  'DHA Defenders',
]

const MAX_PLAYERS = 15
const REGISTRATION_FEE = 'PKR 500'

export function TournamentRegistration() {
  const [players, setPlayers] = useState<RegisteredPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'register' | 'admin'>('register')

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    mohalla: 'Saddar Strikers',
    nickname: '',
    contactNumber: '',
    battingStyle: 'Right-handed',
    paymentMethod: 'JazzCash',
  })

  // Simulated Payment State
  const [paymentDetails, setPaymentDetails] = useState({
    mobileNumber: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    cryptoAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', // Mock receiver address
    txHash: ''
  })
  
  const [paymentStep, setPaymentStep] = useState<'details' | 'simulating' | 'success'>('details')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentErrors, setPaymentErrors] = useState<string | null>(null)

  // Admin Editing State
  const [editingPlayer, setEditingPlayer] = useState<RegisteredPlayer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [adminSubTab, setAdminSubTab] = useState<'roster' | 'payments'>('roster')

  // Payments log state
  const [payments, setPayments] = useState<any[]>([])
  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [paymentsError, setPaymentsError] = useState<string | null>(null)
  const [lastPaymentInfo, setLastPaymentInfo] = useState<any>(null)

  // API base URL
  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  }

  // Fetch registrations from Express + SQLite backend
  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${getApiUrl()}/registrations`)
      if (!response.ok) {
        throw new Error('Failed to fetch registrations from backend.')
      }
      const data = await response.json()
      setPlayers(data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching registrations:', err)
      setError('Could not connect to database backend. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentDetails((prev) => ({ ...prev, [name]: value }))
  }

  // Fetch payments list
  const fetchPayments = async () => {
    setPaymentsLoading(true)
    try {
      const response = await fetch(`${getApiUrl()}/payments`)
      if (!response.ok) {
        throw new Error('Failed to fetch payments from backend.')
      }
      const data = await response.json()
      setPayments(data)
      setPaymentsError(null)
    } catch (err: any) {
      console.error('Error fetching payments:', err)
      setPaymentsError('Could not load payment records.')
    } finally {
      setPaymentsLoading(false)
    }
  }

  // Delete payment record
  const handleDeletePayment = async (id: string) => {
    if (!confirm('Are you sure you want to remove this payment record from the database?')) {
      return
    }
    try {
      const res = await fetch(`${getApiUrl()}/payments/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        throw new Error('Failed to delete payment.')
      }
      setPayments((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete payment from database.')
    }
  }

  // Open Payment dialog
  const handleOpenPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.nickname.trim() || !formData.contactNumber.trim()) {
      alert('Please fill out all required fields.')
      return
    }
    setPaymentErrors(null)
    setPaymentStep('details')
    setShowPaymentModal(true)
  }

  // Submit registration with mock payment info
  const handleConfirmRegistration = async () => {
    // Local validations
    if (formData.paymentMethod === 'JazzCash' || formData.paymentMethod === 'EasyPaisa') {
      const { mobileNumber } = paymentDetails
      if (!mobileNumber || !/^(03|923|\+923)\d{9}$/.test(mobileNumber.replace(/\s+/g, ''))) {
        setPaymentErrors('Invalid Pakistani mobile number format (must be 11 digits starting with 03)')
        return
      }
    } else if (formData.paymentMethod === 'Stripe' || formData.paymentMethod === 'PayPal') {
      const { cardNumber, expiry, cvc } = paymentDetails
      const cleanCard = (cardNumber || '').replace(/\s+/g, '')
      if (!cleanCard || cleanCard.length < 15 || cleanCard.length > 16 || isNaN(Number(cleanCard))) {
        setPaymentErrors('Invalid credit card number format (must be 15 or 16 digits)')
        return
      }
      if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
        setPaymentErrors('Invalid expiry date (must be in MM/YY format)')
        return
      }
      if (!cvc || cvc.length < 3 || cvc.length > 4 || isNaN(Number(cvc))) {
        setPaymentErrors('Invalid CVC (must be 3 or 4 digits)')
        return
      }
    } else if (formData.paymentMethod === 'USDT' || formData.paymentMethod === 'BTC' || formData.paymentMethod === 'ETH') {
      const { txHash } = paymentDetails
      if (!txHash || txHash.trim().length < 10) {
        setPaymentErrors('Invalid cryptocurrency transaction hash (must be at least 10 characters)')
        return
      }
    }

    setPaymentErrors(null)
    setPaymentStep('simulating')
    
    // Call real Payment checkout API in backend
    try {
      const payload = {
        player: {
          name: formData.name.trim(),
          nickname: formData.nickname.trim(),
          mohalla: formData.mohalla,
          contactNumber: formData.contactNumber.trim(),
          battingStyle: formData.battingStyle,
        },
        payment: {
          method: formData.paymentMethod,
          amount: 500, // PKR 500
          currency: 'PKR',
          mobileNumber: paymentDetails.mobileNumber,
          cardNumber: paymentDetails.cardNumber,
          expiry: paymentDetails.expiry,
          cvc: paymentDetails.cvc,
          txHash: paymentDetails.txHash
        }
      }

      const res = await fetch(`${getApiUrl()}/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Payment processing failed.')
      }

      setPlayers((prev) => [responseData.registration, ...prev])
      setLastPaymentInfo(responseData.payment)
      setPaymentStep('success')
      
      // Reset form
      setFormData({
        name: '',
        mohalla: 'Saddar Strikers',
        nickname: '',
        contactNumber: '',
        battingStyle: 'Right-handed',
        paymentMethod: 'JazzCash',
      })
      setPaymentDetails({
        mobileNumber: '',
        cardNumber: '',
        expiry: '',
        cvc: '',
        cryptoAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        txHash: ''
      })
    } catch (err: any) {
      console.error(err)
      setPaymentErrors(err.message || 'Failed to complete transaction database entry.')
      setPaymentStep('details')
    }
  }

  // Delete registration (CRUD - Delete)
  const handleDeleteRegistration = async (id: string) => {
    if (!confirm('Are you sure you want to remove this registration permanently from database?')) {
      return
    }
    try {
      const res = await fetch(`${getApiUrl()}/registrations/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        throw new Error('Failed to delete registration.')
      }
      setPlayers((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete registration from database.')
    }
  }

  // Start Editing
  const startEdit = (player: RegisteredPlayer) => {
    setEditingPlayer({ ...player })
  }

  // Save Edits (CRUD - Update)
  const saveEdit = async () => {
    if (!editingPlayer) return
    try {
      const res = await fetch(`${getApiUrl()}/registrations/${editingPlayer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingPlayer)
      })

      if (!res.ok) {
        throw new Error('Failed to update registration.')
      }

      const updated = await res.json()
      setPlayers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setEditingPlayer(null)
    } catch (err) {
      console.error(err)
      alert('Failed to save updates to database.')
    }
  }

  // Filter registrations by search
  const filteredPlayers = players.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mohalla.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter payments by search
  const filteredPayments = payments.filter(
    (p) =>
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.txHash && p.txHash.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.registrationId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="px-4 py-12 md:py-16 bg-[#05070a] text-foreground relative overflow-hidden border-b border-slate-900 cyber-grid-red">
      {/* Decorative Neon Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-rose-955/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-orange-955/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border-l-4 border-l-primary bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-4 val-cut-sm">
            <Sparkles className="h-3 w-3 animate-pulse" />
            3D Cyber Roster
          </div>
          <h2 className="text-glow-primary text-balance text-4xl font-black text-white tracking-tight md:text-5xl uppercase">
            Tournament Registrations
          </h2>
          <p className="mt-4 text-sm text-slate-400 max-w-xl mx-auto md:text-base font-bold">
            Powering Gully XI Premier League registrations end-to-end via Express API server and persistent SQLite Database.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 bg-slate-950 border border-rose-500/10 val-cut-sm">
            <button
              onClick={() => setActiveTab('register')}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-wider transition-all val-cut-sm ${
                activeTab === 'register'
                  ? 'bg-primary text-slate-950 font-black shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Users className="h-4 w-4" />
              Tournament Entry
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-wider transition-all val-cut-sm ${
                activeTab === 'admin'
                  ? 'bg-primary text-slate-950 font-black shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Shield className="h-4 w-4" />
              Admin Portal
            </button>
          </div>
        </div>

        {/* Database Status Alert */}
        {error && (
          <div className="mb-8 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-center">
            <p className="text-sm text-rose-400">{error}</p>
            <button 
              onClick={fetchRegistrations}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-rose-300"
            >
              <RefreshCw className="h-3 w-3" /> Retry Connection
            </button>
          </div>
        )}

        {/* Tab 1: Tournament Entry */}
        {activeTab === 'register' && (
          <div className="grid gap-10 md:grid-cols-5 perspective-1000">
            {/* Form Panel */}
            <div className="md:col-span-2 transform-style-3d">
              <form
                onSubmit={handleOpenPayment}
                className="p-7 val-cut border border-rose-500/10 bg-slate-950/60 esports-bracket"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-white tracking-wider uppercase">
                    Player Entry Form
                  </h3>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Entry: {REGISTRATION_FEE}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Ahmed Khan"
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  {/* Nickname */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Cricket Nickname *
                    </label>
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      placeholder="e.g., Sixer"
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  {/* Mohalla/Team */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Mohalla / Team Selection *
                    </label>
                    <select
                      name="mohalla"
                      value={formData.mohalla}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      {MOHALLA_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Contact Number (Phone) *
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 03001234567"
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  {/* Batting Style */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Batting Style *
                    </label>
                    <select
                      name="battingStyle"
                      value={formData.battingStyle}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="Right-handed">Right-handed</option>
                      <option value="Left-handed">Left-handed</option>
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Payment Gateway Method *
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="JazzCash">JazzCash (mock)</option>
                      <option value="EasyPaisa">EasyPaisa (mock)</option>
                      <option value="Stripe">Stripe Sandbox</option>
                      <option value="PayPal">PayPal Sandbox</option>
                      <option value="USDT">Crypto USDT</option>
                      <option value="BTC">Crypto Bitcoin</option>
                      <option value="ETH">Crypto Ethereum</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={players.length >= MAX_PLAYERS}
                  className="val-btn val-cut mt-6 flex w-full items-center justify-center gap-2 py-3.5 text-sm font-black disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="h-5 w-5" />
                  Proceed to Payment
                </button>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 val-cut-sm border border-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Roster Size:</span>
                  </div>
                  <span className="font-extrabold text-white">
                    {loading ? '...' : `${players.length} / ${MAX_PLAYERS}`}
                  </span>
                </div>
              </form>
            </div>

            {/* List Panel */}
            <div className="md:col-span-3 transform-style-3d">
              <div className="p-7 val-cut border border-rose-500/10 bg-slate-950/60 esports-bracket h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-white tracking-wider uppercase">
                    Live Tournament Roster
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                    <Database className="h-3 w-3" /> SQLite Connected
                  </span>
                </div>

                {loading ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary mb-3" />
                    <p className="text-sm font-bold uppercase tracking-wide">Loading records...</p>
                  </div>
                ) : players.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500 text-center">
                    <Users className="h-14 w-14 text-slate-800 mb-3" />
                    <p className="text-sm font-bold text-slate-400">No players registered yet.</p>
                    <p className="text-xs text-slate-600 mt-1">Be the first to enter the arena!</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto max-h-[460px] pr-2 space-y-4">
                    {players.map((p, idx) => (
                      <div
                        key={p.id}
                        className="p-4 val-cut-sm border border-slate-900 bg-slate-950/40 hover:border-primary/30 transition-all flex items-center justify-between group shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank badge */}
                          <div className="flex h-9 w-9 items-center justify-center val-cut-sm bg-primary/10 border border-primary/20 text-primary text-sm font-black shadow-md">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-extrabold text-white">{p.name}</h4>
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-black bg-primary/10 border border-primary/20 text-primary">
                                "{p.nickname}"
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 font-semibold">
                              {p.mohalla} • {p.battingStyle}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-850">
                                {p.paymentMethod}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                p.paymentStatus === 'Paid' 
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                              }`}>
                                {p.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Trash Button for general users (admin has full control on portal) */}
                        <button
                          onClick={() => handleDeleteRegistration(p.id)}
                          className="p-2 val-cut-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white"
                          title="Remove Player"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Admin Portal */}
        {activeTab === 'admin' && (
          <div className="p-7 val-cut border border-rose-500/10 bg-slate-950/60 transform-style-3d esports-bracket">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-white tracking-wider uppercase">
                    Admin Roster Console
                  </h3>
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                    Authorized
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-bold">
                  Full CRUD & database schema editing dashboard.
                </p>
              </div>

              {/* DB Schema Box */}
              <div className="bg-slate-950 p-3 val-cut-sm border border-slate-900 text-[10px] text-slate-400 max-w-md font-mono">
                <div className="flex items-center gap-1.5 text-primary font-bold mb-1">
                  <Database className="h-3.5 w-3.5" />
                  <span>SQLite Database Schema</span>
                </div>
                {adminSubTab === 'roster' ? (
                  <code>Schema registrations: id(TEXT PK), name(TEXT), nickname(TEXT), mohalla(TEXT), contactNumber(TEXT), battingStyle(TEXT), paymentMethod(TEXT), paymentStatus(TEXT), registeredAt(TEXT)</code>
                ) : (
                  <code>Schema payments: id(TEXT PK), registrationId(TEXT), amount(INTEGER), currency(TEXT), method(TEXT), status(TEXT), txHash(TEXT), paymentDate(TEXT)</code>
                )}
              </div>
            </div>

            {/* Admin Sub-Tabs */}
            <div className="flex gap-6 mb-6 border-b border-slate-900 pb-2">
              <button
                onClick={() => setAdminSubTab('roster')}
                className={`pb-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                  adminSubTab === 'roster'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Roster List ({players.length})
              </button>
              <button
                onClick={() => {
                  setAdminSubTab('payments');
                  fetchPayments();
                }}
                className={`pb-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                  adminSubTab === 'payments'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Payments Log ({payments.length})
              </button>
            </div>

            {/* Admin Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              {/* Search */}
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder={adminSubTab === 'roster' ? "Search player, nickname..." : "Search ID, method, hash..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-sm text-white placeholder:text-slate-600 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={adminSubTab === 'roster' ? fetchRegistrations : fetchPayments}
                  className="flex items-center gap-1.5 px-4 py-2.5 val-cut-sm border border-slate-800 hover:border-primary/45 text-slate-300 hover:text-white transition-all text-xs font-bold uppercase"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reload Database
                </button>
              </div>
            </div>

            {/* Sub-Tab 1: Roster List */}
            {adminSubTab === 'roster' && (
              <>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary mb-3" />
                    <p className="text-sm font-bold">Retrieving secure records...</p>
                  </div>
                ) : filteredPlayers.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 bg-slate-950/30 border border-slate-900 rounded-xl">
                    <p className="text-sm font-bold">No records found matching search criteria.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto val-cut-sm border border-slate-900 bg-slate-950/40">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-900 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="px-5 py-4">Player</th>
                          <th className="px-5 py-4">Nickname</th>
                          <th className="px-5 py-4">Mohalla / Team</th>
                          <th className="px-5 py-4">Contact</th>
                          <th className="px-5 py-4">Style</th>
                          <th className="px-5 py-4">Payment Info</th>
                          <th className="px-5 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPlayers.map((player) => (
                          <tr
                            key={player.id}
                            className="border-b border-slate-900 hover:bg-slate-900/30 transition-colors"
                          >
                            <td className="px-5 py-4 font-black text-white">
                              {player.name}
                            </td>
                            <td className="px-5 py-4 text-primary font-black">
                              "{player.nickname}"
                            </td>
                            <td className="px-5 py-4 text-slate-300 font-semibold">
                              {player.mohalla}
                            </td>
                            <td className="px-5 py-4 text-slate-400 font-mono">
                              {player.contactNumber}
                            </td>
                            <td className="px-5 py-4 text-slate-400 font-semibold">
                              {player.battingStyle}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-white text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-850 inline-block w-fit">
                                  {player.paymentMethod}
                                </span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border w-fit ${
                                  player.paymentStatus === 'Paid'
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                }`}>
                                  {player.paymentStatus}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => startEdit(player)}
                                  className="p-2 val-cut-sm bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-slate-950 transition-all"
                                  title="Edit Registration"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRegistration(player.id)}
                                  className="p-2 val-cut-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                                  title="Delete Registration"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* Sub-Tab 2: Payments Log */}
            {adminSubTab === 'payments' && (
              <>
                {paymentsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary mb-3" />
                    <p className="text-sm font-bold">Retrieving transaction history...</p>
                  </div>
                ) : paymentsError ? (
                  <div className="text-center py-20 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                    <p className="text-sm font-bold">{paymentsError}</p>
                  </div>
                ) : filteredPayments.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 bg-slate-950/30 border border-slate-900 rounded-xl">
                    <p className="text-sm font-bold">No payment logs found matching search criteria.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto val-cut-sm border border-slate-900 bg-slate-950/40">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-900 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="px-5 py-4">Receipt ID</th>
                          <th className="px-5 py-4">Reg ID</th>
                          <th className="px-5 py-4">Amount</th>
                          <th className="px-5 py-4">Gateway</th>
                          <th className="px-5 py-4">Ref/Hash Key</th>
                          <th className="px-5 py-4">Date</th>
                          <th className="px-5 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.map((p) => (
                          <tr
                            key={p.id}
                            className="border-b border-slate-900 hover:bg-slate-900/30 transition-colors"
                          >
                            <td className="px-5 py-4 font-black text-white font-mono">
                              {p.id}
                            </td>
                            <td className="px-5 py-4 text-slate-300 font-mono">
                              {p.registrationId}
                            </td>
                            <td className="px-5 py-4 font-bold text-emerald-400 font-mono">
                              {p.amount} {p.currency}
                            </td>
                            <td className="px-5 py-4 text-slate-300 font-extrabold uppercase">
                              {p.method}
                            </td>
                            <td className="px-5 py-4 text-slate-400 font-mono truncate max-w-[120px]" title={p.txHash}>
                              {p.txHash}
                            </td>
                            <td className="px-5 py-4 text-slate-400">
                              {p.paymentDate}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleDeletePayment(p.id)}
                                  className="p-2 val-cut-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                                  title="Delete Payment Record"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Modal: Editing Player (CRUD Update) */}
        {editingPlayer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <div className="w-full max-w-md val-cut border border-rose-500/25 bg-slate-950 p-6 shadow-2xl relative esports-bracket">
              <button
                onClick={() => setEditingPlayer(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <h4 className="text-xl font-black text-white mb-4 flex items-center gap-2 border-b border-slate-900 pb-3 uppercase tracking-wider">
                <Edit2 className="h-5 w-5 text-primary" /> Update Registration
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Player Name
                  </label>
                  <input
                    type="text"
                    value={editingPlayer.name}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Nickname
                  </label>
                  <input
                    type="text"
                    value={editingPlayer.nickname}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, nickname: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Mohalla / Team
                  </label>
                  <select
                    value={editingPlayer.mohalla}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, mohalla: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  >
                    {MOHALLA_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={editingPlayer.contactNumber}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, contactNumber: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Batting Style
                  </label>
                  <select
                    value={editingPlayer.battingStyle}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, battingStyle: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  >
                    <option value="Right-handed">Right-handed</option>
                    <option value="Left-handed">Left-handed</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Payment Method
                    </label>
                    <select
                      value={editingPlayer.paymentMethod}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, paymentMethod: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    >
                      <option value="JazzCash">JazzCash</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                      <option value="Stripe">Stripe</option>
                      <option value="PayPal">PayPal</option>
                      <option value="USDT">USDT</option>
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Payment Status
                    </label>
                    <select
                      value={editingPlayer.paymentStatus}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, paymentStatus: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-900 pt-4">
                <button
                  onClick={() => setEditingPlayer(null)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="val-btn val-cut-sm px-5 py-2 text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Payment Simulation Gateway */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
            <div className="w-full max-w-md val-cut border border-rose-500/25 bg-slate-950 p-6 shadow-2xl relative overflow-hidden esports-bracket">
              {/* Glowing header bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500 animate-pulse" />
              
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {paymentStep === 'details' && (
                <div>
                  <h4 className="text-xl font-black text-white mb-2 flex items-center gap-2 uppercase tracking-wider">
                    <CreditCard className="h-5 w-5 text-primary" /> Checkout Payment
                  </h4>
                  <p className="text-xs text-slate-400 mb-6 font-bold">
                    Simulate secure checkout for tournament registration.
                  </p>

                  {paymentErrors && (
                    <div className="mb-4 rounded border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-400 font-bold">
                      {paymentErrors}
                    </div>
                  )}

                  <div className="bg-slate-950 p-4 val-cut-sm border border-slate-900 mb-6 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Tournament Entry Fee</p>
                      <p className="text-xs text-slate-300 font-bold mt-1 uppercase">Gully XI Premier League</p>
                    </div>
                    <span className="text-xl font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                      {REGISTRATION_FEE}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* JazzCash / EasyPaisa details */}
                    {(formData.paymentMethod === 'JazzCash' || formData.paymentMethod === 'EasyPaisa') && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-primary text-sm font-black uppercase">
                          <Smartphone className="h-4 w-4" />
                          <span>{formData.paymentMethod} Mobile Wallet</span>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Mobile Account Number
                          </label>
                          <input
                            type="tel"
                            name="mobileNumber"
                            value={paymentDetails.mobileNumber}
                            onChange={handlePaymentDetailsChange}
                            placeholder="e.g., 03001234567"
                            required
                            className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold">
                          *A simulated verification popup request will be processed.
                        </p>
                      </div>
                    )}

                    {/* Credit Card details (Stripe/PayPal) */}
                    {(formData.paymentMethod === 'Stripe' || formData.paymentMethod === 'PayPal') && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-primary text-sm font-black uppercase">
                          <CreditCard className="h-4 w-4" />
                          <span>Mock Card Details ({formData.paymentMethod})</span>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={paymentDetails.cardNumber}
                            onChange={handlePaymentDetailsChange}
                            placeholder="4242 4242 4242 4242"
                            required
                            className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Expiry
                            </label>
                            <input
                              type="text"
                              name="expiry"
                              value={paymentDetails.expiry}
                              onChange={handlePaymentDetailsChange}
                              placeholder="MM/YY"
                              className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              CVC
                            </label>
                            <input
                              type="text"
                              name="cvc"
                              value={paymentDetails.cvc}
                              onChange={handlePaymentDetailsChange}
                              placeholder="123"
                              className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Crypto details (USDT/BTC/ETH) */}
                    {(formData.paymentMethod === 'USDT' || formData.paymentMethod === 'BTC' || formData.paymentMethod === 'ETH') && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 text-primary text-sm font-black uppercase">
                          <div className="flex items-center gap-1.5">
                            <Coins className="h-4 w-4" />
                            <span>Crypto Payment ({formData.paymentMethod})</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            Sandbox
                          </span>
                        </div>
                        <div className="flex items-center justify-center p-3.5 bg-white rounded-lg border border-slate-800 w-32 h-32 mx-auto val-cut-sm">
                          <QrCode className="w-full h-full text-slate-950" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Receiver {formData.paymentMethod} Address
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={paymentDetails.cryptoAddress}
                            className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs font-mono text-slate-400 select-all focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Transaction Hash / Wallet Address
                          </label>
                          <input
                            type="text"
                            name="txHash"
                            value={paymentDetails.txHash}
                            onChange={handlePaymentDetailsChange}
                            placeholder="Paste transaction TXID hash"
                            required
                            className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleConfirmRegistration}
                    className="val-btn val-cut mt-6 flex w-full items-center justify-center gap-2 py-3.5 text-sm font-black"
                  >
                    <Lock className="h-4 w-4" /> Confirm Simulated Payment
                  </button>
                </div>
              )}

              {paymentStep === 'simulating' && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <RefreshCw className="h-10 w-10 animate-spin text-primary mb-4" />
                  <h4 className="text-lg font-black text-white mb-2 uppercase">Simulating SECURE Transaction...</h4>
                  <p className="text-xs text-slate-400 max-w-xs font-bold">
                    Connecting to mock payment gateway API and updating server registration database records.
                  </p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 shadow shadow-emerald-500/30">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h4 className="text-xl font-black text-white mb-2 uppercase">Registration Complete!</h4>
                  <p className="text-xs text-slate-400 max-w-xs mb-4 font-bold">
                    Simulated payment of <strong className="text-white">{REGISTRATION_FEE}</strong> was approved. Your details are saved in the database.
                  </p>

                  {lastPaymentInfo && (
                    <div className="bg-slate-950/80 p-3 val-cut-sm border border-slate-900 text-left w-full mb-6 font-mono text-[10px] text-slate-400 space-y-1.5">
                      <div className="text-[9px] uppercase font-black text-primary mb-1">Payment Receipt (API Response)</div>
                      <div><span className="text-slate-500">Transaction ID:</span> <span className="text-white font-bold">{lastPaymentInfo.id}</span></div>
                      <div><span className="text-slate-500">Gateway Ref:</span> <span className="text-slate-300 select-all">{lastPaymentInfo.txHash}</span></div>
                      <div><span className="text-slate-500">Amount Paid:</span> <span className="text-emerald-400 font-bold">{lastPaymentInfo.amount} {lastPaymentInfo.currency}</span></div>
                      <div><span className="text-slate-500">Timestamp:</span> <span className="text-slate-300">{lastPaymentInfo.paymentDate}</span></div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setShowPaymentModal(false)
                      fetchRegistrations()
                    }}
                    className="val-btn val-cut-sm px-6 py-2.5 text-xs font-black"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
