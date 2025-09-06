"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { IoMdSend as SendIcon } from "react-icons/io";

const ChatPage = () => {
  const { filename } = useAppContext();
  const router = useRouter();
  const [input, setInput] = useState("");

  // redirect if no file selected
  useEffect(() => {
    if (!filename) {
      router.replace("/");
    }
  }, [filename, router]);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

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
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-black">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[70%] ${
                  msg.role === "user"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-800 text-white"
                }`}
              >
                {msg.parts.map((part, i) =>
                  part.type === "text" ? <span key={i}>{part.text}</span> : null
                )}
              </div>
            </div>
          ))}

          {status === "streaming" && (
            <div className="text-gray-400 text-sm">Assistant is typing...</div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            sendMessage({ text: input });
            setInput("");
          }}
          className="flex border-t border-gray-700"
        >
          <input
            className="flex-grow px-4 py-2  text-white border-none focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something about the PDF..."
            disabled={status !== "ready"}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 disabled:bg-gray-500 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
            disabled={status !== "ready"}
          >
            <span>Send</span>
            <SendIcon />
          </button>
        </form>
      </div>
    </main>
  );
};

export default ChatPage;
