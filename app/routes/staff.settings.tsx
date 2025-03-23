import { Link, useOutletContext } from "@remix-run/react";
import CollaspableContent from "~/components/common/CollaspableContent";
import IconButton from "~/components/common/IconButton";
import { Logout } from "~/components/common/Icons";
import UserInfo from "~/components/common/UserInfo";
import { IUser } from "~/models/user";
import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { auth } from "~/utilties/auth.server";
import { avatar } from "~/utilties/avatar.server";
import mutate from "~/utilties/mutate.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Settings" },
    { name: "Vivo: Settings", content: "Settings page" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["rd", "admin"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "update.userInfo":
      const success = await avatar.upload(request, values);
      if (success) {
        return mutate(request.url, {
          message: "Uploaded avatar",
          level: "success",
        });
      } else {
        return mutate(request.url, {
          message: "Failed to upload avatar",
          level: "failure",
        });
      }
  }
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
        {/* <ModeToggle></ModeToggle> */}
        <CollaspableContent title="User Info">
          <UserInfo user={context.user} />
        </CollaspableContent>
      </section>
    </main>
  );
}
