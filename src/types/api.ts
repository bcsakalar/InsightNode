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
