import { createCookie, json } from "@remix-run/node";

export const toastCookie = createCookie("toast", {
  maxAge: 60,
});

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
