import Anthropic from "@anthropic-ai/sdk";
import { TextBlock } from "@anthropic-ai/sdk/resources/index.mjs";
import React, { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";
import TextArea from "@/components/TextArea";
import Stats from "@/components/Stats";
import SendMessage from "@/components/SendMessage";
import ReceiveMessage from "@/components/ReceiveMessage";

const client = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY!,
  dangerouslyAllowBrowser: true,
});

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputTokenCount, setInputTokenCount] = useState(0);
  const [outputTokenCount, setOutputTokenCount] = useState(0);

  async function claudeCall(userMessage: string) {
    setIsLoading(true);
    const conversationHistory = [...messages, { role: "user", content: userMessage }];
    
    return client.messages.create({
      messages: conversationHistory.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      system:
        "You are an expert in every field with lots of experience. You should reply in everyday hindi but in english script. Fro e.g., user_input: tell me your name, your_response: Mera naam claude ha. user_input: tumhara naam kya ha, your_response: Mera naam claude ha. You give example when user ask to calrify something but example needs to be from everyday life and u give only one example until and unless user ask you to give more. adn you reply concisely and precisely no extra or unrelated responses",
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
    });
  }

  const handleInput = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, { role: "user", content: userMessage }]);
    setInput("");
    
    try {
      const res = await claudeCall(userMessage);
      setInputTokenCount(res.usage.input_tokens);
      setOutputTokenCount(res.usage.output_tokens);
      
      const assistantText = res.content
        .filter((b): b is TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      
      setMessages(prevMessages => [...prevMessages, { role: "assistant", content: assistantText || "No reply" }]);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInput("");
    setMessages([]);
    setInputTokenCount(0);
    setOutputTokenCount(0);
    setError("");
    setIsLoading(false);
  };

  return (
    <div className="mx-auto w-95/100 sm:w-50/100">
      <div className="mx-auto text-center">
        <div className="mt-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
          My GPT
        </div>
        <p className="mt-2 text-sm font-medium text-pretty text-gray-500 sm:text-md">
          Personal GPT for your needs
        </p>
      </div>

      <div className="mx-auto">
        <div className="rounded-lg p-4 min-h-40 max-h-96 overflow-y-auto" ref={(el) => {
          if (el) {
            el.scrollTop = el.scrollHeight;
          }
        }}>
          {isLoading && <Loader />}
          {error && <div className="text-red-500">{error}</div>}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                {message.role && message.role === "user" ? (
                  <SendMessage value={message.content}/>
                ) : (
                  <ReceiveMessage value={message.content}/>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 mt-2">
          <div className="flex items-center gap-6 text-sm text-slate-700">
            <Stats label="Input" value={inputTokenCount} />

            <div className="h-4 w-px bg-slate-300" />

            <Stats label="Output" value={outputTokenCount} />
          </div>
        </div>

        <TextArea
          id="input"
          name="input"
          value={input}
          onChange={(e: any) => setInput(e.target.value)}
          rows={1}
          defaultValue={""}
          placeholder="Ask anything"
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleInput();
            }
          }}
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
