import {
  readSubmittedRCI,
  readSubmittedRCIsAsAdmin,
} from "~/repositories/rci/submitted";
import { readIncompleteRCIsAsAdmin } from "~/repositories/rci/incomplete";

export type ISubmittedRCI = Awaited<
  ReturnType<typeof readSubmittedRCIsAsAdmin>
>[number];

export type IPotentialRCI = Awaited<ReturnType<typeof readSubmittedRCI>>;

export type IIncompleteRCI = Awaited<
  ReturnType<typeof readIncompleteRCIsAsAdmin>
>[number];
