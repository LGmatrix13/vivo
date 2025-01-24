import {z} from "zod"

export const ReadReport = z.object({
reportType : z.enum(["RCI", "CONVERSATION", "WEEKLY", "ROUND", "EVENT"]),
personType : z.enum(["ZONE", "STAFF", "ASSISTANT_STAFF", "ADMIN"]),
reportId : z.coerce.number(),
personId : z.coerce.number(),
});