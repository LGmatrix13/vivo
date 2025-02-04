import { Form, Link, useOutletContext } from "@remix-run/react";
import CollaspableContent from "~/components/common/CollaspableContent";
import IconButton from "~/components/common/IconButton";
import { Logout } from "~/components/common/Icons";
import UserInfo from "~/components/common/UserInfo";
import { IUser } from "~/models/user";
import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { auth } from "~/utilties/auth.server";
import { avatar } from "~/utilties/avatar.server";
import UploadAvatarForm from "~/components/forms/UploadAvatarForm";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Settings" },
    { name: "Vivo: Settings", content: "Settings page" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  return avatar.upload(request);
}

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
        <CollaspableContent title="User Info">
          <UserInfo user={context.user} />
        </CollaspableContent>
      </section>
    </main>
  );
}
