import Form from "../common/Form";

/**
 * form to show user info on the settings page
 */
export default function UserInfoForm() {
  return (
    <Form encType="multipart/form-data" intent="update.userInfo" button="Save">
      <div className="space-y-3">
        <label htmlFor="avatar" className="font-bold">
          Avatar
        </label>
        <input
          type="file"
          name="avatar"
          accept="image/png"
          className="w-full border-gray-300 file:border-0 file:bg-gray-100 file:text-black border rounded-lg border-input mr-5 file:cursor-pointer file:px-3 file:py-2 file:me-3"
          required
        />
      </div>
    </Form>
  );
}
