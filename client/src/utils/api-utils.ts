// API utilities for handling rate limiting and debouncing

// Type guard for axios errors
function isAxiosError(error: unknown): error is { response?: { status?: number }; code?: string; message?: string } {
    return typeof error === 'object' && error !== null && 'response' in error;
}

/**
 * Retry function with exponential backoff
 * @param fn The function to retry
 * @param maxRetries Maximum number of retries
 * @param baseDelay Base delay in milliseconds
 * @returns Promise that resolves with the function result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;

      // If it's a rate limit error and we haven't exceeded max retries, continue
      if (isAxiosError(error) && error.response?.status === 429 && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Rate limited, retrying in ${delay}ms... (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // For other errors or if we've exceeded max retries, break
      break;
    }
  }

  throw lastError;
}

/**
 * Simple delay utility
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms)); 