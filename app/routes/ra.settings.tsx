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
import { toast } from "~/utilties/toast.server";
import { Toast } from "~/components/common/Toast";
import mutate from "~/utilties/mutate.server";
import { files } from "~/utilties/files.server";

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
  await auth.rejectUnauthorized(request, ["ra"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "update.userInfo":
      const file = values["avatar"] as File;
      if (
        !files.checkExtension(file.name, ".png") ||
        !files.checkExtension(file.name, ".jpeg")
      ) {
        return mutate(request.url, {
          message: "File must be an image",
          level: "failure",
        });
      }

      const success = await avatar.upload(request, values);

      if (success) {
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
  const context = useOutletContext<{
    user: IUser;
  }>();
  const data = useLoaderData<typeof loader>();
  return (
    <main className="max-w-screen-2xl mx-auto px-10 mb-7">
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
      {data.toast && (
        <Toast level={data.toast.level}>{data.toast.message}</Toast>
      )}
    </main>
  );
}
