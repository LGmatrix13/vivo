import { z } from "zod";


export const RAScheduleCSV = z.object({
    id: z.coerce.number().optional(),
    zoneId: z.coerce.number(),
    date: z.coerce.date()
})