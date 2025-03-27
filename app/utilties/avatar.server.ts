import sharp from "sharp";
import path from "path";
import { access } from "fs/promises";
import fs from "fs";
import { auth } from "./auth.server";
import { fileURLToPath } from "url";
import { Role } from "~/models/role";
import { Readable } from "stream";
import { fileStream } from "./fileStrem.server";

async function upload(
  request: Request,
  values: Record<string, FormDataEntryValue>
) {
  const user = await auth.readUser(request, [
    "admin",
    "admin",
    "ra",
    "rd",
    "ard",
    "resident",
  ]);

  const { avatar } = values;

  if (!avatar) {
    return false;
  }

  const buffer = await (avatar as File).arrayBuffer();
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
  return true;
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

async function _fileStream(userId: number, role: Role) {
  return fileStream(`../../public/avatars/${userId}_${role}.webp`);
}

async function defaultFileStream() {
  return fileStream(`../../public/avatars/default.webp`);
}

export const avatar = {
  upload,
  exists,
  fileStream: _fileStream,
  defaultFileStream,
};
