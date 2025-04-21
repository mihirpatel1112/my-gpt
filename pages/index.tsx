import Anthropic from "@anthropic-ai/sdk";
import { TextBlock } from "@anthropic-ai/sdk/resources/index.mjs";
import React, { useState } from "react";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";
import TextArea from "@/components/TextArea";

const client = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY!,
  dangerouslyAllowBrowser: true,
});

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputTokenCount, setInputTokenCount] = useState(0);
  const [outputTokenCount, setOutputTokenCount] = useState(0);

  async function claudeCall(message: string) {
    setIsLoading(true);
    return client.messages.create({
      messages: [{ role: "user", content: message }],
      system:
        "You are an expert in every field with lots of experience. You should reply in everyday hindi but in english script. Fro e.g., user_input: tell me your name, your_response: Mera naam claude ha. user_input: tumhara naam kya ha, your_response: Mera naam claude ha. You give example when user ask to calrify something but example needs to be from everyday life and u give only one example until and unless user ask you to give more. adn you reply concisely and precisely no extra or unrelated responses",
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
    });
  }

  const handleInput = async () => {
    const res = await claudeCall(input);
    setInputTokenCount(res.usage.input_tokens);
    setOutputTokenCount(res.usage.output_tokens);
    const assistantText = res.content
      .filter((b): b is TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    setIsLoading(false);
    setResponse(assistantText || "No reply");
  };

  const handleReset = () => {
    setInput("");
    setResponse("");
    setInputTokenCount(0);
    setOutputTokenCount(0);
    setError("");
    setIsLoading(false);
  };

  return (
    <div>
      <div className="mx-auto text-center">
        <div className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl">
          My GPT
        </div>
        <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Personal GPT for your needs
        </p>
      </div>

      <div className="mx-auto">
        <div className="bg-slate-200 rounded-lg p-4">
          {isLoading ? <Loader /> : <div>{response}</div>}
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center gap-6 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-slate-200 px-2 py-0.5 font-medium text-slate-600">
                Input
              </span>
              <span className="tabular-nums">{inputTokenCount}</span>
            </div>

            <div className="h-4 w-px bg-slate-300" />

            <div className="flex items-center gap-2">
              <span className="rounded-md bg-slate-200 px-2 py-0.5 font-medium text-slate-600">
                Output
              </span>
              <span className="tabular-nums">{outputTokenCount}</span>
            </div>
          </div>
          
            

        </div>

        <TextArea
              id="input"
              name="input"
              value={input}
              onChange={(e: any) => setInput((e.target.value))}
              rows={1}
              defaultValue={""}
              placeholder="Ask anything"
          />

        <div className="mt-10">
          <button
            type="submit"
            onClick={handleInput}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
        <div className="">
          <button
            type="reset"
            onClick={handleReset}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full rounded-md bg-red-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Clear
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
