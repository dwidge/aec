import { OpenAILLM } from "@dwidge/llm";

export const llm = new OpenAILLM(process.env.OPENAI_API_KEY ?? "");
export const models = ["gpt-3.5-turbo-1106", "gpt-4-1106-preview"];
