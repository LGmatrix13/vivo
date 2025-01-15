import { IUser } from "~/models/user";

interface IUserInfoProps {
  user: IUser;
}

export default function UserInfo(props: IUserInfoProps) {
  const { user } = props;
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
        <p>{user.role}</p>
      </div>
    </>
  );
}
