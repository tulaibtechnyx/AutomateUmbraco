"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Play, FileCode, Server, Wand2 } from 'lucide-react';

export default function UmbracoAutoPilot() {
  const [html, setHtml] = useState('');
  const [url, setUrl] = useState('https://localhost:44300');
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeWithGemini = async () => {
    setLoading(true);
    // Logic to call Gemini API will go here
    // For now, imagine Gemini returns the DocType JSON
    setLoading(false);
  };

  const sendToUmbraco = async () => {
    try {
      const response = await axios.post(`${url}/umbraco/api/agent/build`, jsonResult);
      alert("✅ Umbraco Updated Successfully!");
    } catch (err) {
      alert("❌ Check your Umbraco Controller or URL");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <header className="flex items-center gap-2 mb-8 border-b border-slate-700 pb-4">
        <Wand2 className="text-purple-400" />
        <h1 className="text-2xl font-bold tracking-tight">Umbraco Auto-Pilot Agent</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-400">Umbraco Local URL</label>
            <input 
              value={url} onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-400">FE HTML Snippet</label>
            <textarea 
              rows={15} value={html} onChange={(e) => setHtml(e.target.value)}
              placeholder="Paste HTML here..."
              className="w-full bg-slate-800 border border-slate-700 rounded p-4 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <button 
            onClick={analyzeWithGemini} disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded font-bold flex items-center justify-center gap-2 transition-all"
          >
            {loading ? "AI is thinking..." : <><Play size={18} /> Analyze with Gemini</>}
          </button>
        </div>

        {/* Right Column: JSON Output & Edit */}
        <div className="space-y-4">
          <label className="block text-sm font-medium mb-1 text-slate-400">Generated Umbraco Schema (Editable)</label>
          <textarea 
            rows={18} 
            value={jsonResult ? JSON.stringify(jsonResult, null, 2) : ""}
            onChange={(e) => setJsonResult(JSON.parse(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded p-4 font-mono text-sm text-green-400 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="JSON results will appear here..."
          />
          <div className="flex gap-4">
            <button 
              onClick={sendToUmbraco}
              className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Server size={18} /> Create Document Type
            </button>
            <button 
              className="flex-1 border border-slate-600 hover:bg-slate-800 py-3 rounded font-bold flex items-center justify-center gap-2 transition-all"
            >
              <FileCode size={18} /> Preview CSHTML
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}