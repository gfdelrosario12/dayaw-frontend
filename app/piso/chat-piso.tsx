"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, Bot, User } from "lucide-react"
import { useLanguage } from "@/context/language-context"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api"

export function ChatPiso() {
    const { t } = useLanguage()
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: t(
                "Hello! I'm Piso, your AI budget assistant. Ask me anything about the Philippine budget!",
                "Kamusta! Ako si Piso, ang iyong AI budget assistant. Tanungin mo ako tungkol sa badyet ng Pilipinas!"
            ),
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput("")

        setMessages(prev => [...prev, { role: "user", content: userMessage }])
        setIsLoading(true)

        try {
            console.log("Sending request to:", `${API_BASE_URL}/chat`)

            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            })


            console.log("Response status:", response.status)
            console.log("Response headers:", response.headers)

            if (!response.ok) {
                const errorText = await response.text()
                console.error("Error response:", errorText)
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const contentType = response.headers.get("content-type")
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text()
                console.error("Received non-JSON response:", text)
                throw new Error("Server returned non-JSON response")
            }

            const data = await response.json()

            setMessages(prev => [
                ...prev,
                { role: "assistant", content: data.response || "Sorry, I couldn't process that." },
            ])
        } catch (error) {
            console.error("Chat error:", error)

            let errorMessage = t(
                "Sorry, I encountered an error. Please make sure the backend server is running on " + API_BASE_URL,
                "Paumanhin, may naganap na error. Siguraduhing tumatakbo ang backend server sa " + API_BASE_URL
            )

            if (error instanceof TypeError && error.message.includes("fetch")) {
                errorMessage = t(
                    "Cannot connect to backend server. Please check if it's running on " + API_BASE_URL,
                    "Hindi makakonekta sa backend server. Pakitingnan kung tumatakbo ito sa " + API_BASE_URL
                )
            }

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: errorMessage,
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const suggestedQuestions = [
        {
            en: "What is the total education budget for 2025?",
            fil: "Magkano ang kabuuang badyet para sa edukasyon noong 2025?",
        },
        {
            en: "How does the GAB become the GAA?",
            fil: "Paano nagiging GAA ang GAB?",
        },
        {
            en: "Which region has the highest infrastructure spending?",
            fil: "Aling rehiyon ang may pinakamataas na gastos sa imprastraktura?",
        },
    ]

    const handleSuggestionClick = (question: string) => {
        setInput(question)
    }

    return (
        <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        {msg.role === "assistant" && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                                <Bot className="h-5 w-5 text-accent" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === "user"
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-foreground"
                                }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.content}
                            </p>
                        </div>
                        {msg.role === "user" && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
                                <User className="h-5 w-5 text-accent-foreground" />
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                            <Bot className="h-5 w-5 text-accent" />
                        </div>
                        <div className="bg-muted rounded-lg px-4 py-2">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && !isLoading && (
                <div className="px-4 pb-4 space-y-2">
                    <p className="text-xs text-muted-foreground mb-2">
                        {t("Try asking:", "Subukan tanungin:")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSuggestionClick(t(q.en, q.fil))}
                                className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors text-left"
                            >
                                {t(q.en, q.fil)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="border-t border-border p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSubmit(e)
                            }
                        }}
                        placeholder={t(
                            "Ask about the Philippine budget...",
                            "Magtanong tungkol sa badyet ng Pilipinas..."
                        )}
                        disabled={isLoading}
                        className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim() || isLoading}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}