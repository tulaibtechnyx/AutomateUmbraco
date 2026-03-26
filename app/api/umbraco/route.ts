import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, jsonResult } = body;
    console.log("BE url", url);
    console.log("BE jsonResult", jsonResult);
    if (!url || !jsonResult) {
      return NextResponse.json({ error: "Missing url or jsonResult" }, { status: 400 });
    }

    // Proxy the request from the Next.js backend to bypass local self-signed SSL certificate issues
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    const destination = `${url.replace(/\/$/, '')}/umbraco/api/agent/build`;

    const response = await axios.post(destination, jsonResult, {
      httpsAgent: agent,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json(response.data || { success: true });
  } catch (error: any) {
    console.error("Proxy error to Umbraco:", error.response?.data || error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
