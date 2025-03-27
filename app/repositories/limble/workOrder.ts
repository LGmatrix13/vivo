import { eq } from "drizzle-orm";
import { number } from "zod";
import { db } from "~/utilties/postgres.server";
import { LimbleTable } from "~/utilties/schema.server";

export async function deleteWorkOrder(id: number) {
  return await db.client
    .delete(LimbleTable)
    .where(eq(LimbleTable.workOrderId, id));
}

export async function createWorkOrder(roomId: number, workOrderId: number) {
  return await db.client.insert(LimbleTable).values({
    roomId,
    workOrderId,
  });
}
