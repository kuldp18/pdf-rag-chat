import { createQueryVector, queryEmbeddings } from "../helpers";
import { convertToModelMessages, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages, filename } = await req.json();
    const input = messages[messages.length - 1].parts[0].text;

    if (!input) {
      return NextResponse.json(
        { error: "No input message provided" },
        {
          status: 400,
        }
      );
    }
    if (!filename) {
      return NextResponse.json(
        { error: "No filename provided" },
        {
          status: 400,
        }
      );
    }

    // 1. Embed user query + retrieve context
    const queryVector = await createQueryVector(input);
    const results = await queryEmbeddings(queryVector, filename, 10);
    const context = results.map((r) => r.metadata?.text).join("\n\n");

    // 2. Generate response
    const result = streamText({
      model: openai("gpt-4.1-nano-2025-04-14"),
      system:
        "You are a helpful assistant. Use the provided PDF context to answer the user questions. Keep the answers concise, brief and relevant to the user's query. Respond in simple text and avoid writing in markdown." +
        "If it cannot be answered from the context, reply: 'I could not find that in the PDF.'" +
        `Context: ${context}`,
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      {
        error: "Failed to stream chat response",
      },
      { status: 500 }
    );
  }
}
