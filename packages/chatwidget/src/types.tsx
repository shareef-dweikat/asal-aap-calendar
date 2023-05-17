export interface AssistantMessage {
    content: string,
    role: string,
}

export interface Choice {
    message: AssistantMessage,
    finish_reason?: string,
}