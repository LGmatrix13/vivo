import { readEventReportsAdmin } from "~/repositories/reports/event";
import { readConversationReports } from "~/repositories/reports/conversations";
import { readWeeklyReports } from "~/repositories/reports/weekly";
import { readRoundReports } from "~/repositories/reports/round";

export type IEventReport = Awaited<
  ReturnType<typeof readEventReportsAdmin>
>[number];

export type IConversationReport = Awaited<
  ReturnType<typeof readConversationReports>
>[number];

export type IWeeklyReport = Awaited<
  ReturnType<typeof readWeeklyReports>
>[number];

export type IRoundReport = Awaited<ReturnType<typeof readRoundReports>>[number];
