/**
 * server-side dlay to show the loading indicattor for a certain number of ms
 */
export async function delay(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
