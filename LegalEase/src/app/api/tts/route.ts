import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();
    const voiceConfig = {
      en: {
        targetLanguageCode: "en-IN",
        speaker: "amit",
      },
      hi: {
        targetLanguageCode: "hi-IN",
        speaker: "priya",
      },
    } as const;

    if (!process.env.SARVAM_API_KEY) {
      return NextResponse.json({ error: "Missing SARVAM_API_KEY in .env.local" }, { status: 500 });
    }

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    if (targetLanguage !== "en" && targetLanguage !== "hi") {
      return NextResponse.json(
        { error: "Audio narration is currently available only in English and Hindi." },
        { status: 400 },
      );
    }

    // Sarvam AI: strict 500 chars per input, max 3 inputs.
    const MAX_CHUNK = 480; // leave a small buffer under 500
    const MAX_INPUTS = 3;

    // Truncate to ~1500 chars total (3 chunks × 500) to avoid wasting API calls
    const truncatedText = text.substring(0, MAX_CHUNK * MAX_INPUTS);

    const textChunks: string[] = [];
    let currentChunk = "";

    // Split by sentence terminators
    const sentences = truncatedText.split(/(?<=[.!?])\s+/);

    for (const sentence of sentences) {
      // If a single sentence is longer than MAX_CHUNK, hard-split it
      if (sentence.length > MAX_CHUNK) {
        if (currentChunk.trim()) {
          textChunks.push(currentChunk.trim());
          currentChunk = "";
        }
        for (let j = 0; j < sentence.length; j += MAX_CHUNK) {
          textChunks.push(sentence.substring(j, j + MAX_CHUNK));
        }
        continue;
      }

      if (currentChunk.length + sentence.length + 1 > MAX_CHUNK) {
        if (currentChunk.trim()) textChunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? " " : "") + sentence;
      }
    }
    if (currentChunk.trim()) {
      textChunks.push(currentChunk.trim());
    }

    // Hard limit to 3 chunks
    const finalInputs = textChunks.slice(0, MAX_INPUTS);
    const selectedVoice = voiceConfig[targetLanguage === "hi" ? "hi" : "en"];

    const payload = {
      inputs: finalInputs.length > 0 ? finalInputs : ["No summary available."],
      target_language_code: selectedVoice.targetLanguageCode,
      speaker: selectedVoice.speaker,
      pace: 1.15,
      speech_sample_rate: 8000,
      enable_preprocessing: true,
      model: "bulbul:v3"
    };

    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "api-subscription-key": process.env.SARVAM_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Sarvam API error: ${response.status} ${err}`);
    }

    const data = await response.json();
    
    return NextResponse.json({ audios: data.audios });

  } catch (error) {
    console.error("Sarvam TTS error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
