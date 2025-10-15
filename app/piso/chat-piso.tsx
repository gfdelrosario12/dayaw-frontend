"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, Bot, User } from "lucide-react"
import { useLanguage } from "@/context/language-context"

// Removed: const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api"

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

        // START: Simulated Backend Response
        try {
            // Simulate a network delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Simulated AI response based on the user's message
            let simulatedResponse: string
            const lowerCaseMessage = userMessage.toLowerCase()

            if (lowerCaseMessage.includes(t("education", "edukasyon"))) {
                simulatedResponse = t(
                    "The education sector usually receives the largest share of the national budget, mandated by the Philippine Constitution.",
                    "Ang sektor ng edukasyon ay karaniwang tumatanggap ng pinakamalaking bahagi ng pambansang badyet, ayon sa mandato ng Saligang Batas ng Pilipinas."
                )
            } else if (lowerCaseMessage.includes(t("gab", "gab")) || lowerCaseMessage.includes(t("gaa", "gaa"))) {
                simulatedResponse = t(
                    "The General Appropriations Bill (GAB) becomes the General Appropriations Act (GAA) upon enactment by the President.",
                    "Ang General Appropriations Bill (GAB) ay nagiging General Appropriations Act (GAA) kapag pinagtibay ito ng Pangulo."
                )
            } else if (lowerCaseMessage.includes(t("infrastructure", "imprastraktura"))) {
                simulatedResponse = t(
                    "Infrastructure spending is a key component of the budget, aimed at national development projects.",
                    "Ang paggasta sa imprastraktura ay isang pangunahing bahagi ng badyet, na naglalayong sa mga proyekto para sa pambansang kaunlaran."
                )
            } else {
                simulatedResponse = t(
                    "That's an interesting question! For now, I can only provide general information about the Philippine budget process and its major allocations.",
                    "Interesante ang tanong mo! Sa ngayon, maaari lang akong magbigay ng pangkalahatang impormasyon tungkol sa proseso ng badyet ng Pilipinas at ang mga pangunahing alokasyon nito."
                )
            }

            setMessages(prev => [
                ...prev,
                { role: "assistant", content: simulatedResponse },
            ])
        } catch (error) {
            console.error("Simulated Chat error:", error)
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: t(
                        "Sorry, a simulated error occurred.",
                        "Paumanhin, nagkaroon ng kunwaring error."
                    ),
                },
            ])
        } finally {
            setIsLoading(false)
        }
        // END: Simulated Backend Response
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