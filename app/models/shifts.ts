import {
  readOnDutyRAAsAdmin,
  readOnDutyRD,
} from "~/repositories/shifts/onDuty";
import { readShiftsRAAsAdmin } from "~/repositories/shifts/ra";
import { readShiftsRDAsAdmin } from "~/repositories/shifts/rd";

export type IZoneShift = Awaited<
  ReturnType<typeof readShiftsRAAsAdmin>
>[number];
export type IStaffShift = Awaited<
  ReturnType<typeof readShiftsRDAsAdmin>
>[number];
export type IRAOnDuty = Awaited<
  ReturnType<typeof readOnDutyRAAsAdmin>
>[number];
export type IRDOnDuty = Awaited<
  ReturnType<typeof readOnDutyRD>
>[number];
