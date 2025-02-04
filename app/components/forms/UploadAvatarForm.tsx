import { useFetcher } from "@remix-run/react";
import Loading from "../common/Loading";
import WideButton from "../common/WideButton";

export default function UploadAvatarForm() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="post"
      encType="multipart/form-data"
      className="space-y-5"
    >
      <label htmlFor="file" className="sr-only">
        Choose Image
      </label>
      <input
        type="file"
        name="file"
        accept="image/*"
        className="w-full file:border-0 file:bg-gray-50 file:text-black border rounded-lg border-input mr-5 file:cursor-pointer file:px-3 file:py-2 file:me-3"
        required
      />
      <WideButton
        disabled={fetcher.state !== "idle"}
        options={{
          type: "submit",
          name: "intent",
          value: "upload",
        }}
      >
        {fetcher.state !== "idle" ? (
          <Loading title="Submitting..." />
        ) : (
          "Upload"
        )}
      </WideButton>
    </fetcher.Form>
  );
}
