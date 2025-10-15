"use client"

import { useState, useEffect } from "react" // <-- IMPORT useEffect
import { Send, Loader2, Bot, User } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define a structure for the translated dataset
interface TranslatedAnswer {
    en: string
    fil: string
}

// Map of English questions to their translated answers (as provided in the previous response)
const translatedDataset: Record<string, TranslatedAnswer> = {
    "What is the total education budget for 2025?": {
        en: "The total education budget for 2025 is ₱924.7 billion, accounting for about 16% of the national budget.",
        fil: "Ang kabuuang badyet para sa edukasyon noong 2025 ay ₱924.7 bilyon, na umaabot sa humigit-kumulang 16% ng pambansang badyet.",
    },
    "How does the GAB become the GAA?": {
        en: "The General Appropriations Bill (GAB) becomes the General Appropriations Act (GAA) after it is passed by Congress and signed into law by the President.",
        fil: "Ang General Appropriations Bill (GAB) ay nagiging General Appropriations Act (GAA) matapos itong ipasa ng Kongreso at lagdaan bilang batas ng Pangulo.",
    },
    "Which region has the highest infrastructure spending?": {
        en: "For 2025, the National Capital Region (NCR) and Region III received the highest infrastructure allocations due to major public works and transport projects.",
        fil: "Para sa 2025, ang National Capital Region (NCR) at Rehiyon III ang nakatanggap ng pinakamataas na alokasyon para sa imprastraktura dahil sa malalaking pampublikong gawa at proyektong pangtransportasyon.",
    },
    "What are the biggest budget allocations by sector?": {
        en: "The largest allocations go to Education, Public Works, Health, and Defense sectors.",
        fil: "Ang pinakamalaking alokasyon ay napupunta sa mga sektor ng Edukasyon, Public Works, Kalusugan, at Depensa.",
    },
    "How much is allocated for health services?": {
        en: "The Department of Health and PhilHealth together received about ₱342 billion in the 2025 national budget.",
        fil: "Ang Department of Health at PhilHealth, pinagsama, ay nakatanggap ng humigit-kumulang ₱342 bilyon sa pambansang badyet ng 2025.",
    },
    "Which agencies got increased funding this year?": {
        en: "Education agencies like DepEd and SUCs, as well as DPWH and DOH, saw increases in their 2025 allocations.",
        fil: "Ang mga ahensya sa edukasyon tulad ng DepEd at SUCs, pati na rin ang DPWH at DOH, ay nakakita ng pagtaas sa kanilang 2025 alokasyon.",
    },
    "What percentage of the budget goes to debt servicing?": {
        en: "Roughly 28% of the 2025 budget is allocated to debt servicing, including interest and principal payments.",
        fil: "Tinatayang 28% ng badyet ng 2025 ay inilaan para sa debt servicing, kasama ang interes at principal payments.",
    },
    "How much is the budget for disaster risk management?": {
        en: "About ₱31 billion was allocated for disaster risk reduction and management programs in 2025.",
        fil: "Humigit-kumulang ₱31 bilyon ang inilaan para sa disaster risk reduction at management programs noong 2025.",
    },
    "How does the government ensure transparency in spending?": {
        en: "Transparency is maintained through the DBM’s Budget Transparency Portal, COA audit reports, and public access to the GAA online.",
        fil: "Ang transparency ay pinapanatili sa pamamagitan ng Budget Transparency Portal ng DBM, COA audit reports, at pampublikong access sa GAA online.",
    },
    "What is the role of DBM in the budget process?": {
        en: "The Department of Budget and Management (DBM) prepares, reviews, and releases the national budget in line with government priorities.",
        fil: "Ang Department of Budget and Management (DBM) ang naghahanda, nagrerepaso, at naglalabas ng pambansang badyet alinsunod sa mga prayoridad ng gobyerno.",
    },
    "What’s the difference between capital and operating expenses?": {
        en: "Capital expenses refer to investments in long-term assets like infrastructure, while operating expenses cover daily operational costs like salaries and maintenance.",
        fil: "Ang capital expenses ay tumutukoy sa mga pamumuhunan sa pangmatagalang asset tulad ng imprastraktura, habang ang operating expenses ay sumasaklaw sa pang-araw-araw na gastos sa operasyon tulad ng suweldo at maintenance.",
    },
    "Can I see the budget by region or province?": {
        en: "Yes, regional and provincial budget breakdowns are available on the DBM’s Budget and Treasury Management System (BTMS) and the DBM website.",
        fil: "Oo, ang mga breakdown ng badyet ayon sa rehiyon at lalawigan ay makikita sa Budget and Treasury Management System (BTMS) at sa website ng DBM.",
    },
}

