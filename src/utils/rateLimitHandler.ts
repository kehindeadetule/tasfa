// Rate limiting and error handling utilities
export interface RateLimitOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  showNotification?: boolean;
}

export class RateLimitHandler {
  private static instance: RateLimitHandler;
  private retryCounts = new Map<string, number>();

  static getInstance(): RateLimitHandler {
    if (!RateLimitHandler.instance) {
      RateLimitHandler.instance = new RateLimitHandler();
    }
    return RateLimitHandler.instance;
  }

  async handleRateLimit<T>(
    fn: () => Promise<T>,
    options: RateLimitOptions = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      baseDelay = 2000,
      maxDelay = 30000,
      showNotification = true,
    } = options;

    const fnKey = fn.toString();
    let retryCount = this.retryCounts.get(fnKey) || 0;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn();
        // Reset retry count on success
        this.retryCounts.set(fnKey, 0);
        return result;
      } catch (error: any) {
        if (error.status === 429 && attempt < maxRetries) {
          retryCount++;
          this.retryCounts.set(fnKey, retryCount);

          if (showNotification) {
            this.showRateLimitNotification(attempt + 1, maxRetries);
          }

          const delay = Math.min(
            baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
            maxDelay
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }

    throw new Error("Max retries exceeded");
  }

  private showRateLimitNotification(attempt: number, maxRetries: number): void {
    if (typeof window === "undefined") return;

    // Create a simple notification
    const notification = document.createElement("div");
    notification.className = `
      fixed top-4 right-4 bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded z-50
      transform transition-all duration-300 ease-in-out
    `;
    notification.innerHTML = `
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">
            High traffic detected. Retrying... (${attempt}/${maxRetries})
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  resetRetryCount(fnKey?: string): void {
    if (fnKey) {
      this.retryCounts.delete(fnKey);
    } else {
      this.retryCounts.clear();
    }
  }
}

// Utility function for fetch with rate limit handling
export const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  rateLimitOptions: RateLimitOptions = {}
): Promise<Response> => {
  const handler = RateLimitHandler.getInstance();

  return handler.handleRateLimit(async () => {
    const response = await fetch(url, options);
    if (response.status === 429) {
      const error: any = new Error("Rate limited");
      error.status = 429;
      throw error;
    }
    return response;
  }, rateLimitOptions);
};

// Batch request utility
export const batchVotingData = async (): Promise<{
  status: any;
  counts: any;
}> => {
  const handler = RateLimitHandler.getInstance();

  return handler.handleRateLimit(async () => {
    const [statusResponse, countsResponse] = await Promise.all([
      fetch("/api/votes/voting-status"),
      fetch("/api/votes/counts"),
    ]);

    if (!statusResponse.ok || !countsResponse.ok) {
      throw new Error("Failed to fetch voting data");
    }

    const [statusData, countsData] = await Promise.all([
      statusResponse.json(),
      countsResponse.json(),
    ]);

    return { status: statusData, counts: countsData };
  });
};
