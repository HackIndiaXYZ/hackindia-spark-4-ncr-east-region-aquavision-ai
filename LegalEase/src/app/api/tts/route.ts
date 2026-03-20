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
        speaker: "anushka",
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

    // Sarvam AI limit is 500 chars per input string. We chunk by sentences.
    const textChunks: string[] = [];
    let currentChunk = "";
    
    // Split by common sentence terminators but keep them
    const sentences = text.split(/([.!?]+)/);
    
    for (let i = 0; i < sentences.length; i++) {
        const part = sentences[i];
        if (currentChunk.length + part.length > 490) {
            if (currentChunk.trim()) textChunks.push(currentChunk.trim());
            currentChunk = part;
        } else {
            currentChunk += part;
        }
    }
    if (currentChunk.trim()) {
        textChunks.push(currentChunk.trim());
    }
    
    // Safety fallback: limit to max 5 chunks (approx 2500 chars total)
    const finalInputs = textChunks.slice(0, 5);
    const selectedVoice = voiceConfig[targetLanguage];

    const payload = {
      inputs: finalInputs.length > 0 ? finalInputs : ["No summary available."],
      target_language_code: selectedVoice.targetLanguageCode,
      speaker: selectedVoice.speaker,
      pace: 1.0,
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
