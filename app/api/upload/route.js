import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createEmbeddings, saveEmbeddings } from "../helpers";
import pdfParse from "pdf-parse";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files allowed" },
        { status: 400 }
      );
    }
    //convert file to buffer
    let buffer;
    try {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } catch (err) {
      console.error("Buffer conversion error:", err);
      return NextResponse.json(
        { error: "Failed to read uploaded file", success: false },
        { status: 500 }
      );
    }

    //parse pdf
    let pdfData;
    try {
      pdfData = await pdfParse(buffer);
    } catch (err) {
      console.error("PDF parsing error:", err);
      return NextResponse.json(
        { error: "Failed to parse PDF", success: false },
        { status: 500 }
      );
    }

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return NextResponse.json(
        { error: "No readable text found in PDF", success: false },
        { status: 400 }
      );
    }

    // chunk text
    let chunks;
    try {
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 300,
        chunkOverlap: 70,
      });
      chunks = await splitter.splitText(pdfData.text);
    } catch (err) {
      console.error("Chunking error:", err);
      return NextResponse.json(
        { error: "Failed to split PDF text into chunks", success: false },
        { status: 500 }
      );
    }

    if (!chunks.length) {
      return NextResponse.json(
        { error: "PDF produced no valid chunks", success: false },
        { status: 400 }
      );
    }

    // create embeddings
    let embeddings;

    try {
      embeddings = await createEmbeddings(chunks, file.name.split(".")[0]);
    } catch (error) {
      console.error("Embedding creation error:", error);
      return NextResponse.json(
        { error: "Failed to create embeddings", success: false },
        { status: 500 }
      );
    }

    // save embeddings
    try {
      await saveEmbeddings(embeddings);
    } catch (error) {
      console.error("Saving embeddings error:", error);
      return NextResponse.json(
        { error: "Failed to save embeddings", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "PDF processed and ingested in DB!",
      success: true,
    });
  } catch (error) {
    console.error("Unexpected upload error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
