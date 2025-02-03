import { Link, useOutletContext } from "@remix-run/react";
import CollaspableContent from "~/components/common/CollaspableContent";
import IconButton from "~/components/common/IconButton";
import { Logout } from "~/components/common/Icons";
import UserInfo from "~/components/common/UserInfo";
import { IUser } from "~/models/user";
import ModeToggle from "~/components/common/ModeToggle";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Settings" },
    { name: "Vivo: Settings", content: "Settings page" },
  ];
};

export default function StaffSettings() {
  const context = useOutletContext<{
    user: IUser;
  }>();
  return (
    <main className="max-w-screen-2xl mx-auto px-7 mb-7">
      <section className="space-y-5">
        <Link to="/auth/logout">
          <IconButton Icon={Logout} className="ml-auto order-2">
            Logout
          </IconButton>
        </Link>
        {/* <ModeToggle></ModeToggle> */}
        <CollaspableContent title="User Info" collasped>
          <UserInfo user={context.user} />
        </CollaspableContent>
      </section>
    </main>
  );
}
