import { zoneTable, weeklyReportTable } from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { eq, sql } from "drizzle-orm";
import { IInsight } from "~/models/insights";

export async function readRAHealthInsightsAsRD(staffId: number) {
  const data = await db.client
    .select({
      greatMentalHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'GREAT' THEN 1 END)`.mapWith(
          Number
        ),
      goodMentalHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'GOOD' THEN 1 END)`.mapWith(
          Number
        ),
      okMentalHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'OK' THEN 1 END)`.mapWith(
          Number
        ),
      roughMentalHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'ROUGH' THEN 1 END)`.mapWith(
          Number
        ),
      reallyRoughMentalHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'REALLY_ROUGH' THEN 1 END)`.mapWith(
          Number
        ),
      greatPersonalLife:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'GREAT' THEN 1 END)`.mapWith(
          Number
        ),
      goodPersonalLife:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'GOOD' THEN 1 END)`.mapWith(
          Number
        ),
      okPersonalLife:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'OK' THEN 1 END)`.mapWith(
          Number
        ),
      roughPersonalLife:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'ROUGH' THEN 1 END)`.mapWith(
          Number
        ),
      reallyRoughPersonalLife:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'REALLY_ROUGH' THEN 1 END)`.mapWith(
          Number
        ),
      greatSpiritualHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'GREAT' THEN 1 END)`.mapWith(
          Number
        ),
      goodSpiritualHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'GOOD' THEN 1 END)`.mapWith(
          Number
        ),
      okSpiritualHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'OK' THEN 1 END)`.mapWith(
          Number
        ),
      roughSpiritualHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'ROUGH' THEN 1 END)`.mapWith(
          Number
        ),
      reallySpiritualHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'REALLY_ROUGH' THEN 1 END)`.mapWith(
          Number
        ),
    })
    .from(weeklyReportTable)
    .innerJoin(zoneTable, eq(zoneTable.id, weeklyReportTable.zoneId))
    .where(eq(zoneTable.staffId, staffId));

  return processInsights(data[0]);
}

export async function readRAHealthInsightsAsAdmin() {
  const data = await db.client
    .select({
      greatMentalHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'GREAT' THEN 1 END)`.mapWith(
          Number
        ),
      goodMentalHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'GOOD' THEN 1 END)`.mapWith(
          Number
        ),
      okMentalHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'OK' THEN 1 END)`.mapWith(
          Number
        ),
      roughMentalHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'ROUGH' THEN 1 END)`.mapWith(
          Number
        ),
      reallyRoughMentalHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'REALLY_ROUGH' THEN 1 END)`.mapWith(
          Number
        ),
      greatPersonalLife:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'GREAT' THEN 1 END)`.mapWith(
          Number
        ),
      goodPersonalLife:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'GOOD' THEN 1 END)`.mapWith(
          Number
        ),
      okPersonalLife:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'OK' THEN 1 END)`.mapWith(
          Number
        ),
      roughPersonalLife:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'ROUGH' THEN 1 END)`.mapWith(
          Number
        ),
      reallyRoughPersonalLife:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'REALLY_ROUGH' THEN 1 END)`.mapWith(
          Number
        ),
      greatSpiritualHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'GREAT' THEN 1 END)`.mapWith(
          Number
        ),
      goodSpiritualHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'GOOD' THEN 1 END)`.mapWith(
          Number
        ),
      okSpiritualHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'OK' THEN 1 END)`.mapWith(
          Number
        ),
      roughSpiritualHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'ROUGH' THEN 1 END)`.mapWith(
          Number
        ),
      reallySpiritualHealth:
        sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'REALLY_ROUGH' THEN 1 END)`.mapWith(
          Number
        ),
    })
    .from(weeklyReportTable);

  return processInsights(data[0]);
}

//TODO: add search for data within reports to sort these reports by health

function processInsights(data: any): IInsight[] {
  const insights = [
    {
      title: `${data.greatMentalHealth} reported great mental health`,
      level: "great",
      value: data.greatMentalHealth,
      href: '/staff/reports/weekly?mentalHealth=GREAT',
    },
    {
      title: `${data.goodMentalHealth} reported good mental health`,
      level: "great",
      value: data.goodMentalHealth,
      href: '/staff/reports/weekly?mentalHealth=GOOD',
    },
    {
      title: `${data.okMentalHealth} reported ok mental health`,
      level: "warning",
      value: data.okMentalHealth,
      href: '/staff/reports/weekly?mentalHealth=OK',
    },
    {
      title: `${
        data.roughMentalHealth + data.reallyRoughMentalHealth
      } reported rough or really rough mental health`,
      level: "danger",
      value: data.roughMentalHealth + data.reallyRoughMentalHealth,
      href: '/staff/reports/weekly?mentalHealth=ROUGH&mentalHealth=REALLY_ROUGH',
    },
    {
      title: `${data.greatPersonalLife} reported great personal life`,
      level: "great",
      value: data.greatPersonalLife,
      href: '/staff/reports/weekly?personalLife=GREAT',
    },
    {
      title: `${data.goodPersonalLife} reported good personal life`,
      level: "good",
      value: data.goodPersonalLife,
      href: '/staff/reports/weekly?personalLife=GOOD',
    },
    {
      title: `${data.okPersonalLife} reported ok personal life`,
      level: "warning",
      value: data.okPersonalLife,
      href: '/staff/reports/weekly?personalLife=OK',
    },
    {
      title: `${
        data.roughPersonalLife + data.reallyRoughPersonalLife
      } reported rough or really rough personal life`,
      level: "danger",
      value: data.roughPersonalLife + data.reallyRoughPersonalLife,
      href: '/staff/reports/weekly?personalLife=ROUGH&personalLife=REALLY_ROUGH',
    },
    {
      title: `${data.greatSpiritualHealth} reported great spiritual health`,
      level: "great",
      value: data.greatSpiritualHealth,
      href: '/staff/reports/weekly?spiritualHealth=GREAT',
    },
    {
      title: `${data.goodSpiritualHealth} reported good spiritual health`,
      level: "good",
      value: data.goodSpiritualHealth,
      href: '/staff/reports/weekly?spiritualHealth=GOOD',
    },
    {
      title: `${data.okSpiritualHealth} reported ok spiritual health`,
      level: "warning",
      value: data.okSpiritualHealth,
      href: '/staff/reports/weekly?spiritualHealth=OK',
    },
    {
      title: `${
        data.roughSpiritualHealth + data.reallySpiritualHealth
      } reported rough or really rough spiritual health`,
      level: "danger",
      value: data.roughSpiritualHealth + data.reallySpiritualHealth,
      href: '/staff/reports/weekly?spiritualHealth=ROUGH&spirtualHealth=REALLY_ROUGH',
    },
  ];

  return insights.filter((insight) => insight.value > 0) as IInsight[];
}
