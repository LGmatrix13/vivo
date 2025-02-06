import { LoaderFunctionArgs } from "@remix-run/node";
import { Role } from "~/models/role";
import { avatar } from "~/utilties/avatar.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { role, id } = params;

  if (role && id) {
    const exists = await avatar.exists(Number(id), role as Role);
    if (exists) {
      const stream = await avatar.fileStream(Number(id), role as Role);
      return new Response(stream, {
        headers: {
          "Content-Type": "image/webp",
        },
      });
    }
  }

  const stream = await avatar.defaultFileStream();
  return new Response(stream, {
    headers: {
      "Content-Type": "image/webp",
    },
  });
}
