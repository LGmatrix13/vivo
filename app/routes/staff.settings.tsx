import { Link, useOutletContext } from "@remix-run/react";
import CollaspableContent from "~/components/common/CollaspableContent";
import IconButton from "~/components/common/IconButton";
import { Logout } from "~/components/common/Icons";
import UserInfo from "~/components/common/UserInfo";
import { IUser } from "~/models/user";

export default function StaffSettings() {
  const context = useOutletContext<{
    user: IUser;
  }>();
  return (
    <section className="space-y-5">
      <Link to="/auth/logout">
        <IconButton Icon={Logout} className="ml-auto order-2">
          Logout
        </IconButton>
      </Link>
      <CollaspableContent title="User Info" collasped>
        <UserInfo user={context.user} />
      </CollaspableContent>
      <CollaspableContent title="Integrations" collasped>
        <p>TODO</p>
      </CollaspableContent>
    </section>
  );
}
