import sharp from "sharp";
import mutate from "./mutate.server";
import path from "path";
import { readFile, access } from "fs/promises";
import fs from "fs";
import { auth } from "./auth.server";
import { fileURLToPath } from "url";
import { Role } from "~/models/role";
import { Readable } from "stream";
import { error } from "console";

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

async function exists(userId: number, role: Role) {
  const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
  const __dirname = path.dirname(__filename); // get the name of the directo
  const absolutePath = path.join(
    __dirname,
    `../../public/avatars`,
    `${role}_${userId}.webp`
  );
  return access(absolutePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

async function fileStream(userId: number, role: Role) {
  const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
  const __dirname = path.dirname(__filename); // get the name of the directo
  const absolutePath = path.join(
    __dirname,
    `../../public/avatars`,
    `${role}_${userId}.webp`
  );
  const readable = new Readable();
  const fileBuffer = await readFile(absolutePath);
  readable.push(fileBuffer);
  readable.push(null);
  return Readable.toWeb(readable) as ReadableStream;
}

async function defaultFileStream() {
  const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
  const __dirname = path.dirname(__filename); // get the name of the directo
  const absolutePath = path.join(
    __dirname,
    `../../public/avatars`,
    `default.webp`
  );
  const readable = new Readable();
  const fileBuffer = await readFile(absolutePath);
  readable.push(fileBuffer);
  readable.push(null);
  return Readable.toWeb(readable) as ReadableStream;
}

export const avatar = {
  upload,
  exists,
  fileStream,
  defaultFileStream,
};
