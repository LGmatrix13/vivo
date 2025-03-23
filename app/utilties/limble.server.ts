import { ICompleteRCI } from "~/models/rci";

interface ILimblePayload {
  name: string;
  locationID: number;
  due: number;
  type: number;
  description: string;
  assetID: number;
}

interface IAsset {
  assetID: number;
}

const USERNAME = process.env.LIMBLE_API_USERNAME!;
const PASSWORD = process.env.LIMBLE_API_PASSWORD!;
const CREDENTIALS = Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");

async function postTask(payload: ILimblePayload) {
  const response = await fetch("https://api.limblecmms.com:443/v2/tasks/", {
    method: "POST",
    headers: {
      Authorization: `Basic ${CREDENTIALS}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return response.ok;
}

async function getAsset(name: string) {
  const response = await fetch(
    `https://api.limblecmms.com:443/v2/assets?${name}`,
    {
      headers: {
        Authorization: `Basic ${CREDENTIALS}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = (await response.json()) as IAsset;
  return data.assetID;
}

const LOCATION_ID = 18691;

async function workOrder(
  building: string,
  room: string,
  rci: ICompleteRCI,
  mapping: Record<string, string>,
  client1: (payload: ILimblePayload) => Promise<boolean> = postTask,
  client2: (name: string) => Promise<number> = getAsset
) {
  const due = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  let description = "The following items need attention:\n";

  Object.entries(rci.issues).forEach((entry, index) => {
    const [key, value] = entry;
    description += `${index + 1}. ${mapping[key]}: ${value}\n`;
  });

  description += "This work order was generated via vivo.gcc.edu.";
  const assetID = await client2(`${building} ${room}`);
  const payload = {
    // 6 indicates work order
    type: 6,
    name: `Work Order - ${building} ${room}`,
    locationID: LOCATION_ID,
    assetID,
    description,
    due,
  };
  return await client1(payload);
}

export const limble = {
  workOrder,
};
