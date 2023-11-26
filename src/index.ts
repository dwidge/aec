#!/usr/bin/env node
import enquirer from "enquirer";

import { getFileList } from "./getFileList.js";
import { countTokens, sendMessage } from "./commands.js";
import { models } from "./globals.js";

let contextFiles: string[] = [];
let model = models[0];
let dir = process.env.INIT_CWD ?? process.cwd();
let lastAskModelInput: string | undefined;

// Get the list of files in the current directory
const addFile = () =>
  getFileList(dir).then((files) =>
    files.length
      ? enquirer
          .prompt<{ input: string }>({
            type: "autocomplete",
            name: "input",
            message: "Add file",
            choices: files.filter((f) => !contextFiles.includes(f)),
            // @ts-ignore
            limit: 3,
          })
          .then(({ input }) => {
            contextFiles = contextFiles.concat(input);
          })
          .catch(console.log)
      : Promise.resolve(undefined)
  );

const dropFile = () =>
  contextFiles.length
    ? enquirer
        .prompt<{ input: string }>({
          type: "autocomplete",
          name: "input",
          message: "Drop file",
          choices: contextFiles.map((p) => p),
          // @ts-ignore
          limit: 3,
        })
        .then(({ input }) => {
          contextFiles = contextFiles.filter((f) => f !== input);
        })
        .catch(console.log)
    : Promise.resolve(undefined);

const chooseModel = () =>
  enquirer
    .prompt<{ input: string }>({
      type: "autocomplete",
      name: "input",
      message: "Choose model",
      choices: models,
      // @ts-ignore
      limit: 3,
    })
    .then(({ input }) => {
      model = input;
    })
    .catch(console.log);

const askModel = () =>
  enquirer
    .prompt<{ input: string }>({
      type: "input",
      name: "input",
      message: "Ask " + model,
      initial: lastAskModelInput,
    })
    .then(async ({ input }) => {
      lastAskModelInput = input;
      contextFiles = await sendMessage(input, contextFiles, dir, model);
    })
    .catch(console.log);

const commands = { addFile, dropFile, askModel, chooseModel };

const prompt = async (initial?: string) => {
  console.log(
    `${contextFiles.join(" ")} [${await countTokens(contextFiles)} tokens]`
  );
  return enquirer
    .prompt<{ input: keyof typeof commands }>({
      type: "select",
      name: "input",
      message: "Enter a command",
      choices: Object.keys(commands),
      initial: initial ? Object.keys(commands).indexOf(initial) : -1,
    })
    .then(async ({ input }): Promise<void> => {
      return commands[input]().then(() => prompt(input));
    })
    .catch(console.log);
};

prompt();
