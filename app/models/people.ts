import { ards, ras, rds, rdsDropdown, residents } from "~/repositories/people";

export type IRD = Awaited<ReturnType<typeof rds>>[number];
export type IRA = Awaited<ReturnType<typeof ras>>[number];
export type IARD = Awaited<ReturnType<typeof ards>>[number];
export type IRDDropdown = Awaited<ReturnType<typeof rdsDropdown>>[number];
export type IResident = Awaited<ReturnType<typeof residents>>[number];
