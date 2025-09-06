import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function createEmbeddings(chunks, filename) {
  if (!chunks.length)
    throw new Error("No chunks provided for creating embeddings");
  if (!filename)
    throw new Error("No filename provided for creating embeddings");

  try {
    const rawEmbeds = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunks,
      encoding_format: "float",
    });

    if (!rawEmbeds?.data || rawEmbeds.data.length === 0) {
      throw new Error("OpenAI returned no embeddings");
    }

    // prepare embeddings for saving in upstash
    const embeddings = rawEmbeds.data.map((item, index) => ({
      id: uuidv4(),
      vector: item.embedding,
      metadata: {
        text: chunks[index],
        source: filename,
      },
    }));

    return embeddings;
  } catch (error) {
    console.error("OpenAI embeddings error:", err);
    throw new Error("Failed to generate embeddings from OpenAI API");
  }
}
