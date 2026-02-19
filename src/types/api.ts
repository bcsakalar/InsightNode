// ============================================================================
// API Response Type Definitions
// ============================================================================

/** Standard API response wrapper for consistent error handling */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

/** Connection test response */
export interface ConnectionTestResponse {
    connected: boolean;
    message: string;
}

/** Chat message for multi-turn conversation */
export interface ConversationMessage {
    role: "user" | "assistant";
    content: string;
}
