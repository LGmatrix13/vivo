import {
  readCompleteRCIsAdmin,
  readSubmittedRCI,
} from "~/repositories/rci/complete";
import { readIncompleteRCIsAsAdmin } from "~/repositories/rci/incomplete";

export type ICompleteRCI = Awaited<
  ReturnType<typeof readCompleteRCIsAdmin>
>[number];

export type ISubmittedRCI = Awaited<ReturnType<typeof readSubmittedRCI>>;

export type IIncompleteRCI = Awaited<
  ReturnType<typeof readIncompleteRCIsAsAdmin>
>[number];
