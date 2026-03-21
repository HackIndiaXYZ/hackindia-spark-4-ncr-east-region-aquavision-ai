<div align="center">
  <img src="public/favicon.ico" alt="LegalEase Logo" width="80" height="auto" />
  <h1>LegalEase — AI Contract Analyzer</h1>
  <p><strong>HackIndia Spark 4 NCR East Region — Team Aquavision AI</strong></p>
  <p>🌍 <strong><a href="https://legalease-aquavision.vercel.app">Try the Live Application on Vercel</a></strong> 🌍</p>
  <p>Empowering individuals and SMEs to understand complex legal documents instantly.</p>
</div>

---

## 🚀 Overview

**LegalEase** is a cutting-edge web application that uses Google Gemini to instantly analyze legal contracts, extract critical risks, and explain them in plain language. Built for inclusivity, it breaks down complex legal jargon and surfaces hidden loopholes before you sign.

This project was built during the **HackIndia Spark 4** hackathon by **Team Aquavision AI**.

## ✨ Key Features

- **Document Parsing**: Instantly extracts and understands text from uploaded PDF contracts.
- **AI Risk Analysis**: Powered by Google Gemini to identify Critical, Moderate, and Informational risks.
- **Regional Languages**: Provides analysis in English, **Hindi**, **Tamil**, **Telugu**, and **Marathi** to democratize legal access.
- **Text-to-Speech (TTS)**: Listen to your contract's risk summary with integrated audio narration.
- **Interactive UI**: Click on risks to highlight exactly where they are found in the document.
- **PDF Export**: Generate a beautifully formatted, downloadable PDF report of the analysis.
- **Demo Mode**: Try the application instantly with a built-in pre-loaded demo contract.

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS v4 + Radix UI Primitives + Custom CSS Animations
- **AI/Backend**: Google Gemini API (`@google/generative-ai`), Google Cloud TTS
- **PDF Processing**: `pdf-parse` for text extraction, `html2canvas` & `jspdf` for report generation
- **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`)

## 💻 Running Locally

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/hackindia-team/hackindia-spark-4-ncr-east-region-aquavision-ai.git
   cd hackindia-spark-4-ncr-east-region-aquavision-ai/LegalEase
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Environment Variables:**
   Create a \`.env.local\` file in the `LegalEase` root directory:
   \`\`\`env
   GEMINI_API_KEY=your_gemini_api_key_here
   GOOGLE_CREDENTIALS=your_google_cloud_credentials_json_here
   \`\`\`

4. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🛡️ Privacy & Security

LegalEase is built with a zero-trust architecture. Documents are analyzed securely in-memory and are never stored on disk or sent for training. Features like PII masking ensure that sensitive names and addresses are protected before hitting the AI model.

---

*Made with ❤️ by Team Aquavision AI*
