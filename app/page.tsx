"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Play, FileCode, Server, Wand2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
const systemInstruction = `
      You are an elite Umbraco 17 Architect.
      Analyze the provided HTML and convert it into an Umbraco Block List JSON schema.
      Map the HTML elements to valid Umbraco-specific Data Types (e.g., 'Umbraco.TextBox', 'Umbraco.MediaPicker3', 'Umbraco.TinyMCE', 'Umbraco.MultiUrlPicker', 'Umbraco.BlockList').

      CRITICAL UMBRACO RAZOR ARCHITECTURE RULES:
      1. Namespaces: Always include:
         @using DMC.Common.Helpers
         @using DMC.Common.Models.CMS
      2. Inheritance: Always inherit from the generated model using PascalCase of the alias:
         @inherits Umbraco.Cms.Web.Common.Views.UmbracoViewPage<DMC.Common.Models.CMS.YourModelName>
      3. Global Variables: Define variables at the top:
         @{
             var ViewLocation = ViewContext.ExecutingFilePath;
             var currentLanguage = Context.Request.GetCurrentLanguage();
         }
      4. Links/CTAs: Always map links/buttons as 'Umbraco.MultiUrlPicker' (PrimaryCta, SecondaryCta). Check them using:
         var hasPrimaryCta = Common.IsCtaNotNull(Model.PrimaryCta);
         Render logic: <a href="@Model.PrimaryCta.Url" target="@(Model.PrimaryCta.Target ?? "_self")">@Model.PrimaryCta.Name</a>
      5. Rich Text (RTE): Map descriptions to 'Umbraco.TinyMCE'. Use this helper to render: 
         @Html.Raw(Model.Description.ReplacePTagFromRTE().ToString())
      6. Tracing: Wrap the main output section with:
         @using (new FunctionTracer(true, Model?.ContentType?.Alias ?? string.Empty)) {
             if (Model != null) {
                 try {
                     // Your Component HTML
                 } catch (Exception ex) { throw; }
             }
         }
      7. Block Lists (Tables/Lists): If mapping repeating items into a Block List, iterate using:
         var items = Model?.PropertyAlias?.ToList() ?? new List<Umbraco.Cms.Core.Models.Blocks.BlockListItem>();
         foreach (var blockItem in items) { var row = blockItem.Content as ItemModelName; }

      Required JSON structure:
      {
        "alias": "lowerCamelCaseAlias",
        "name": "Human Readable Name",
        "properties": [{ "alias": "propertyAlias", "name": "Property Name", "typeAlias": "Umbraco Type Alias" }],
        "razorCode": "The equivalent Umbraco Razor (.cshtml) code fully adhering to the CRITICAL ARCHITECTURE RULES above."
      }
      
      Return ONLY raw, perfectly valid JSON without exactly following the structure without markdown.
    `;
export default function UmbracoAutoPilot() {
  const [html, setHtml] = useState('');
  const [url, setUrl] = useState('https://localhost:44331');
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  // Inside your component's state
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');

  const analyzeWithAI = async () => {
    setLoading(true);
    try {
      let resultText = "";
      if (provider === 'gemini') {
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY || '' });
        const response = await ai.models.generateContent({
          model: selectedModel,
          contents: [{ role: 'user', parts: [{ text: systemInstruction + "\n\nHTML:\n" + html }] }],
          config: { responseMimeType: 'application/json' }
        });
        resultText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } else {
        const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY || '', dangerouslyAllowBrowser: true });
        const response = await openai.chat.completions.create({
          model: selectedModel,
          messages: [{ role: "system", content: systemInstruction }, { role: "user", content: html }],
          response_format: { type: "json_object" }
        });
        resultText = response.choices[0].message.content || "";
      }

      const cleanJsonText = resultText.replace(/```json/gi, "").replace(/```/g, "").trim();
      setJsonResult(JSON.parse(cleanJsonText));
    } catch (error: any) {
      alert("AI Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const sendToUmbraco = async () => {
    try {
      const response = await axios.post('/api/umbraco', { url, jsonResult });
      alert("✅ Umbraco Updated Successfully!");
    } catch (err: any) {
      console.error(err);
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
          <div className="flex gap-4 mb-4">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded p-2 text-sm"
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI</option>
            </select>

            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded p-2 text-sm"
            >
              {provider === 'gemini' ? (
                <>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                </>
              ) : (
                <>
                  <option value="gpt-5-mini">GPT-5 Mini</option>
                  <option value="gpt-4o">GPT-4o</option>
                </>
              )}
            </select>
          </div>
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
            onClick={analyzeWithAI} disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded font-bold flex items-center justify-center gap-2 transition-all"
          >
            {loading ? "AI is thinking..." : <><Play size={18} /> Analyze with Gemini</>}
          </button>
        </div>

        {/* Right Column: JSON Output & Edit */}
        <div className="space-y-4">
          {/* Replace your JSON textarea with this logic */}
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center z-10 rounded">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-purple-400 font-medium animate-pulse">Gemini is deconstructing your HTML...</p>
              </div>
            )}
            <textarea
              rows={18}
              value={jsonResult ? JSON.stringify(jsonResult, null, 2) : ""}
              onChange={(e) => setJsonResult(JSON.parse(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded p-4 font-mono text-sm text-green-400 outline-none"
            />
          </div>
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