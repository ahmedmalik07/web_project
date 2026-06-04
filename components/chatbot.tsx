'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  text: string
  timestamp: Date
}

const faqResponses: Record<string, string> = {
  'how do i register': 'You can register for the tournament on our Players page. Fill out the registration form with your name, nickname, mohalla, contact number, and batting style. Players are limited to 10 registrations.',
  'what are the tournament rules': 'All matches are played with tapeball cricket. Each team gets 10 overs per side. Teams must maintain fair play. Check our Schedule page for match details and venues.',
  'where are the matches': 'Matches are held at 9 venues across Pakistan including Gaddafi Stadium (Lahore), National Stadium (Karachi), and others. Visit our Schedule page for venue details.',
  'when is the tournament': 'The Gully XI Premier League runs throughout the season. Check the Schedule page for match dates and timings.',
  'can i see the leaderboard': 'Yes! Visit the Leaderboard page to see live rankings of all players. The leaderboard updates dynamically as scores are submitted.',
  'how do i contact support': 'You can reach us through our Contact page. Fill out the form with your query and we will respond within 48 hours.',
  'what is gully cricket': 'Gully cricket is tapeball cricket played in streets and neighborhoods across Pakistan. It\'s the grassroots version of cricket where passion meets talent!',
  'default': 'I can help you with registration, rules, schedule, leaderboard, and contact information. What would you like to know?',
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Welcome to Gully XI! 👋 How can I help you today? Ask about registration, rules, venues, or contact us.',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findResponse = (userMessage: string): string => {
    const lowercaseMsg = userMessage.toLowerCase()
    for (const [key, value] of Object.entries(faqResponses)) {
      if (key === 'default') continue
      if (lowercaseMsg.includes(key)) {
        return value
      }
    }
    return faqResponses['default']
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: findResponse(inputValue),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 500)
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex w-96 max-w-[calc(100vw-2rem)] flex-col rounded-lg border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <h3 className="font-bold">Gully XI Support</h3>
              <p className="text-xs opacity-90">Ask about our tournament</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="transition-opacity hover:opacity-80"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex h-96 flex-col gap-4 overflow-y-auto bg-background/50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-secondary text-foreground rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-100"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-border bg-card p-4"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
