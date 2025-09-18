"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { IoMdSend as SendIcon } from "react-icons/io";
import { FaStop as StopIcon } from "react-icons/fa";
import { DefaultChatTransport } from "ai";

const ChatPage = () => {
  const [input, setInput] = useState("");
  const { filename } = useAppContext();
  const router = useRouter();

  // redirect if no file selected
  useEffect(() => {
    if (!filename) {
      router.replace("/");
    }
  }, [filename, router]);

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        filename,
      },
    }),
  });

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  }

  if (!filename) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-2xl flex flex-col h-[80vh] border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700 text-center">
          Chatting with:{" "}
          <span className="text-blue-500 font-semibold">{filename}.pdf</span>
          {error && <div className="text-red-500">Error: {error.message}</div>}
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-black">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.parts.map((part, index) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div
                        key={`${msg.id}-${index}`}
                        className={`px-3 py-2 rounded-lg max-w-[70%] ${
                          msg.role === "user"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-800 text-white"
                        }`}
                      >
                        {part.text}
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          ))}

          {(status === "streaming" || status === "submitted") && (
            <div className="text-gray-400 text-sm">Assistant is typing...</div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex border-t border-gray-700">
          <input
            autoComplete="off"
            name="message"
            className="flex-grow px-4 py-2 text-white border-none focus:outline-none bg-black"
            placeholder="Ask any question to your pdf..."
            disabled={status !== "ready"}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />

          {status === "submitted" || status === "streaming" ? (
            <button
              onClick={stop}
              className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 disabled:bg-gray-500 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>Stop</span>
              <StopIcon />
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 disabled:bg-gray-500 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
              disabled={status !== "ready" || !input}
            >
              <span>Send</span>
              <SendIcon />
            </button>
          )}
        </form>
      </div>
    </main>
  );
};

export default ChatPage;
