export interface Tenant {
  id: number
  name: string
  slug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  // ✅ Các field về giới hạn và sử dụng
  usedAccounts: number
  usedSKUs: number
  currentConcurrentUsers: number
  maxAccounts: number
  maxSKUs: number
  maxConcurrentUsers: number
  expirationDate?: string

  aiChatEnabled: boolean          // Bật/tắt AI chat
  aiProvider: string | null       // Provider: openai, gemini, claude
  aiModel: string | null          // Model name
  aiSystemPrompt: string | null   // Custom system prompt
  aiTemperature: number | null    // 0-2: Creativity level
  aiMaxTokens: number | null      // Max tokens per response
  aiAutoReplyDelay: number | null // Delay in milliseconds
  apiKey: string | null           // API key cho AI provider
}

export interface TenantResponse {
  data: Tenant[]
  total: number
  page: number
  pageCount: number
}