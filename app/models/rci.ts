import { readCompleteRCIsAdmin } from "~/repositories/rci/complete";
import { readIncompleteRCIsAdmin } from "~/repositories/rci/incomplete";

export type ICompleteRCI = Awaited<
  ReturnType<typeof readCompleteRCIsAdmin>
>[number];

export type IIncompleteRCI = Awaited<
  ReturnType<typeof readIncompleteRCIsAdmin>
>[number];
