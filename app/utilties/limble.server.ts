import { ITask, IAsset } from "~/models/limble";

const LOCATION_ID = 18691;

async function postTask(task: ITask) {
  const response = await fetch("https://api.limblecmms.com:443/v2/tasks/", {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.LIMBLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  console.log(response.statusText);
  const data = await response.json();
  return data.taskID as number;
}

async function deleteTask(id: number) {
  const response = await fetch(
    `https://api.limblecmms.com:443/v2/tasks/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${process.env.LIMBLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log(response.statusText);
  const data = await response.json();
  console.log(data);

  return response.ok;
}

async function getAsset(room: string) {
  const response = await fetch(
    `https://api.limblecmms.com:443/v2/assets?name=${room}`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${process.env.LIMBLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) return null;

  const data = (await response.json()) as IAsset[];
  if (!data.length) return null;

  const assetID = data[0].assetID;
  return assetID;
}

async function createWorkOrder(
  room: string,
  issues: Record<string, string>,
  mapping: Record<string, string>
) {
  const due = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  let description = "The following items need attention:\n";

  Object.entries(issues).forEach((entry, index) => {
    const [key, value] = entry;
    description += `${index + 1}. ${mapping[key]}: ${value}\n`;
  });

  description += "This work order was generated via vivo.gcc.edu.";
  const assetID = await getAsset(room);
  if (!assetID) return null;

  const payload = {
    // 6 indicates work order
    type: 6,
    name: `Work Order - ${room}`,
    locationID: LOCATION_ID,
    assetID,
    description,
    due,
  };
  return await postTask(payload);
}

async function deleteWorkOrder(id: number) {
  return await deleteTask(id);
}

export const limble = {
  createWorkOrder,
  deleteWorkOrder,
};
