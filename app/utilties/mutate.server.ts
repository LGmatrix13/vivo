import { redirect } from "@remix-run/node";
import { createCookie } from "@remix-run/node";

export const toasts = createCookie("toast", {
  maxAge: 60,
});

export default async function mutate(
  url: string,
  toast?: { message: string; level: "success" | "failure" }
) {
  if (toast) {
    console.log(toast);
    const cookie = await toasts.serialize(toast);
    return redirect(`${url}`, {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  } else {
    return redirect(url);
  }
}
