import type { ChatMessage } from "@electrozone/shared";
import { api } from "./api-client";

export type { ChatMessage };

export async function askAssistant(
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const { reply } = await api.askAssistant(history, userMessage);
  return reply;
}