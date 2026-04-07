"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Play, FileCode, Server, Wand2, Settings, Code, Trash2, Code2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import Editor from '@monaco-editor/react';
import { getGroupedDataTypes } from './data/umbracoDataTypes';
import { systemInstruction } from './data/Pormpt';
export default function UmbracoAutoPilot() {
  const [html, setHtml] = useState('');
  const [url, setUrl] = useState('https://localhost:44331');
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  const [activeTab, setActiveTab] = useState<'properties' | 'razor' | 'json'>('properties');

  const groupedDataTypes = getGroupedDataTypes();

  const analyzeWithAI = async () => {
    setLoading(true);
    setJsonResult(null);
    try {
      // 1. Fetch relevant Umbraco examples from RAG backend
      let ragContextText = "";
      try {
        const ragResponse = await fetch('/api/rag-context', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ html })
        });
        const ragData = await ragResponse.json();

        if (ragData.success && ragData.matches?.length > 0) {
          ragContextText = "Here are some similar Umbraco components from our project to use as examples/context:\n\n";
          ragData.matches.forEach((match: any, index: number) => {
            ragContextText += `--- Example ${index + 1} (Similarity Score: ${match.score}) ---\n${match.code}\n\n`;
          });
          console.log("RAG Context retrieved:", ragData.matches.length, "matches");
        }
      } catch (ragError) {
        console.error("Failed to fetch RAG context, falling back to base instruction:", ragError);
      }

      // 2. Append the retrieved examples to the system prompt
      const finalSystemInstruction = systemInstruction + "\n\nAnalyze the provided HTML and convert it into an Umbraco Block List JSON schema.\nMap the HTML elements to valid Umbraco-specific Data Types (e.g., 'Umbraco.TextBox', 'Umbraco.MediaPicker3', 'Rich Text Editor', 'Umbraco.MultiUrlPicker', 'Umbraco.BlockList').\n\nCRITICAL UMBRACO RAZOR ARCHITECTURE RULES:\n4. Links/CTAs: Always map individual links/buttons as 'Umbraco.MultiUrlPicker' (PrimaryCta, SecondaryCta). Check them using:\n   var hasPrimaryCta = Common.IsCtaNotNull(Model.PrimaryCta);\n   Render logic: <a href=\"@Model.PrimaryCta.Url\" target=\"@(Model.PrimaryCta.Target ?? \"_self\")\">@Model.PrimaryCta.Name</a>\n5. Rich Text (RTE): Map descriptions to 'Rich Text Editor'. Use this helper to render: \n   @Html.Raw(Model.Description.ReplacePTagFromRTE().ToString())" + (ragContextText ? "\n\n" + ragContextText : "");

      // 3. Call the selected AI Model
      let resultText = "";
      if (provider === 'gemini') {
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY || '' });
        const response = await ai.models.generateContent({
          model: selectedModel,
          contents: [{ role: 'user', parts: [{ text: finalSystemInstruction + "\n\nHTML:\n" + html }] }],
          config: { responseMimeType: 'application/json' }
        });
        resultText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } else {
        const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY || '', dangerouslyAllowBrowser: true });
        const response = await openai.chat.completions.create({
          model: selectedModel,
          messages: [{ role: "system", content: finalSystemInstruction }, { role: "user", content: html }],
          response_format: { type: "json_object" }
        });
        resultText = response.choices[0].message.content || "";
      }

      const cleanJsonText = resultText.replace(/```json/gi, "").replace(/```/g, "").trim();
      setJsonResult(JSON.parse(cleanJsonText));
      setActiveTab('properties');
    } catch (error: any) {
      alert("AI Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendToUmbraco = async () => {
    try {
      if (!jsonResult) return;
      await axios.post('/api/umbraco', { url, jsonResult });
      alert("✅ Umbraco Updated Successfully!");
    } catch (err: any) {
      console.error(err);
      alert("❌ Check your Umbraco Controller or URL");
    }
  };

  const updateProperty = (index: number, field: string, value: string) => {
    const newProps = [...jsonResult.properties];
    newProps[index][field] = value;
    setJsonResult({ ...jsonResult, properties: newProps });
  };

  const deleteProperty = (index: number) => {
    const newProps = [...jsonResult.properties];
    newProps.splice(index, 1);
    setJsonResult({ ...jsonResult, properties: newProps });
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
                  <option value="gpt-4o-mini">GPT-4o-mini</option>
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
            onClick={analyzeWithAI} disabled={loading || !html.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-3 rounded font-bold flex items-center justify-center gap-2 transition-all"
          >
            {loading ? "AI is thinking..." : <><Play size={18} /> Analyze with {provider.toUpperCase()}</>}
          </button>
        </div>

        {/* Right Column: Output & Visualization */}
        <div className="space-y-4 bg-slate-950 p-6 rounded-lg relative min-h-[500px] border border-slate-800 flex flex-col">
          {loading && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center z-10 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-purple-400 font-medium animate-pulse">Deconstructing HTML to Umbraco Schema...</p>
            </div>
          )}

          {!jsonResult && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
              <Code2 size={48} className="mb-4 opacity-20" />
              <p>Waiting for AI analysis...</p>
            </div>
          )}

          {jsonResult && (
            <>
              {/* Header Info */}
              <div className="flex gap-4 border-b border-slate-800 pb-4">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 block mb-1">Doc Type Name</label>
                  <input
                    value={jsonResult.name}
                    onChange={(e) => setJsonResult({ ...jsonResult, name: e.target.value })}
                    className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 w-full text-sm font-semibold"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-500 block mb-1">Doc Type Alias</label>
                  <input
                    value={jsonResult.alias}
                    onChange={(e) => setJsonResult({ ...jsonResult, alias: e.target.value })}
                    className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 w-full text-sm font-mono text-blue-400"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-slate-800">
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${activeTab === 'properties' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Settings size={16} /> Data Properties
                </button>
                <button
                  onClick={() => setActiveTab('razor')}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${activeTab === 'razor' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <FileCode size={16} /> CSHTML View Editor
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${activeTab === 'json' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Code size={16} /> Raw JSON
                </button>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto min-h-0 py-2">
                {activeTab === 'properties' && (
                  <div className="space-y-3 pr-2">
                    {jsonResult.properties?.map((prop: any, idx: number) => (
                      <div key={idx} className="bg-slate-900 border border-slate-700/50 p-3 rounded flex gap-3 items-start">
                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                            <input
                              value={prop.name}
                              placeholder="Name"
                              onChange={(e) => updateProperty(idx, 'name', e.target.value)}
                              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 w-1/2 text-sm"
                            />
                            <input
                              value={prop.alias}
                              placeholder="Alias"
                              onChange={(e) => updateProperty(idx, 'alias', e.target.value)}
                              className="bg-slate-800 border border-slate-700 text-blue-300 rounded px-2 py-1 w-1/2 text-sm font-mono"
                            />
                          </div>
                          <select
                            value={prop.typeAlias}
                            onChange={(e) => updateProperty(idx, 'typeAlias', e.target.value)}
                            className="bg-slate-800 border border-slate-600 rounded px-2 py-1 w-full text-sm text-green-300 focus:border-purple-500"
                          >
                            {/* Fallback for AI generated custom ones */}
                            {!Object.values(groupedDataTypes).flat().find(t => t.alias === prop.typeAlias) && (
                              <option value={prop.typeAlias}>{prop.typeAlias} (Custom/AI)</option>
                            )}

                            {Object.entries(groupedDataTypes).map(([groupName, types]) => (
                              <optgroup label={groupName} key={groupName}>
                                {types.map(t => (
                                  <option key={t.alias} value={t.alias}>{t.label} ({t.alias})</option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => deleteProperty(idx)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                          title="Remove Static/Unwanted Property"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setJsonResult({ ...jsonResult, properties: [...jsonResult.properties, { name: 'New Property', alias: 'newProperty', typeAlias: 'Umbraco.TextBox' }] })}
                      className="w-full py-2 border border-dashed border-slate-600 text-slate-400 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors text-sm"
                    >
                      + Add New Property
                    </button>
                  </div>
                )}

                {activeTab === 'razor' && (
                  <div className="h-full min-h-[400px] border border-slate-700 rounded overflow-hidden">
                    <Editor
                      height="400px"
                      defaultLanguage="razor"
                      theme="vs-dark"
                      value={jsonResult.razorCode}
                      onChange={(value) => setJsonResult({ ...jsonResult, razorCode: value || "" })}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        formatOnPaste: true,
                        autoIndent: "full",
                        wordWrap: "on"
                      }}
                    />
                  </div>
                )}

                {activeTab === 'json' && (
                  <textarea
                    value={JSON.stringify(jsonResult, null, 2)}
                    onChange={(e) => setJsonResult(JSON.parse(e.target.value))}
                    className="w-full h-full min-h-[300px] bg-slate-900 border border-slate-700 rounded p-4 font-mono text-sm text-green-400 outline-none focus:ring-1 focus:ring-purple-500"
                  />
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 mt-2">
                <button
                  onClick={sendToUmbraco}
                  className="w-full bg-green-600 hover:bg-green-500 py-3 rounded font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20"
                >
                  <Server size={18} /> Sync Document Type to Umbraco
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}