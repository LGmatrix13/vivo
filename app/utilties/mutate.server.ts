import { redirect } from "@remix-run/node";
import { toastCookie } from "./toast.server";

export default async function mutate(
  url: string,
  toast?: { message: string; level: "success" | "failure" }
) {
  if (toast) {
    const cookie = await toastCookie.serialize(toast);
    return redirect(`${url}`, {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  } else {
    return redirect(url);
  }
}
