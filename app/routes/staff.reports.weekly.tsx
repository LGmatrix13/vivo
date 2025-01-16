import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { IBuildingDropdown } from "~/models/housing";
import { readWeeklyReportsAsAdmin, readWeeklyReportsAsRD } from "~/repositories/reports/weeklyReport";
import { auth } from "~/utilties/auth.server";
import { delay } from "~/utilties/delay.server";
import Table from "~/components/common/Table";
import { IWeeklyReport } from "~/models/reports";
import Instruction from "~/components/common/Instruction";
import { FileSearch } from "~/components/common/Icons";

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await auth.readUser(request, ["admin", "rd"]);
    const admin = user.role === "admin";
    const [weeklyReports] = await Promise.all([
        admin ? readWeeklyReportsAsAdmin() : readWeeklyReportsAsRD(user.id),
        delay(100),
    ]);
    return json({
        weeklyReports,
    });
}

export async function action({ request }: ActionFunctionArgs) {
    await auth.rejectUnauthorized(request, ["admin", "rd"]);

    const formData = await request.formData();
    const { intent, ...values } = Object.fromEntries(formData);

    //   switch (intent) {
    //     case "create":
    //       return await createResident(values, request);
    //     case "update":
    //       return await updateResident(values, request);
    //     case "delete":
    //       return await deleteResident(values, request);
    //   }
}

export default function StaffReportsWeeklyPage() {
    const data = useLoaderData<typeof loader>();
    const context = useOutletContext<IBuildingDropdown[]>();
    const columnKeys = {
        shortformattedDate: "Date",
        firstName: "Firstname",
        lastName: "Lastname",
        building: "Building"
    };
    const rowKeys = {
        longformattedDate: "Date",
        fullName: "Name",
        building: "Building",
        outstandWorkOrders: "Outstanding Work Orders",
        raResponsibilities: "RA Responsibilities",
        academics: "Academics",
        spiritualHealth: "Spiritual Health",
        physicalHealth: "Physical Health",
        mentalHealth: "Mental Health",
        personalLife: "Personal Life",
        technologyAndMedia: "Technology and Media",
        explainChoices: "Explain Choices"
    };
    const buildingOptions = [
        {
            value: 0,
            key: "All",
        },
        ...context.map((building) => {
            return {
                value: building.id,
                key: building.name,
            };
        }),
    ];

    return (
        <Table<IWeeklyReport>
            columnKeys={columnKeys}
            rows={data.weeklyReports}
            rowKeys={rowKeys}
            search={{
                placeholder: "Search for a report...",
            }}
            filter={{
                selected: "All",
                key: "buildingId",
                options: buildingOptions,
            }}
            InstructionComponent={() => (
                <Instruction Icon={FileSearch} title="First Select a Report" />
            )}
            // EditComponent={({ row }) => <ResidentForm resident={row} />}
            // DeleteComponent={({ row }) => (
            //     <DeleteForm
            //         id={row.id}
            //         title={`Delete ${row.fullName}`}
            //         prompt={`Are you sure you want to delete ${row.fullName}?`}
            //         toast={`Deleted ${row.fullName}`}
            //     />
            // )}
            // ActionButtons={() => (
            //     <div className="ml-auto order-2 flex space-x-3 h-12">
            //         <DrawerProvider>
            //             <DrawerContent>
            //                 <ResidentForm />
            //             </DrawerContent>
            //             <DrawerButton>
            //                 <IconButton Icon={Plus}>Add Resident</IconButton>
            //             </DrawerButton>
            //         </DrawerProvider>
            //         <IconButton
            //             Icon={Download}
            //             onClick={() => {
            //                 csv.download(data.residents, "Residents", rowKeys);
            //             }}
            //         >
            //             Export Residents
            //         </IconButton>
            //     </div>
            // )}
        />
    );
}