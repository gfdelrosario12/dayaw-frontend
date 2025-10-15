"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChat } from "@/hooks/use-chat"
import { useLanguage } from "@/context/language-context"
import { Send, Loader2, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"

export function ChatPiso() {
  const { t, language } = useLanguage()
  const { messages, isLoading, sendMessage } = useChat()
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      sendMessage(input)
      setInput("")
    }
  }

  const suggestedQuestions = [
    {
      en: "What is the difference between NEP and GAA?",
      fil: "Ano ang pagkakaiba ng NEP at GAA?",
    },
    {
      en: "How is the national budget approved?",
      fil: "Paano inaprubahan ang pambansang badyet?",
    },
    {
      en: "What does disbursement mean?",
      fil: "Ano ang ibig sabihin ng disbursement?",
    },
    {
      en: "Which agency has the largest budget?",
      fil: "Aling ahensya ang may pinakamalaking badyet?",
    },
  ]

  return (
    <div className="flex h-[600px] flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Sparkles className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{t("Hi! I'm Piso", "Kumusta! Ako si Piso")}</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
              {t(
                "Your AI assistant for understanding Philippine budget data. Ask me anything about budget processes, terms, or specific agencies.",
                "Ang iyong AI assistant para sa pag-unawa ng datos ng badyet ng Pilipinas. Tanungin mo ako tungkol sa mga proseso, termino, o mga tiyak na ahensya.",
              )}
            </p>

            {/* Suggested Questions */}
            <div className="grid gap-2 md:grid-cols-2 max-w-2xl">
              {suggestedQuestions.map((q, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setInput(language === "en" ? q.en : q.fil)}
                  className="rounded-lg border border-border bg-card p-3 text-left text-sm text-muted-foreground transition-all hover:border-accent hover:text-foreground"
                >
                  {language === "en" ? q.en : q.fil}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <span className="text-xs font-semibold text-accent">Piso</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className="mt-2 text-xs opacity-60">
                    {new Date(message.timestamp).toLocaleTimeString(language === "en" ? "en-US" : "fil-PH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="max-w-[80%] rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-accent">Piso</span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-accent" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-border bg-card p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("Ask Piso about the budget...", "Tanungin si Piso tungkol sa badyet...")}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="bg-accent text-accent-foreground">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground text-center">
          {t(
            "Piso uses AI to explain budget data. Responses may not always be accurate.",
            "Gumagamit si Piso ng AI upang ipaliwanag ang datos ng badyet. Ang mga sagot ay maaaring hindi palaging tumpak.",
          )}
        </p>
      </div>
    </div>
  )
}
