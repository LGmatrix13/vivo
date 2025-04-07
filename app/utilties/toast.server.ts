import { createCookie, json } from "@remix-run/node";

/**
 * cookie to store toast state
 */
export const toastCookie = createCookie("toast", {
  maxAge: 60,
});

/**
 * creates toast
 */
export async function toast<T extends Record<string, any> | undefined>(
  request: Request,
  extra: T
) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await toastCookie.parse(cookieHeader);

  if (cookie) {
    const newCookie = await toastCookie.serialize("");

    return json(
      {
        toast: cookie,
        extra: extra, // Ensure `extra` is explicitly set to null if undefined
      },
      {
        headers: {
          "Set-Cookie": newCookie,
        },
      }
    );
  }

  return json({
    toast: null,
    extra: extra, // Ensure `extra` is explicitly set to null if undefined
  });
}
