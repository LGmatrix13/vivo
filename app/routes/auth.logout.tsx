import { auth } from "~/utilties/auth.server";

export function loader() {
  return auth.logout();
}
