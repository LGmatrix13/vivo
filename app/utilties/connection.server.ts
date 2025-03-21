import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { PgTable } from "drizzle-orm/pg-core";
import { z } from "zod";
import mutate from "./mutate.server";
import { SQL } from "drizzle-orm";

const client = drizzle(process.env.DATABASE_URL!);

async function insert<T extends z.ZodTypeAny>(
  request: Request,
  table: PgTable,
  schema: T,
  values: Record<string, unknown>,
  triggerMutate: boolean = true,
  toast?: {
    message: string;
    level: "success" | "failure";
  },
  onSuccess?: (values: z.infer<typeof schema>) => void | Promise<void>
) {
  const result = schema.safeParse(values);

  if (result.success) {
    await client.insert(table).values(result.data);
    if (onSuccess) {
      await onSuccess(result.data);
    }

    if (triggerMutate) {
      return mutate(request.url, toast);
    }
  }

  if (triggerMutate) {
    return mutate(request.url, {
      message: result.error?.issues[0].message as string,
      level: "failure",
    });
  }

  return null;
}

async function _delete(
  request: Request,
  table: PgTable,
  values: Record<string, unknown>,
  predicate: (id: number) => SQL,
  toast?: {
    message: string;
    level: "success" | "failure";
  }
) {
  await client.delete(table).where(predicate(Number(values["id"])));
  return mutate(request.url, toast);
}

async function update<T extends z.ZodTypeAny>(
  request: Request,
  table: PgTable,
  schema: T,
  values: Record<string, unknown>,
  predicate: (values: z.infer<typeof schema>) => SQL,
  toast?: {
    message: string;
    level: "success" | "failure";
  }
) {
  const result = schema.safeParse(values);

  if (result.success) {
    const parsedData = result.data as z.infer<typeof schema>;
    await client.update(table).set(parsedData).where(predicate(parsedData));
    return mutate(request.url, toast);
  }

  return mutate(request.url, {
    message: "System error occured",
    level: "failure",
  });
}

export const db = {
  client,
  insert,
  update,
  delete: _delete,
};
