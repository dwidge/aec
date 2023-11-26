import fs from "fs/promises";
import { llm } from "./globals.js";
import { Message } from "@dwidge/llm";
import { writeToDisk } from "./writeToDisk.js";
import { systemPrompt } from "./systemPrompt.js";

export async function sendMessage(
  input: string,
  contextFiles: string[],
  dir: string,
  model?: string
) {
  // Send a message to LLM with context
  const messages = await formatMessages(input.trim(), contextFiles);
  const { usage, content } = await llm.complete(messages, {
    model,
  });
  console.log("usage: ", usage);

  if (!content) return contextFiles;
  console.log(content);

  // Changed files must be written to disk

  // Write the changed files to disk
  const changedFileNames = await writeToDisk(dir, content);

  // New files should be added to contextFiles after creation
  return unique(contextFiles.concat(changedFileNames));
}

function unique(array: string[]): string[] {
  return Array.from(new Set(array));
}

export async function countTokens(contextFiles: string[]) {
  // Show how many tokens will be used per file added
  const messages = await formatMessages("", contextFiles);
  return await llm.countTokens(messages);
}

async function formatMessages(
  message: string,
  files: string[]
): Promise<Message[]> {
  return [
    {
      role: "system",
      content: await systemPrompt,
    },
    {
      role: "user",
      content: (
        await Promise.all(
          files.map(
            async (file) =>
              `${file} // Original file \n${"```"}\n${await fs.readFile(file, {
                encoding: "utf8",
              })}\n${"```"}`
          )
        )
      )
        .concat(message)
        .join("\n\n"),
    },
  ];
}
