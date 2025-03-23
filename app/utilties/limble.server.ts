import { ITask, IAsset } from "~/models/limble";

const LOCATION_ID = 18691;
const CACHE: Record<string, number> = {};

async function postTask(task: ITask) {
  const credentials = Buffer.from(
    `${process.env.LIMBLE_API_USERNAME}:${process.env.LIMBLE_API_PASSWORD}`
  ).toString("base64");

  const response = await fetch("https://api.limblecmms.com:443/v2/tasks/", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return response.ok;
}

async function getAsset(room: string) {
  if (CACHE[room]) return CACHE[room];

  const credentials = Buffer.from(
    `${process.env.LIMBLE_API_USERNAME}:${process.env.LIMBLE_API_PASSWORD}`
  ).toString("base64");

  const response = await fetch(
    `https://api.limblecmms.com:443/v2/assets?name=${room}`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as IAsset[];

  if (!data.length) {
    return null;
  }

  const assetID = data[0].assetID;
  CACHE[room] = assetID;
  return assetID;
}

async function workOrder(
  room: string,
  issues: Record<string, string>,
  mapping: Record<string, string>,
  client2: (task: ITask) => Promise<boolean> = postTask,
  client1: (room: string) => Promise<number | null> = getAsset
) {
  const due = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  let description = "The following items need attention:\n";

  Object.entries(issues).forEach((entry, index) => {
    const [key, value] = entry;
    description += `${index + 1}. ${mapping[key]}: ${value}\n`;
  });

  description += "This work order was generated via vivo.gcc.edu.";
  const assetID = await client1(room);
  if (!assetID) return false;
  const payload = {
    // 6 indicates work order
    type: 6,
    name: `Work Order - ${room}`,
    locationID: LOCATION_ID,
    assetID,
    description,
    due,
  };
  return await client2(payload);
}

export const limble = {
  workOrder,
};
