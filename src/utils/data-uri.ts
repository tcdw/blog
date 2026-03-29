import { readFile } from "node:fs/promises";

export async function readFileAsDataUri(filePath: string, mimeType: string): Promise<string> {
  const fileBuffer = await readFile(filePath);
  return `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
}
