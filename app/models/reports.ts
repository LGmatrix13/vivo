import {
  readEventReportsAdmin,
  readEventReportsRA,
} from "~/repositories/reports/event";
import { readConversationReports } from "~/repositories/reports/conversations";
import { readWeeklyReports } from "~/repositories/reports/weekly";
import { readRoundReports } from "~/repositories/reports/round";
import { readUpperRCIReports } from "~/repositories/reports/upperRCI";

export type IEventReport = Awaited<
  ReturnType<typeof readEventReportsAdmin>
>[number];

export type IEventReportAsRA = Awaited<
  ReturnType<typeof readEventReportsRA>
>[number];

export type IConversationReport = Awaited<
  ReturnType<typeof readConversationReports>
>[number];

export type IWeeklyReport = Awaited<
  ReturnType<typeof readWeeklyReports>
>[number];

export type IRoundReport = Awaited<ReturnType<typeof readRoundReports>>[number];

export type IUpperRCI = Awaited<
  ReturnType<typeof readUpperRCIReports>
>[];