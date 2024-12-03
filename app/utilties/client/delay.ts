import { useNavigation } from "@remix-run/react";

export async function delay<T>(data: T) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return data;
}
