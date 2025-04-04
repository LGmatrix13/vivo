import { IUser } from "~/models/user";
import UploadAvatarForm from "../forms/UserInfoForm";
import WideButton from "./WideButton";
import { DrawerButton, DrawerContent, DrawerProvider } from "./Drawer";

interface IUserInfoProps {
  user: IUser;
}

export default function UserInfo(props: IUserInfoProps) {
  const { user } = props;
  const formattedRoles = {
    admin: "Admin",
    rd: "RD",
    ra: "RA",
    ard: "ARD",
    resident: "Resident",
  };
  if (user.role.toLowerCase() === "resident") {
    return (
      <>
        <div className="space-y-3">
          <h3 className="font-bold">Name</h3>
          <p>
            {user.firstName} {user.lastName}
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="font-bold">Email</h3>
          <p>{user.email}</p>
        </div>
        <div className="space-y-3">
          <h3 className="font-bold">Role</h3>
          <p>{formattedRoles[user.role]}</p>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="space-y-3">
        <h3 className="font-bold">Name</h3>
        <p>
          {user.firstName} {user.lastName}
        </p>
      </div>
      <div className="space-y-3">
        <h3 className="font-bold">Email</h3>
        <p>{user.email}</p>
      </div>
      <div className="space-y-3">
        <h3 className="font-bold">Role</h3>
        <p>{formattedRoles[user.role]}</p>
      </div>
      <div className="space-y-3">
        <h3 className="font-bold">Avatar</h3>
        <img
          src={`/avatars/${user.role}/${user.id}`}
          className="w-7 h-7 rounded-full"
        />
      </div>
      <DrawerProvider>
        <DrawerContent>
          <h1 className="font-bold text-xl">Edit User Info</h1>
          <UploadAvatarForm />
        </DrawerContent>
        <DrawerButton>
          <WideButton>Edit User Info</WideButton>
        </DrawerButton>
      </DrawerProvider>
    </>
  );
}
