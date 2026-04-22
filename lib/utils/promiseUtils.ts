const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const TIMEOUT = 2 * 60 * 1000;

const wait = (time: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, Math.max(0, time));
  });

export const fetchWithRetry = async (
  url: string,
  options?: RequestInit,
  retryOptions: {
    maxRetries?: number;
    delay?: number;
    timeOut?: number;
  } = {},
): Promise<Response> => {
  const {
    maxRetries = MAX_RETRIES,
    delay = RETRY_DELAY,
    timeOut = TIMEOUT,
  } = retryOptions;

  try {
    const controller = new AbortController();
    const timerId = setTimeout(() => controller.abort(), timeOut);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timerId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }

    if (maxRetries <= 0) {
      throw error;
    }

    await wait(delay);
    return fetchWithRetry(url, options, {
      maxRetries: maxRetries - 1,
      delay,
      timeOut,
    });
  }
};
