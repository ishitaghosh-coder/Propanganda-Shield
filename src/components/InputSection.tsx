"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, Activity } from "lucide-react";

interface InputSectionProps {
  onAnalyzeText: (text: string) => void;
  onAnalyzeImage: (base64Image: string) => void;
  loading: boolean;
}

export default function InputSection({ onAnalyzeText, onAnalyzeImage, loading }: InputSectionProps) {
  const [activeTab, setActiveTab] = useState<"text" | "image">("text");
  const [textInput, setTextInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (activeTab === "text" && textInput.trim()) {
      onAnalyzeText(textInput);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onAnalyzeImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="cyber-panel p-6 flex flex-col gap-4">
      <div className="flex border-b border-[var(--border-color)] mb-2">
        <button
          className={`flex-1 py-3 text-center font-mono text-sm uppercase transition-colors ${
            activeTab === "text"
              ? "text-[var(--accent-neon)] border-b-2 border-[var(--accent-neon)]"
              : "text-gray-500 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("text")}
        >
          <div className="flex items-center justify-center gap-2">
            <FileText size={16} /> Text Input
          </div>
        </button>
        <button
          className={`flex-1 py-3 text-center font-mono text-sm uppercase transition-colors ${
            activeTab === "image"
              ? "text-[var(--accent-neon)] border-b-2 border-[var(--accent-neon)]"
              : "text-gray-500 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("image")}
        >
          <div className="flex items-center justify-center gap-2">
            <UploadCloud size={16} /> Image Upload
          </div>
        </button>
      </div>

      {activeTab === "text" ? (
        <textarea
          className="cyber-input min-h-[300px] resize-y"
          placeholder="Paste social media post, article text, or headline here for deep scan..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          disabled={loading}
        />
      ) : (
        <div 
          className="min-h-[300px] border-2 border-dashed border-[var(--border-color)] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[var(--accent-neon)] transition-colors bg-black/20"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud size={48} className="text-gray-500 mb-4" />
          <p className="text-gray-400 font-mono text-sm">Click to upload screenshot</p>
          <p className="text-gray-600 text-xs mt-2">Supports JPG, PNG, WEBP</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      )}

      <button 
        className="cyber-btn w-full mt-4 flex items-center justify-center gap-2"
        onClick={handleSubmit}
        disabled={loading || (activeTab === "text" && !textInput.trim())}
      >
        <Activity size={18} />
        {loading ? "INITIALIZING SCAN..." : "INITIATE ANALYSIS"}
      </button>
    </div>
  );
}
