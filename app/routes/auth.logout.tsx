import { auth } from "~/utilties/auth.server";

export async function loader() {
  return auth.logout();
}
