import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import CollaspableContent from "~/components/common/CollaspableContent";
import IconButton from "~/components/common/IconButton";
import { Logout } from "~/components/common/Icons";
import UserInfo from "~/components/common/UserInfo";
import { IUser } from "~/models/user";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { auth } from "~/utilties/auth.server";
import { avatar } from "~/utilties/avatar.server";
import mutate from "~/utilties/mutate.server";
import WideButton from "~/components/common/WideButton";
import { files } from "~/utilties/files.server";
import { toast } from "~/utilties/toast.server";
import { Toast } from "~/components/common/Toast";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Settings" },
    { name: "Vivo: Settings", content: "Settings page" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return toast(request, {});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "update.userInfo":
      await auth.rejectUnauthorized(request, ["rd", "admin"]);
      const file = values["avatar"] as File;

      if (
        !files.checkExtension(file.name, ".png") &&
        !files.checkExtension(file.name, ".jpeg")
      ) {
        return mutate(request.url, {
          message: "File must be an image",
          level: "failure",
        });
      }

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
  }
}

export default function StaffSettings() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<{
    user: IUser;
  }>();
  const admin = context.user.role === "admin";
  return (
    <main className="max-w-screen-2xl mx-auto md:px-10 px-7 mb-7">
      <section className="space-y-5">
        <Link to="/auth/logout">
          <IconButton Icon={Logout} className="ml-auto order-2">
            Logout
          </IconButton>
        </Link>
        <CollaspableContent title="User Info">
          <UserInfo user={context.user} />
        </CollaspableContent>
        {admin && (
          <CollaspableContent title="Backups" collasped>
            <div className="space-y-3 flex flex-col">
              <h3 className="font-bold">Download Backup</h3>
              <p>Backups are executed nightly at midnight.</p>
              <a href="/backup.vivo">
                <WideButton>Download Latest Backup</WideButton>
              </a>
            </div>
          </CollaspableContent>
        )}
      </section>
      {data.toast && (
        <Toast level={data.toast.level}>{data.toast.message}</Toast>
      )}
    </main>
  );
}
