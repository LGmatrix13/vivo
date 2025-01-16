import { readARDs } from "~/repositories/people/ards";
//import { readRAs, readRAsDropdown } from "~/repositories/people/ras";
import { readRDs, readRDsDropdown } from "~/repositories/people/rds";
import {
  readResidentsDropdown,
  readResidents,
} from "~/repositories/people/residents";

export type IRD = Awaited<ReturnType<typeof readRDs>>[number];
//=export type IRA = Awaited<ReturnType<typeof readRAs>>[number];
export type IARD = Awaited<ReturnType<typeof readARDs>>[number];
export type IRDDropdown = Awaited<ReturnType<typeof readRDsDropdown>>[number];
//export type IRADropdown = Awaited<ReturnType<typeof readRAsDropdown>>[number];
export type IResidentDropdown = Awaited<
  ReturnType<typeof readResidentsDropdown>
>[number];
export type IResident = Awaited<ReturnType<typeof readResidents>>[number];
