// node scripts/seed-pinecone.mjs scrip to run code

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// 1. Resolve ENV File precisely from the script location
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'umbraco-agent';
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_KEY;

if (!PINECONE_API_KEY || PINECONE_API_KEY.includes('your_pinecone')) {
    console.error("❌ ERROR: Missing or invalid PINECONE_API_KEY in .env.local");
    console.log("👉 Go to https://www.pinecone.io/ -> Create a free account -> Get an API Key.");
    process.exit(1);
}

// 2. Initialize Pinecone & OpenAI SDKs
const pc = new Pinecone({ apiKey: PINECONE_API_KEY });
const ai = new OpenAI({ apiKey: OPENAI_API_KEY || '' });

async function runSeeder() {
    console.log("🚀 Starting Vector Database Seeding Process...");

    // Connect to specific Pinecone Index
    const index = pc.index(PINECONE_INDEX_NAME);

    // 3. Read Training Files directly from your live Umbraco repository
    const dataDir = 'D:\\UMBRACO BE TECHNYX\\DMC_UMBRACO\\DMC.Web\\Views\\Partials\\Components';
    if (!fs.existsSync(dataDir)) {
        console.error(`❌ ERROR: Component folder not found at ${dataDir}!`);
        return;
    }

    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.cshtml') || f.endsWith('.md') || f.endsWith('.txt'));
    if (files.length === 0) {
        console.error("⚠️ WARNING: No acceptable code files found in /training-data folder.");
        return;
    }

    console.log(`📂 Found ${files.length} training components. Generating Vector Embeddings...`);

    const vectorsToUpload = [];
    let lastOpenAiError = null;

    // 4. Transform Code -> Mathematical Vectors (Embeddings)
    for (const file of files) {
        if (file === "PLACE-YOUR-CSHTML-FILES-HERE.md") continue;

        const filePath = path.join(dataDir, file);
        const codeContent = fs.readFileSync(filePath, 'utf-8');
        const componentId = file.replace(/\.(cshtml|md|txt)$/i, '');

        console.log(`🧠 Generating Vector for: [${componentId}]...`);

        try {
            // Embed the component using OpenAI's text-embedding-ada-002
            // text-embedding-ada-002 defaults to 1536 dimensions! Make sure your Pinecone Index matches this!
            const response = await ai.embeddings.create({
                model: 'text-embedding-ada-002',
                input: `Umbraco Component Architecture:\nComponent Name: ${componentId}\nCode Implementation:\n${codeContent}`
            });

            // The resulting 1536 vector coordinate integers
            const embeddingValues = response.data?.[0]?.embedding;
            if (!embeddingValues) throw new Error("No values returned by embeddings.");

            // Ensure code doesn't exceed Pinecone's 40KB metadata limit (which causes silent list clearing in the SDK!)
            const truncatedCode = codeContent.length > 30000 ? codeContent.substring(0, 30000) + "...[truncated]" : codeContent;

            vectorsToUpload.push({
                id: componentId,
                values: embeddingValues,
                metadata: {
                    fileName: file,
                    // Injecting raw code so we can actively recall it verbatim in the final Search Query phase!
                    code: truncatedCode
                }
            });
        } catch (embeddingError) {
            lastOpenAiError = embeddingError.message;
            console.error(`❌ FAILED generating embedding for ${file}:`, embeddingError.message);
        }
    }

    if (vectorsToUpload.length === 0) {
        console.error("\n=======================================================");
        console.error("🛑 CRITICAL UPLOAD HALTED: 0 files were successfully embedded.");
        console.error("=======================================================");
        console.error("This is an OPENAI ISSUE, not a Pinecone issue.");
        console.error(`Your script attempted to read ${files.length} files but OpenAI rejected every single request.`);
        if (!OPENAI_API_KEY) {
            console.error("👉 REASON: You forgot to put NEXT_PUBLIC_OPENAI_KEY in your .env.local!");
        } else {
            console.error("👉 REASON: OpenAI rejected your API Key. Check the following:");
            console.error("     1. Do you actually have paid credits loaded on platform.openai.com? (Free tiers often block embedding APIs).");
            console.error("     2. Is your API key copy-pasted correctly in .env.local?");
            console.error(`\n🔎 LAST OPENAI ERROR TRACE:\n   "${lastOpenAiError}"`);
        }
        process.exit(1);
    }

    // 5. Upload precisely computed Vectors into our live Pinecone Vector Index in batches
    console.log(`📡 Sending ${vectorsToUpload.length} specific Vectors into Pinecone Index: '${PINECONE_INDEX_NAME}'`);

    try {
        const batchSize = 10;
        for (let i = 0; i < vectorsToUpload.length; i += batchSize) {
            const batch = vectorsToUpload.slice(i, i + batchSize);
            console.log(`   ⏳ Upserting batch ${i} to ${i + batch.length}...`);
            await index.namespace('umbraco-components').upsert(batch);
        }
        console.log("✅ SUCCESS! Vector Database seeded. Your Umbraco Bot now intrinsically understands your architecture.");
    } catch (err) {
        console.error("\n❌ UPLOAD FAILED! Read the error closely. Make sure your Pinecone Index exists and explicitly defines '1536' dimensions!" + err);
        console.error(err.message);
    }
}

runSeeder();
