// ============================================================================
// Gemini AI Client
// ============================================================================
// Thin wrapper around the @google/genai SDK.
// Provides a configured GoogleGenAI instance and a helper for tool-calling.
// ============================================================================

import { GoogleGenAI, FunctionCallingConfigMode } from "@google/genai";
import type { FunctionDeclaration, GenerateContentResponse } from "@google/genai";

/** Lazy-initialized Gemini client singleton */
let aiInstance: GoogleGenAI | null = null;

/**
 * Get or create the GoogleGenAI instance.
 * Uses GEMINI_API_KEY from environment variables.
 */
export function getGeminiClient(): GoogleGenAI {
    if (!aiInstance) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error(
                "GEMINI_API_KEY environment variable is not set. " +
                "Please add it to your .env.local file."
            );
        }
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
}

/** Model to use for all Gemini requests */
export const GEMINI_MODEL = "gemini-3-flash-preview";

/**
 * Generate content with function calling tools.
 * Uses the ANY function calling mode to force the model to always call a function.
 *
 * @param prompt - The user/system prompt content
 * @param functionDeclarations - Tool declarations for function calling
 * @returns The raw Gemini response
 */
export async function generateWithTools(
    prompt: string,
    functionDeclarations: FunctionDeclaration[]
): Promise<GenerateContentResponse> {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
            tools: [{ functionDeclarations }],
            toolConfig: {
                functionCallingConfig: {
                    mode: FunctionCallingConfigMode.ANY,
                },
            },
        },
    });

    return response;
}
