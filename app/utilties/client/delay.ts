export async function delay<T>(data: T) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return data;
}
