import { Form, useActionData } from "@remix-run/react";
import WideButton from "../common/WideButton";
import { useSubmit } from "@remix-run/react";
import { uploadMasterCSV } from "~/actions/people";

export default function UploadMasterCSVForm() {
  const submit = useSubmit();
  const data = useActionData<typeof uploadMasterCSV>();

  if (data) {
    return (
      <div className="space-y-5">
        <h2 className="font-bold text-xl">Upload Master CSV</h2>
        <p>{data.errors.length} errors occured</p>
        <ul className="space-y-3 list-disc ml-3">
          {data.errors.map((errors) => (
            <>
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <Form
      method="post"
      encType="multipart/form-data"
      className="space-y-5"
      onSubmit={(event) => {
        submit(event.currentTarget);
      }}
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
        options={{
          type: "submit",
          name: "intent",
          value: "upload",
        }}
      >
        Continue
      </WideButton>
    </Form>
  );
}
