import fs from "fs/promises";

export async function getFileList(
  dir: string = ".",
  ignoreList: string[] = ["/.", "/dist", "/node_modules"],
  includeList: string[] = [
    ".py",
    ".json",
    ".js",
    ".ts",
    ".txt",
    ".css",
    ".htm",
    ".md",
    ".sql",
    ".yaml",
  ]
): Promise<string[]> {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const fileList = (
    await Promise.all(
      files.map(async (file) => {
        const filepath = dir + "/" + file.name;
        if (includesPattern(ignoreList)(filepath)) return [];
        if (file.isDirectory()) {
          const list = await getFileList(filepath, ignoreList, includeList);
          return list.map((p) => file.name + "/" + p);
        }
        return [file.name];
      })
    )
  ).flat();
  return fileList.filter(includesPattern(includeList));
}

const includesPattern = (patterns: string[]) => (s: string) =>
  patterns.some((p) => s.includes(p));
