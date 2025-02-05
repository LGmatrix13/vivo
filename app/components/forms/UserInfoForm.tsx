import { useFetcher } from "@remix-run/react";
import Loading from "../common/Loading";
import WideButton from "../common/WideButton";
import Form from "../common/Form";

export default function UserInfoForm() {
  const fetcher = useFetcher();

  return (
    <Form encType="multipart/form-data" intent="update.userInfo" button="Save">
      <div className="space-y-3">
        <label htmlFor="avatar" className="font-bold">
          Avatar
        </label>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          className="w-full file:border-0 file:bg-gray-50 file:text-black border rounded-lg border-input mr-5 file:cursor-pointer file:px-3 file:py-2 file:me-3"
          required
        />
      </div>
    </Form>
  );
}
