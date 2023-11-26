import fs from "fs/promises";
import path from "path";
import { parseBundle } from "./parseBundle.js";

export async function writeToDisk(
  dir: string,
  bundle: string
): Promise<string[]> {
  const files = await parseBundle(bundle);

  const fileNames: string[] = await Promise.all(
    [...files.entries()].map(([name, content]) =>
      fs
        .mkdir(path.dirname(dir + "/" + name), { recursive: true })
        .then(() =>
          fs
            .writeFile(dir + "/" + name, content, { encoding: "utf8" })
            .then(() => name)
        )
    )
  );

  return fileNames;
}
