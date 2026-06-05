export const chatbotConfig = {
  backendUrl: import.meta.env.VITE_CHATBOT_BACKEND_URL || '',
  enabled: Boolean(import.meta.env.VITE_CHATBOT_BACKEND_URL),
}
