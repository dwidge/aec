import { fileURLToPath } from "url";
import { dirname } from "path";

export const getDirFromUrl = (url: string) => dirname(fileURLToPath(url));
