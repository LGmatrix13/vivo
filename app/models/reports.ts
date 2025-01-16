import { readWeeklyReportsAsAdmin } from "~/repositories/reports/weeklyReport";

export type IWeeklyReport = Awaited<ReturnType<typeof readWeeklyReportsAsAdmin>>[number];