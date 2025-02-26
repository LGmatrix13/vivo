import { z } from "zod";


export const RAScheduleCSV = z.object({
    id: z.coerce.number().optional(),
    zoneId: z.coerce.number({ message: "Zone Id is required" }),
    date: z.coerce.date({ message: "Date is required" }),
  });