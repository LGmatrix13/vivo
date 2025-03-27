import { Link, useFetcher, useOutletContext } from "@remix-run/react";
import CollaspableContent from "~/components/common/CollaspableContent";
import IconButton from "~/components/common/IconButton";
import { Logout } from "~/components/common/Icons";
import UserInfo from "~/components/common/UserInfo";
import { IUser } from "~/models/user";
import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { auth } from "~/utilties/auth.server";
import { avatar } from "~/utilties/avatar.server";
import mutate from "~/utilties/mutate.server";
import WideButton from "~/components/common/WideButton";
import { backup } from "~/utilties/backup.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Settings" },
    { name: "Vivo: Settings", content: "Settings page" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "update.userInfo":
      await auth.rejectUnauthorized(request, ["rd", "admin"]);

      const avatarSuccess = await avatar.upload(request, values);
      if (avatarSuccess) {
        return mutate(request.url, {
          message: "Uploaded avatar",
          level: "success",
        });
      }

      return mutate(request.url, {
        message: "Failed to upload avatar",
        level: "failure",
      });
    case "create.backup":
      await auth.rejectUnauthorized(request, ["admin"]);
      const backupSuccess = await backup.export();

      if (backupSuccess) {
        return mutate(request.url, {
          message: "Backed up Vivo",
          level: "success",
        });
      }

      return mutate(request.url, {
        message: "Failed to backup Vivo",
        level: "failure",
      });
  }
}

export default function StaffSettings() {
  const context = useOutletContext<{
    user: IUser;
  }>();
  const admin = context.user.role === "admin";
  const fetcher = useFetcher();
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
        {admin && (
          <CollaspableContent title="Backups" collasped>
            <div className="space-y-3">
              <h3 className="font-bold">Download Backup</h3>
              <p>Backups are executed nightly at midnight.</p>
              <a href="/backup.vivo">Download Backup</a>
            </div>
          </CollaspableContent>
        )}
      </section>
    </main>
  );
}
