import { useState } from "react";
import { DrawerButton, DrawerContent, DrawerProvider } from "./Drawer";
import IconButton from "./IconButton";
import {
  CalendarEvent,
  ClockSearch,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Upload,
} from "./Icons";
import Table from "./Table";
import Instruction from "./Instruction";
import { csv } from "~/utilties/csv";

interface IShift {
  day: string;
  date: string;
  name: string;
}

interface IScheduleTableProps<T> {
  shifts: T[];
  filter?: {
    options: {
      key: string;
      value: number;
    }[];
  };
  upload?: boolean;
  AddShiftComponent?: () => React.ReactElement;
  DeleteShiftComponent?: (props: { shift: T }) => React.ReactElement;
  EditShiftComponent?: (props: { shift: T }) => React.ReactElement;
}

/**
 * table to display shifts
 */
export default function ShiftTable<T extends IShift>(
  props: IScheduleTableProps<T>
) {
  const {
    shifts,
    filter,
    upload = false,
    EditShiftComponent,
    AddShiftComponent,
    DeleteShiftComponent,
  } = props;
  const [week, setWeek] = useState(1);
  const formattedShifts = shifts.map((shift) => {
    const date = new Date(shift.date);
    return {
      ...shift,
      date,
    };
  });

  function calculateStartOfWeek(weekOffset: number) {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() + 7 * (weekOffset - 1) - today.getDay()
    );
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  const startOfWeek = calculateStartOfWeek(week);

  function withinWeek(date: Date) {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return date >= startOfWeek && date <= endOfWeek;
  }

  const filteredShifts = formattedShifts.filter((shift) =>
    withinWeek(shift.date)
  );

  return (
    <section className="space-y-5">
      <div className="flex h-12 justify-between">
        <div className="space-x-3 flex">
          <button
            className="border bordr-gray-300 rounded-lg px-3 h-12 hover:bg-gray-200 transition ease-in-out"
            onClick={() => setWeek(week - 1)}
          >
            <ChevronLeft />
          </button>
          <button
            className="border border-gray-300 rounded-lg px-3 h-12 hover:bg-gray-200"
            onClick={() => setWeek(week + 1)}
          >
            <ChevronRight />
          </button>
          <IconButton Icon={CalendarEvent} onClick={() => setWeek(1)}>
            This Week
          </IconButton>
        </div>
      </div>
      <Table<IShift>
        columnKeys={{
          day: "Day",
          name: "Name",
        }}
        rowKeys={{
          day: "Day",
          name: "Name",
        }}
        enableReads={false}
        rows={filteredShifts}
        InstructionComponent={() => (
          <Instruction title="First Select a Shift" Icon={ClockSearch} />
        )}
        EditComponent={
          EditShiftComponent
            ? ({ row }) => <EditShiftComponent shift={row as T} />
            : undefined
        }
        DeleteComponent={
          DeleteShiftComponent
            ? ({ row }) => <DeleteShiftComponent shift={row as T} />
            : undefined
        }
        filter={
          filter
            ? {
                selected: "All",
                key: "buildingId",
                options: filter.options,
              }
            : undefined
        }
        search={{
          placeholder: "Search for a shift...",
        }}
        ActionButtons={() => (
          <div className="ml-auto order-2 space-x-3 flex">
            {upload && (
              <DrawerProvider>
                <DrawerButton>
                  <IconButton Icon={Upload}>Upload</IconButton>
                </DrawerButton>
                <DrawerContent>
                  <h2 className="font-bold text-xl">Upload RD Schedule</h2>
                </DrawerContent>
              </DrawerProvider>
            )}
            {AddShiftComponent && (
              <DrawerProvider>
                <DrawerButton>
                  <IconButton Icon={Plus}>Add Shift</IconButton>
                </DrawerButton>
                <DrawerContent>
                  <AddShiftComponent />
                </DrawerContent>
              </DrawerProvider>
            )}
            <IconButton
              Icon={Download}
              onClick={() => {
                csv.download(filteredShifts, "Shifts", {
                  day: "Day",
                  name: "Name",
                });
              }}
            >
              Export Shifts
            </IconButton>
          </div>
        )}
      />
    </section>
  );
}
