import { describe, it } from "node:test";
import { expect } from "expect";
import { parseBundle } from "./parseBundle.js";

const aFile = "m.js";
const aContent =
  "let a=1\nlet b=2\nlet c=3\nfunction m(){}\nlet d=4\nlet e=5\nlet f=6\n";

describe("parseBundle", () => {
  it("should parse bundle into a map of file names and their contents", async () => {
    const bundle = "\n" + aFile + "\n" + "```\n" + aContent + "```\n";

    const filesMap = await parseBundle(bundle);
    expect(filesMap.get("m.js")).toBe(
      "let a=1\nlet b=2\nlet c=3\nfunction m(){}\nlet d=4\nlet e=5\nlet f=6\n"
    );
  });
});

describe("parseBundle", () => {
  it("should parse bundle into a map of file names and their contents", async () => {
    const bundle = "\n" + aFile + "\n" + "```typescript\n" + aContent + "```\n";

    const filesMap = await parseBundle(bundle);
    expect(filesMap.get("m.js")).toBe(
      "let a=1\nlet b=2\nlet c=3\nfunction m(){}\nlet d=4\nlet e=5\nlet f=6\n"
    );
  });
});
