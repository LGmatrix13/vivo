import { redirect } from "@remix-run/node";
import { toastCookie } from "./toast.server";

/**
 * used to send data back to client after a POST on server. used for toasts
 */
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
