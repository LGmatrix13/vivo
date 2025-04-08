import { eq } from "drizzle-orm";
import { db } from "~/utilties/postgres.server";
import { LimbleTable } from "~/utilties/schema.server";

/**
 * deletes a work order from the database
 * @returns whether or not that deletion was a success or not
 */
export async function deleteWorkOrder(id: number) {
  return await db.client
    .delete(LimbleTable)
    .where(eq(LimbleTable.workOrderId, id));
}

/**
 * creates a new work order in the database
 * @returns whether or not that creation was a success or not
 */
export async function createWorkOrder(roomId: number, workOrderId: number) {
  return await db.client.insert(LimbleTable).values({
    roomId,
    workOrderId,
  });
}
