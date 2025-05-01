/**
 * Pauses execution for a specified number of milliseconds.
 *
 * @param ms The number of milliseconds to sleep.
 * @returns A Promise that resolves after the specified time.
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