export function ChatPiso() {
    const { t, language } = useLanguage()

    // Define the initial message based on the current language
    const initialWelcomeMessage = t(
        "Hello! I'm Piso, your AI budget assistant. Ask me anything about the Philippine budget!",
        "Kamusta! Ako si Piso, ang iyong AI budget assistant. Tanungin mo ako tungkol sa badyet ng Pilipinas!"
    )
    
    // Initialize state with the translated message
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: initialWelcomeMessage,
        },
    ])

    // --- FIX: Use useEffect to update the welcome message when the language changes ---
    useEffect(() => {
        const newWelcomeMessage = t(
            "Hello! I'm Piso, your AI budget assistant. Ask me anything about the Philippine budget!",
            "Kamusta! Ako si Piso, ang iyong AI budget assistant. Tanungin mo ako tungkol sa badyet ng Pilipinas!"
        )

        setMessages((prevMessages) => {
            // Check if the first message (the welcome message) needs to be updated
            if (prevMessages.length > 0 && prevMessages[0].role === 'assistant') {
                return [
                    { ...prevMessages[0], content: newWelcomeMessage }, // Update the content of the first message
                    ...prevMessages.slice(1) // Keep the rest of the conversation
                ]
            }
            // If the message list is empty, just set the new message
            return [{ role: "assistant", content: newWelcomeMessage }]
        })
    }, [t, language]) // Depend on 't' and 'language' to re-run when the language changes
    // ---------------------------------------------------------------------------------


    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // 🧠 Suggestions
    const suggestions = [
        { en: "What is the total education budget for 2025?", fil: "Magkano ang kabuuang badyet para sa edukasyon noong 2025?" },
        { en: "How does the GAB become the GAA?", fil: "Paano nagiging GAA ang GAB?" },
        { en: "Which region has the highest infrastructure spending?", fil: "Aling rehiyon ang may pinakamataas na gastos sa imprastraktura?" },
        { en: "What are the biggest budget allocations by sector?", fil: "Ano ang pinakamalalaking alokasyon sa badyet ayon sa sektor?" },
        { en: "How much is allocated for health services?", fil: "Magkano ang inilaan para sa mga serbisyong pangkalusugan?" },
        { en: "Which agencies got increased funding this year?", fil: "Aling mga ahensya ang nadagdagan ang pondo ngayong taon?" },
        { en: "What percentage of the budget goes to debt servicing?", fil: "Ilang porsiyento ng badyet ang napupunta sa pagbabayad ng utang?" },
        { en: "How much is the budget for disaster risk management?", fil: "Magkano ang badyet para sa pamamahala ng sakuna?" },
        { en: "How does the government ensure transparency in spending?", fil: "Paano sinisiguro ng gobyerno ang transparency sa paggastos?" },
        { en: "What is the role of DBM in the budget process?", fil: "Ano ang papel ng DBM sa proseso ng badyet?" },
        { en: "What’s the difference between capital and operating expenses?", fil: "Ano ang pagkakaiba ng capital at operating expenses?" },
        { en: "Can I see the budget by region or province?", fil: "Makikita ko ba ang badyet ayon sa rehiyon o lalawigan?" },
    ]

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()

        const suggestionMatch = suggestions.find(
            (s) => s.en === userMessage || s.fil === userMessage
        )
        const datasetKey = suggestionMatch?.en || userMessage

        setInput("")
        setMessages((prev) => [...prev, { role: "user", content: userMessage }])
        setIsLoading(true)

        setTimeout(() => {
            let answerContent: string

            if (translatedDataset[datasetKey]) {
                const answer = translatedDataset[datasetKey]
                answerContent = language === 'fil' ? answer.fil : answer.en
            } else {
                answerContent = t(
                    "The information you requested is currently unavailable or has not yet been included in the Piso dataset.",
                    "Ang impormasyong iyong hiniling ay kasalukuyang hindi magagamit o hindi pa kasama sa Piso dataset."
                )
            }

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: answerContent },
            ])
            setIsLoading(false)
        }, 1000)
    }

    const handleSuggestionClick = (question: string) => {
        setInput(question)
    }

    return (
        <div className="flex flex-col h-[600px] rounded-2xl border border-border bg-background/60 backdrop-blur-lg">
            {/* Chat messages */}
            <div
                className="flex-1 p-4 space-y-4 overflow-y-auto"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "transparent transparent",
                }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {msg.role === "assistant" && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                                <Bot className="h-5 w-5 text-accent" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === "user"
                                    ? "bg-accent text-accent-foreground"
                                    : "bg-muted/60 text-foreground"
                                }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
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
                        <div className="bg-muted/60 rounded-lg px-4 py-2">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
            </div>

            {/* Dropdown Suggestions */}
            <div className="px-4 pb-3 border-t border-border bg-background/40 backdrop-blur-sm">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center justify-center w-full rounded-lg border border-border bg-card/40 hover:bg-muted/40 text-sm px-4 py-2 my-3 transition-colors">
                            {t("Select a suggested question...", "Pumili ng mungkahing tanong...")}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="max-h-60 overflow-y-auto bg-background/80 backdrop-blur-md border border-border/40"
                        style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "transparent transparent",
                        }}
                    >
                        {suggestions.map((q, idx) => (
                            <DropdownMenuItem
                                key={idx}
                                onClick={() => handleSuggestionClick(t(q.en, q.fil))}
                                className="text-sm cursor-pointer hover:bg-accent/10 transition-colors"
                            >
                                {t(q.en, q.fil)}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Input box */}
            <div className="border-t border-border p-4 bg-background/50 backdrop-blur-sm">
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
                        className="flex-1 rounded-lg border border-border bg-background/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 placeholder:text-muted-foreground/70"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim() || isLoading}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 transition"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </div>
    )
}