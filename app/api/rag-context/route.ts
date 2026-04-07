import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json({ error: "Missing HTML input" }, { status: 400 });
    }

    const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
    const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'umbraco-agent';
    const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_KEY || process.env.OPENAI_API_KEY;

    if (!PINECONE_API_KEY || !OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing Pinecone or OpenAI API keys in environment vars" }, { status: 500 });
    }

    const pc = new Pinecone({ apiKey: PINECONE_API_KEY });
    const ai = new OpenAI({ apiKey: OPENAI_API_KEY });

    // 1. Generate an embedding for the user's input HTML
    const response = await ai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: html
    });

    const embeddingValues = response.data?.[0]?.embedding;
    if (!embeddingValues) throw new Error("Failed to generate embedding for input.");

    // 2. Query Pinecone for the Top 3 similar components
    const index = pc.index(PINECONE_INDEX_NAME);
    const queryResponse = await index.namespace('umbraco-components').query({
      vector: embeddingValues,
      topK: 3,
      includeMetadata: true
    });

    // 3. Extract the components' code from metadata
    const similarComponents = queryResponse.matches.map(match => {
      return {
        id: match.id,
        score: match.score,
        code: match.metadata?.code || ""
      };
    });

    return NextResponse.json({ success: true, matches: similarComponents });
  } catch (error: any) {
    console.error("RAG Context Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
