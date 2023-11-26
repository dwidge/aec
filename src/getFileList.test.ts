import { describe, it, beforeEach, afterEach } from "node:test";
import { expect } from "expect";
import { getFileList } from "./getFileList.js";
import fs from "fs/promises";
import os from "os";
import path from "path";

describe("getFileList", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "test-"));
    await fs.mkdir(path.join(tempDir, "testFiles"));
    await fs.writeFile(
      path.join(tempDir, "testFiles", "file1.txt"),
      "File 1 content"
    );
    await fs.writeFile(
      path.join(tempDir, "testFiles", "file2.txt"),
      "File 2 content"
    );
    await fs.mkdir(path.join(tempDir, "testFiles", "subdir"));
    await fs.writeFile(
      path.join(tempDir, "testFiles", "subdir", "file3.txt"),
      "File 3 content"
    );
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true });
  });

  it("should return a list of files in a directory", async () => {
    const fileList = await getFileList(path.join(tempDir, "testFiles"));
    expect(fileList).toEqual(["file1.txt", "file2.txt", "subdir/file3.txt"]);
  });

  it("should return an empty list if the directory is empty", async () => {
    const emptyDir = await fs.mkdtemp(path.join(os.tmpdir(), "empty-test-"));
    const emptyList = await getFileList(emptyDir);
    expect(emptyList).toEqual([]);
  });
});
