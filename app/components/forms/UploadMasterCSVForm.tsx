import { useFetcher } from "@remix-run/react";
import WideButton from "../common/WideButton";
import Loading from "../common/Loading";
import { uploadMasterCSV } from "~/repositories/people/ras";

export default function UploadMasterCSVForm() {
  const fetcher = useFetcher<typeof uploadMasterCSV>();
  const data = fetcher.data;

  if (data) {
    return (
      <div className="space-y-5">
        <h2 className="font-bold text-xl">Upload Master CSV</h2>
        {data.errors.map((error) => (
          <div className="space-y-3">
            <p className="font-bold">Errors on Row {error.rowNumber}</p>
            <ul className="list-disc ml-5 space-y-2">
              {data.errors.map((error) => (
                <>
                  {error.errors.map((error) => (
                    <li>{error.message}</li>
                  ))}
                </>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <fetcher.Form
      method="post"
      encType="multipart/form-data"
      className="space-y-5"
    >
      <h2 className="font-bold text-xl">Upload Master CSV</h2>
      <label htmlFor="file" className="sr-only">
        Choose File
      </label>
      <input
        type="file"
        name="file"
        accept=".csv"
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
          "Continue"
        )}
      </WideButton>
    </fetcher.Form>
  );
}
