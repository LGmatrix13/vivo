import sharp from "sharp";
import mutate from "./mutate.server";
import path from "path";
import fs from "fs";
import { auth } from "./auth.server";
import { fileURLToPath } from "url";
import { Role } from "~/models/role";

async function upload(request: Request) {
  const formData = await request.formData();
  const user = await auth.readUser(request, [
    "admin",
    "admin",
    "ra",
    "rd",
    "ard",
    "resident",
  ]);

  if (!formData.get("avatar")) {
    return mutate(request.url, {
      message: "System error occured",
      level: "failure",
    });
  }

  const avatarFile = formData.get("avatar") as File;
  const buffer = await avatarFile.arrayBuffer();
  const imageBuffer = Buffer.from(buffer);
  const processedImage = await sharp(imageBuffer).resize(100).webp().toBuffer();
  const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
  const __dirname = path.dirname(__filename); // get the name of the directo
  const outputPath = path.join(
    __dirname,
    `../../public/avatars`,
    `${user.role}_${user.id}.webp`
  );
  fs.writeFileSync(outputPath, processedImage);
  return mutate(request.url, {
    message: "Uploaded avatar",
    level: "success",
  });
}

function exists(userId: number, role: Role) {
  const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
  const __dirname = path.dirname(__filename); // get the name of the directo
  const potentialPath = path.join(
    __dirname,
    `../../public/avatars`,
    `${role}_${userId}.webp`
  );
  return fs.existsSync(potentialPath);
}

export const avatar = {
  upload,
  exists,
};
