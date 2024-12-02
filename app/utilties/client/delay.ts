import { useNavigation } from "@remix-run/react";

export async function delay<T>(data: T) {
  const state = useNavigation();
  await new Promise((resolve) => setTimeout(resolve, 300));
  return data;
}
