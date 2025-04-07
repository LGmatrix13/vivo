import { ITask, IAsset } from "~/models/limble";
import { IUser } from "~/models/user";

const LOCATION_ID = 18691;

/**
 * create a task in limble
 */
async function postTask(task: ITask) {
  const response = await fetch("https://api.limblecmms.com:443/v2/tasks/", {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.LIMBLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  const data = await response.json();
  return data.taskID as number;
}

/**
 * delete task in limble
 */
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

  return response.ok;
}

/**
 * get asset to reference in a task for limble
 */
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

/**
 * create a work order in limble
 */
async function createWorkOrder(
  room: string,
  issues: Record<string, string>,
  user: IUser,
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
    requestName: `${user.firstName} ${user.lastName}`,
    requestEmail: user.email,
    locationID: LOCATION_ID,
    assetID,
    description,
    due,
  };
  return await postTask(payload);
}

/**
 * delete work order in limble
 */
async function deleteWorkOrder(id: number) {
  return await deleteTask(id);
}

export const limble = {
  createWorkOrder,
  deleteWorkOrder,
};
