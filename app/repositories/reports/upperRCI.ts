import { sql, eq } from "drizzle-orm";
import { CreatedWeekly, Weekly } from "~/schemas/reports/weekly";
import { db } from "~/utilties/connection.server";
import {
  buildingTable,
  roomConditionItemsTable,
  staffTable,
  weeklyReportTable,
} from "~/utilties/schema.server";
import { residentTable } from "~/utilties/schema.server";
import { zoneTable } from "~/utilties/schema.server";
type Values = { [key: string]: any };

export async function readUpperRCIReports() {
  const data = await db.client
      .select({
        roomID: residentTable.id,
        emergencyItems: roomConditionItemsTable.emergencyItems,
        walls: roomConditionItemsTable.walls,
        floor: roomConditionItemsTable.floor,
        doorsLocks: roomConditionItemsTable.doorsLocks,
        ceiling: roomConditionItemsTable.ceiling,
        lightsFixtures: roomConditionItemsTable.lightsFixtures,
        closetWardrobeMirror: roomConditionItemsTable.closetWardrobeMirror,
        windowsScreens: roomConditionItemsTable.windowsScreens,
        curtainsRods: roomConditionItemsTable.curtainsRods,
        deskChair: roomConditionItemsTable.deskChair,
        bedMattress: roomConditionItemsTable.bedMattress,
        dresser: roomConditionItemsTable.dresser,
        bathroom: roomConditionItemsTable.bathroom,
        towelbarRings: roomConditionItemsTable.towelbarRings,
        studentSignature: roomConditionItemsTable.studentSignature,
        RASignature: roomConditionItemsTable.RASignature,
        studentDate: roomConditionItemsTable.studentDate,
        RADate: roomConditionItemsTable.RADate,        
      })
}