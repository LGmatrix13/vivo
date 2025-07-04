import { Download, InputSearch, Upload } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import IconButton from "~/components/common/IconButton";
import { ActionFunctionArgs } from "@remix-run/node";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import { Link, useFetcher } from "@remix-run/react";
import WideButton from "~/components/common/WideButton";
import Loading from "~/components/common/Loading";
import { csv } from "~/utilties/csv";
import { uploadDutyScheduleForRD } from "~/repositories/shifts/rd";
import { uploadDutyScheduleForRAs } from "~/repositories/shifts/ra";
import { files } from "~/utilties/files.server";
import mutate from "~/utilties/mutate.server";

export async function action({ request }: ActionFunctionArgs) {
  console.log("ran");
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);
  switch (intent) {
    case "upload":
      const file = values["file"] as File;
      if (!files.checkExtension(file.name, ".csv")) {
        return mutate(request.url, {
          message: "File must be a .csv",
          level: "failure",
        });
      }

      if (admin) {
        return await uploadDutyScheduleForRD(values);
      } else {
        return await uploadDutyScheduleForRAs(values, user.id);
      }
  }
}

export default function StaffAdminPeopleRDsPage() {
  const fetcher = useFetcher<typeof uploadDutyScheduleForRD>();
  const columnKeys = {
    rowNumber: "Row Number",
    error: "Error",
  };
  const rowKeys = {
    ...columnKeys,
  };

  if (fetcher.data) {
    const { errors, erroredRows } = fetcher.data;
    return (
      <Table
        rows={errors}
        columnKeys={columnKeys}
        rowKeys={rowKeys}
        InstructionComponent={() => (
          <Instruction Icon={InputSearch} title="First Select an Error" />
        )}
        search={{
          placeholder: "Search for an error...",
        }}
        ActionButtons={() => (
          <div className="ml-auto order-2 flex space-x-3">
            <IconButton
              Icon={Download}
              className="md:flex hidden"
              onClick={() => {
                csv.download(erroredRows, "errored_rows", {
                  Email: "Email",
                  Date: "Date",
                });
              }}
            >
              Download Errored Rows
            </IconButton>
            <Link to="/staff/shifts/upload">
              <IconButton Icon={Upload}>Upload Again</IconButton>
            </Link>
          </div>
        )}
      />
    );
  }

  return (
    <fetcher.Form
      method="post"
      encType="multipart/form-data"
      className="space-y-5"
    >
      <div className="space-y-3">
        <p>
          Upload a schedule CSV which contains the Duty Schedule information for
          your staff. Before proceeding understand the following:
        </p>
        <ul className="list-disc ms-10 space-y-2">
          <li>
            Ensure your file is uploaded as a CSV. View this{" "}
            <a
              className="text-blue-600"
              href="https://support.microsoft.com/en-us/office/save-a-workbook-to-text-format-txt-or-csv-3e9a9d6c-70da-4255-aa28-fcacf1f081e6"
              target="_blank"
              rel="noopener noreferrer"
            >
              tutorial
            </a>{" "}
            to learn how to convert from Excel to a CSV.
          </li>
          <li>All scheduling information will be archived.</li>
          <li>
            Ensure your upload is formatted correctly. Compare with our{" "}
            <a href="/Schedule Template.csv" className="text-blue-600">
              template
            </a>{" "}
            to see if it is correct.
          </li>
        </ul>
        <p>
          Any errored rows will be reported after the upload is complete. You
          may download these rows and make another upload request as
          appropriate.
        </p>
      </div>
      <label htmlFor="file" className="sr-only">
        Choose File
      </label>
      <input
        type="file"
        name="file"
        accept=".csv"
        className="w-full file:border-0 border-gray-300 file:bg-gray-200 file:text-black border rounded-lg border-input mr-5 file:cursor-pointer file:px-3 file:py-2 file:me-3"
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
          "Upload Duty Schedule"
        )}
      </WideButton>
    </fetcher.Form>
  );
}
