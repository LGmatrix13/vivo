import {
  readARDs,
  readRAs,
  readRAsDropdown,
  readRDs,
  readRDsDropdown,
  readResidents,
  readResidentsDropdown,
} from "~/repositories/people";

export type IRD = Awaited<ReturnType<typeof readRDs>>[number];
export type IRA = Awaited<ReturnType<typeof readRAs>>[number];
export type IARD = Awaited<ReturnType<typeof readARDs>>[number];
export type IRDDropdown = Awaited<ReturnType<typeof readRDsDropdown>>[number];
export type IRADropdown = Awaited<ReturnType<typeof readRAsDropdown>>[number];
export type IResidentDropdown = Awaited<
  ReturnType<typeof readResidentsDropdown>
>[number];
export type IResident = Awaited<ReturnType<typeof readResidents>>[number];
