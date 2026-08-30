const DEFAULT_API_URL = 'https://msrathaur-manish-portfolio-api.hf.space'

export const PORTFOLIO_API_URL = (
  import.meta.env.VITE_PORTFOLIO_API_URL || DEFAULT_API_URL
).replace(/\/+$/, '')

export async function portfolioApiFetch(path, options = {}, timeoutMs = 45_000) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(`${PORTFOLIO_API_URL}${path}`, {
      ...options,
      signal: controller.signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The assistant took too long to respond. Please try again.')
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

let warmupPromise

export function warmPortfolioApi() {
  if (!warmupPromise) {
    warmupPromise = portfolioApiFetch('/health', {}, 10_000).catch(() => null)
  }
  return warmupPromise
}
