# 🛡️ PropagandaShield AI

<div align="center">
  <img src="https://img.shields.io/badge/Powered_by-Gemini_2.0_Flash-blueviolet?style=for-the-badge&logo=googlegemini&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/OCR-Tesseract.js-blue?style=for-the-badge" />
</div>
<br />

**PropagandaShield AI** is an advanced intelligence dashboard built to detect, analyze, and neutralize misinformation, political bias, and psychological manipulation in real-time. Whether it's a suspicious news headline, a viral tweet, or a screenshot of a WhatsApp forward, PropagandaShield breaks down the cognitive threats before they spread.

Built for hackathons, this tool combines **Client-side OCR** with **Google Gemini 2.0 Flash** to provide instant, sub-second threat intelligence right in the browser.

---

## ✨ Key Features

- **🧠 Advanced Narrative Detection**: Identifies the broader propaganda campaigns behind a piece of text (e.g., "Election Fraud Narrative", "Financial Scam", "State Propaganda").
- **📸 Instant Screenshot Scanning (Client-Side OCR)**: Drop an image or screenshot of a post, and Tesseract.js instantly extracts the text entirely in the browser—zero server delay.
- **⚡ Real-Time Threat Metrics**: Evaluates content on three core axes:
  - **Credibility Score** (0-100)
  - **Political/Ideological Bias Level** (Neutral to Extreme)
  - **Virality Risk** (Low to High Spread Potential)
- **🎯 Tactic Explainability**: Highlights the exact flagged phrases verbatim in the original text, explaining the psychological manipulation techniques used (e.g., "Fear Appeal", "Card Stacking").
- **🔒 "Cyber Threat" Dashboard UI**: A premium, dark-mode-first interface built from scratch with Vanilla CSS—featuring neon accents, custom gauges, and multi-stage animated loading sequences.
- **🛡️ Built-in Resilience**: If the API key runs out or hits a rate limit, the system gracefully degrades to a "Demo Mode" fallback response, ensuring the dashboard is **always** presentation-ready for judges.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS (Global variables, Custom Animations, No Tailwind)
- **AI Brain**: [@google/genai (Gemini 2.0 Flash)](https://aistudio.google.com/)
- **Optical Character Recognition**: [Tesseract.js](https://tesseract.projectnaptha.com/) (Running 100% Client-Side for speed)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

To run this project locally:

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/propaganda-shield.git
cd propaganda-shield
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure Gemini AI
Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
Create a `.env.local` file in the root directory:
\`\`\`bash
GEMINI_API_KEY=your_api_key_here
\`\`\`
*(Note: If no key is provided, the app will automatically run in Demo/Mock Mode)*

### 4. Start the Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the dashboard!

---

## 💡 How it Works (Architecture)

1. **Input Stage**: The user enters text or uploads an image. 
2. **Pre-processing (Browser)**: If an image is uploaded, Tesseract.js runs locally via WebAssembly to extract the text instantly.
3. **Analysis Stage (Edge/Serverless)**: The Next.js API route (`/api/analyze`) formats the text into a strict prompt demanding a highly-structured JSON response, and fires it to `gemini-1.5-flash` or `gemini-2.0-flash`.
4. **Visualization**: The React UI parses the LLM's JSON to populate the threat intelligence gauges, virality risk meters, and narrative detection cards.

---

> *"Defending the digital frontier, one narrative at a time."*
