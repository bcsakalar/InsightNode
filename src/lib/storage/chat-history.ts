// ============================================================================
// Chat History Storage — localStorage persistence for conversation context
// ============================================================================

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: number;
    chartId?: string;
    generatedQuery?: string;
}

const CHAT_KEY = "insightnode_chat_history";
const MAX_MESSAGES = 20;

/** Get chat history from localStorage */
export function getChatHistory(): ChatMessage[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(CHAT_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as ChatMessage[];
    } catch {
        return [];
    }
}

/** Add a message to chat history */
export function addChatMessage(message: Omit<ChatMessage, "timestamp">): void {
    const history = getChatHistory();
    history.push({ ...message, timestamp: Date.now() });
    // Keep only last MAX_MESSAGES
    const trimmed = history.slice(-MAX_MESSAGES);
    localStorage.setItem(CHAT_KEY, JSON.stringify(trimmed));
}

/** Clear chat history */
export function clearChatHistory(): void {
    localStorage.removeItem(CHAT_KEY);
}
