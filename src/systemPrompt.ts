import fs from "fs/promises";
import { getDirFromUrl } from "./getDirFromUrl.js";

export const systemPrompt = fs.readFile(
  getDirFromUrl(import.meta.url) + "/../public/systemPrompt.txt",
  {
    encoding: "utf-8",
  }
);
