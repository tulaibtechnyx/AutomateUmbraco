// node scripts/seed-pinecone.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// ─── Direct REST upsert ────────────────────────────────────────────────────
// Bypasses the Pinecone SDK's upsert entirely to avoid the
// "Must pass in at least 1 record" SDK validation bug seen in some versions.
async function pineconeUpsertRaw(host, apiKey, namespace, vectors) {
    const url = `https://${host}/vectors/upsert`;
    const body = JSON.stringify({ vectors, namespace });

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Api-Key': apiKey,
            'Content-Type': 'application/json',
            'X-Pinecone-API-Version': '2024-07'
        },
        body
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Pinecone REST ${res.status}: ${errText}`);
    }

    return await res.json();
}

// ─── ENV Setup ────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'umbraco-agent';
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_KEY;

if (!PINECONE_API_KEY || PINECONE_API_KEY.includes('your_pinecone')) {
    console.error("❌ ERROR: Missing or invalid PINECONE_API_KEY in .env.local");
    process.exit(1);
}
if (!OPENAI_API_KEY) {
    console.error("❌ ERROR: Missing NEXT_PUBLIC_OPENAI_KEY in .env.local");
    process.exit(1);
}

// ─── SDK clients (used only for describeIndex + embeddings) ───────────────
const pc = new Pinecone({ apiKey: PINECONE_API_KEY });
const ai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function runSeeder() {
    console.log("🚀 Starting Vector Database Seeding Process...");
    console.log(`📌 Target Pinecone Index: "${PINECONE_INDEX_NAME}"`);

    // ── 1. Verify index ──────────────────────────────────────────────────
    let indexHost;
    try {
        const desc = await pc.describeIndex(PINECONE_INDEX_NAME);
        console.log(`\n📊 Pinecone Index Info:`);
        console.log(JSON.stringify(desc, null, 2));

        if (desc?.dimension && desc.dimension !== 1536) {
            console.error(`❌ DIMENSION MISMATCH: index=${desc.dimension}, embeddings=1536`);
            console.error(`   Recreate the index with 1536 dimensions.`);
            process.exit(1);
        }

        indexHost = desc?.host;
        if (!indexHost) throw new Error("host field missing from describeIndex response");

        console.log(`✅ Index verified — host: ${indexHost}\n`);
    } catch (e) {
        console.error(`❌ Could not access Pinecone index "${PINECONE_INDEX_NAME}": ${e.message}`);
        process.exit(1);
    }

    // ── 2. Read component files ──────────────────────────────────────────
    const dataDir = 'C:\\ModelTraining';
    if (!fs.existsSync(dataDir)) {
        console.error(`❌ Component folder not found: ${dataDir}`);
        return;
    }

    const files = fs.readdirSync(dataDir).filter(f =>
        f.endsWith('.cshtml') || f.endsWith('.md') || f.endsWith('.txt')
    );

    if (files.length === 0) {
        console.error("⚠️ No .cshtml / .md / .txt files found.");
        return;
    }

    console.log(`📂 Found ${files.length} training components. Generating embeddings...\n`);

    // ── 3. Generate embeddings ───────────────────────────────────────────
    const vectorsToUpload = [];
    const failedFiles = [];

    for (const file of files) {
        if (file === "PLACE-YOUR-CSHTML-FILES-HERE.md") continue;

        const filePath = path.join(dataDir, file);
        const codeContent = fs.readFileSync(filePath, 'utf-8');
        const componentId = file.replace(/\.(cshtml|md|txt)$/i, '');

        console.log(`🧠 Embedding: [${componentId}]...`);

        try {
            const response = await ai.embeddings.create({
                model: 'text-embedding-ada-002',
                input: `Umbraco Component Architecture:\nComponent Name: ${componentId}\nCode Implementation:\n${codeContent}`
            });

            const embeddingValues = response.data?.[0]?.embedding;
            if (!embeddingValues || embeddingValues.length === 0) {
                throw new Error("OpenAI returned empty embedding.");
            }
            if (embeddingValues.length !== 1536) {
                throw new Error(`Wrong dims: ${embeddingValues.length}`);
            }

            // Safe metadata — stay well under 40KB Pinecone limit
            let code = codeContent;
            if (Buffer.byteLength(JSON.stringify({ fileName: file, code }), 'utf8') > 35000) {
                code = codeContent.substring(0, 18000) + "\n...[truncated]";
                console.warn(`   ⚠️ [${componentId}] truncated to fit metadata limit`);
            }

            // Build a plain object with a plain number array — no typed arrays
            vectorsToUpload.push({
                id: componentId,
                values: Array.from(embeddingValues),   // plain JS Array, not Float32Array
                metadata: { fileName: file, code }
            });

            console.log(`   ✅ [${componentId}] — ${embeddingValues.length} dims`);

        } catch (err) {
            failedFiles.push(file);
            console.error(`   ❌ FAILED [${file}]: ${err.message}`);
        }
    }

    console.log(`\n${'─'.repeat(45)}`);
    console.log(`📊 Embedding phase: ✅ ${vectorsToUpload.length} OK  ❌ ${failedFiles.length} failed`);
    if (failedFiles.length) console.log(`   Failed: ${failedFiles.join(', ')}`);
    console.log(`${'─'.repeat(45)}\n`);

    if (vectorsToUpload.length === 0) {
        console.error("🛑 Nothing to upload. Exiting.");
        process.exit(1);
    }

    // ── 4. Upsert via direct REST API (bypasses SDK bug) ─────────────────
    console.log(`📡 Uploading ${vectorsToUpload.length} vectors via Pinecone REST API...`);
    console.log(`   Host:      ${indexHost}`);
    console.log(`   Namespace: umbraco-components\n`);

    let totalUploaded = 0;
    let totalFailed = 0;
    const batchSize = 10;

    for (let i = 0; i < vectorsToUpload.length; i += batchSize) {
        const batch = vectorsToUpload.slice(i, i + batchSize);
        const batchNum = Math.floor(i / batchSize) + 1;
        const batchIds = batch.map(v => v.id).join(', ');

        console.log(`⏳ Batch ${batchNum}: [${batchIds}]`);

        try {
            const result = await pineconeUpsertRaw(
                indexHost,
                PINECONE_API_KEY,
                'umbraco-components',
                batch
            );
            totalUploaded += batch.length;
            console.log(`   ✅ Batch ${batchNum} uploaded — response:`, JSON.stringify(result), '\n');

        } catch (batchError) {
            console.error(`   ❌ Batch ${batchNum} failed: ${batchError.message}`);
            console.log(`   🔁 Retrying individually...\n`);

            for (const vector of batch) {
                try {
                    const result = await pineconeUpsertRaw(
                        indexHost,
                        PINECONE_API_KEY,
                        'umbraco-components',
                        [vector]
                    );
                    totalUploaded += 1;
                    console.log(`      ✅ [${vector.id}] OK — response:`, JSON.stringify(result));
                } catch (singleError) {
                    totalFailed += 1;
                    console.error(`      ❌ [${vector.id}] FAILED: ${singleError.message}`);
                    console.error(`         Metadata size: ${Buffer.byteLength(JSON.stringify(vector.metadata), 'utf8')} bytes`);
                    console.error(`         Vector dims:   ${vector.values?.length}`);
                }
            }
            console.log('');
        }
    }

    // ── 5. Final summary ─────────────────────────────────────────────────
    console.log(`\n${'═'.repeat(45)}`);
    console.log(`🏁 Seeding Complete!`);
    console.log(`   ✅ Uploaded:           ${totalUploaded}`);
    console.log(`   ❌ Upload failures:    ${totalFailed}`);
    console.log(`   ⚠️  Embedding failures: ${failedFiles.length}`);

    if (totalFailed === 0 && failedFiles.length === 0) {
        console.log(`\n🎉 All ${totalUploaded} components seeded successfully!`);
        console.log(`   Your Umbraco Bot now understands your full component architecture.`);
    } else {
        console.log(`\n⚠️  Some records failed — review the logs above.`);
    }
    console.log(`${'═'.repeat(45)}\n`);
}

runSeeder();
