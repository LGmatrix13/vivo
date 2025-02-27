import {
  zoneTable,
  residentTable,
  weeklyReportTable,
} from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { eq, sql } from "drizzle-orm";
import { IInsight } from "~/models/insights";

export async function readRAHealthInsightsAsRD(staffId: number) {
  const data = await db.client
    .select({
      greatMentalHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'GREAT' THEN 1 END)`,
      goodMentalHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'GOOD' THEN 1 END)`,
      okMentalHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'OK' THEN 1 END)`,
      roughMentalHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'ROUGH' THEN 1 END)`,
      reallyRoughMentalHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'REALLY_ROUGH' THEN 1 END)`,
      greatPersonalLife: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'GREAT' THEN 1 END)`,
      goodPersonalLife: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'GOOD' THEN 1 END)`,
      okPersonalLife: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'OK' THEN 1 END)`,
      roughPersonalLife: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'ROUGH' THEN 1 END)`,
      reallyRoughPersonalLife: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'REALLY_ROUGH' THEN 1 END)`,
      greatSpiritualHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'GREAT' THEN 1 END)`,
      goodSpiritualHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'GOOD' THEN 1 END)`,
      okSpiritualHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'OK' THEN 1 END)`,
      roughSpiritualHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'ROUGH' THEN 1 END)`,
      reallySpiritualHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'REALLY_ROUGH' THEN 1 END)`,
    })
    .from(weeklyReportTable)
    .innerJoin(zoneTable, eq(zoneTable.id, weeklyReportTable.zoneId))
    .where(eq(zoneTable.staffId, staffId));
  const {
    greatMentalHealth,
    goodMentalHealth,
    okMentalHealth,
    roughMentalHealth,
    reallyRoughMentalHealth,
    greatPersonalLife,
    goodPersonalLife,
    okPersonalLife,
    roughPersonalLife,
    reallyRoughPersonalLife,
    greatSpiritualHealth,
    goodSpiritualHealth,
    okSpiritualHealth,
    roughSpiritualHealth,
    reallySpiritualHealth,
  } = data[0];

  const insights = [
    {
      title: `${greatMentalHealth} reported great mental health`,
      level: "great",
      value: greatMentalHealth,
    },
    {
      title: `${goodMentalHealth} reported good mental health`,
      level: "great",
      value: goodMentalHealth,
    },
    {
      title: `${okMentalHealth} reported ok mental health`,
      level: "warning",
      value: okMentalHealth,
    },
    {
      title: `${
        roughMentalHealth + reallyRoughMentalHealth
      } reported rough or really rough mental health`,
      level: "danger",
      value: roughMentalHealth + reallyRoughMentalHealth,
    },
    {
      title: `${greatPersonalLife} reported great personal life`,
      level: "great",
      value: greatPersonalLife,
    },
    {
      title: `${goodPersonalLife} reported good personal life`,
      level: "good",
      value: goodPersonalLife,
    },
    {
      title: `${okPersonalLife} reported ok personal life`,
      level: "warning",
      value: okPersonalLife,
    },
    {
      title: `${
        roughPersonalLife + reallyRoughPersonalLife
      } reported rough or really rough personal life`,
      level: "danger",
      value: roughPersonalLife + reallyRoughPersonalLife,
    },
    {
      title: `${greatSpiritualHealth} reported great spiritual health`,
      level: "great",
      value: greatSpiritualHealth,
    },
    {
      title: `${goodSpiritualHealth} reported good spiritual health`,
      level: "good",
      value: goodSpiritualHealth,
    },
    {
      title: `${okSpiritualHealth} reported ok spiritual health`,
      level: "warning",
      value: okSpiritualHealth,
    },
    {
      title: `${
        roughSpiritualHealth + reallySpiritualHealth
      } reported rough or really rough spiritual health`,
      level: "danger",
      value: roughSpiritualHealth + reallySpiritualHealth,
    },
  ];

  return insights.filter((insight) => insight.value > 0) as IInsight[];
}

export async function readRAHealthInsightsAsAdmin() {
  const data = await db.client
    .select({
      greatMentalHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'GREAT' THEN 1 END)`,
      goodMentalHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'GOOD' THEN 1 END)`,
      okMentalHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'OK' THEN 1 END)`,
      roughMentalHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'ROUGH' THEN 1 END)`,
      reallyRoughMentalHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.mentalHealth} = 'REALLY_ROUGH' THEN 1 END)`,
      greatPersonalLife: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'GREAT' THEN 1 END)`,
      goodPersonalLife: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'GOOD' THEN 1 END)`,
      okPersonalLife: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'OK' THEN 1 END)`,
      roughPersonalLife: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'ROUGH' THEN 1 END)`,
      reallyRoughPersonalLife: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.personalLife} = 'REALLY_ROUGH' THEN 1 END)`,
      greatSpiritualHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'GREAT' THEN 1 END)`,
      goodSpiritualHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'GOOD' THEN 1 END)`,
      okSpiritualHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'OK' THEN 1 END)`,
      roughSpiritualHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'ROUGH' THEN 1 END)`,
      reallySpiritualHealth: sql<number>`COUNT(CASE WHEN ${weeklyReportTable.spiritualHealth} = 'REALLY_ROUGH' THEN 1 END)`,
    })
    .from(weeklyReportTable);

  const {
    greatMentalHealth,
    goodMentalHealth,
    okMentalHealth,
    roughMentalHealth,
    reallyRoughMentalHealth,
    greatPersonalLife,
    goodPersonalLife,
    okPersonalLife,
    roughPersonalLife,
    reallyRoughPersonalLife,
    greatSpiritualHealth,
    goodSpiritualHealth,
    okSpiritualHealth,
    roughSpiritualHealth,
    reallySpiritualHealth,
  } = data[0];

  const insights = [
    {
      title: `${greatMentalHealth} reported great mental health`,
      level: "great",
      value: greatMentalHealth,
    },
    {
      title: `${goodMentalHealth} reported good mental health`,
      level: "great",
      value: goodMentalHealth,
    },
    {
      title: `${okMentalHealth} reported ok mental health`,
      level: "warning",
      value: okMentalHealth,
    },
    {
      title: `${
        roughMentalHealth + reallyRoughMentalHealth
      } reported rough or really rough mental health`,
      level: "danger",
      value: roughMentalHealth + reallyRoughMentalHealth,
    },
    {
      title: `${greatPersonalLife} reported great personal life`,
      level: "great",
      value: greatPersonalLife,
    },
    {
      title: `${goodPersonalLife} reported good personal life`,
      level: "good",
      value: goodPersonalLife,
    },
    {
      title: `${okPersonalLife} reported ok personal life`,
      level: "warning",
      value: okPersonalLife,
    },
    {
      title: `${
        roughPersonalLife + reallyRoughPersonalLife
      } reported rough or really rough personal life`,
      level: "danger",
      value: roughPersonalLife + reallyRoughPersonalLife,
    },
    {
      title: `${greatSpiritualHealth} reported great spiritual health`,
      level: "great",
      value: greatSpiritualHealth,
    },
    {
      title: `${goodSpiritualHealth} reported good spiritual health`,
      level: "good",
      value: goodSpiritualHealth,
    },
    {
      title: `${okSpiritualHealth} reported ok spiritual health`,
      level: "warning",
      value: okSpiritualHealth,
    },
    {
      title: `${
        roughSpiritualHealth + reallySpiritualHealth
      } reported rough or really rough spiritual health`,
      level: "danger",
      value: roughSpiritualHealth + reallySpiritualHealth,
    },
  ];

  return insights.filter((insight) => insight.value > 0) as IInsight[];
}
