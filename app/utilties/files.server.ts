import { readFile } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { fileURLToPath } from "url";

/**
 * generic stream for a file stored on the server
 */
export async function stream(file: string) {
  const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
  const __dirname = path.dirname(__filename); // get the name of the directo
  const absolutePath = path.join(__dirname, file);
  const readable = new Readable();
  const fileBuffer = await readFile(absolutePath);
  readable.push(fileBuffer);
  readable.push(null);
  return Readable.toWeb(readable) as ReadableStream;
}

/**
 * check extension of file
 */
export function checkExtension(file: string, ext: string) {
  const fileExtension = path.extname(file);
  return fileExtension === ext;
}

export const files = {
  stream,
  checkExtension,
};
