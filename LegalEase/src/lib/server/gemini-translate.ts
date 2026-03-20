import type { AnalysisResult } from "@/types/analysis";

import { withGeminiModelFallback } from "@/lib/server/gemini-runtime";

export async function translateAnalysisWithGemini(
  analysis: AnalysisResult,
  targetLanguage: "hi" | "hinglish" | "gu" | "ta" | "te",
): Promise<AnalysisResult> {
  const languageMap = {
    hi: "Hindi",
    hinglish: "Hinglish",
    gu: "Gujarati",
    ta: "Tamil",
    te: "Telugu",
  };

  const targetLangName = languageMap[targetLanguage];
  const payloadStr = JSON.stringify(analysis, null, 2);
  const prompt = `
You are a friendly, helpful AI translating a legal contract analysis from English to ${targetLangName}.

STRICT RULES:
1. ONLY translate the string values. DO NOT translate the JSON keys.
2. DO NOT change the "level" values ("low", "medium", "high"). Keep them in English.
3. TONE: Use simple, everyday language that a normal person can understand (8th-grade level).
${targetLanguage === "hinglish" ? "4. Use a slight Hinglish tone. Avoid heavy/legal shuddh Hindi. Keep it conversational. (e.g. Instead of 'यह धारा असीमित दायित्व लगाती है', use 'इसका मतलब है कि आपको नुकसान का पूरा पैसा देना पड़ सकता है, चाहे गलती आपकी पूरी न हो।')" : targetLanguage === "hi" ? "4. Use simple Hindi but avoid English words. Keep it natural." : "4. Avoid complex or formal legal vocabulary. Keep it natural, conversational, and slightly cautionary when needed."}
5. Keep responses SHORT and easy to scan.
6. Return ONLY the translated JSON matching the exact original structure. No markdown wrapping.

Original JSON:
${payloadStr}
`.trim();

  return withGeminiModelFallback("translation", async (client, modelName) => {
    const model = client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text().trim());

    if (!parsed.summary || !Array.isArray(parsed.risks)) {
      throw new Error("Translation returned invalid shape.");
    }

    return parsed as AnalysisResult;
  });
}
// Fallback logic for demo
const demoHindiTranslation: AnalysisResult = {
  documentName: "service-agreement.pdf",
  summary: "Humein is contract mein kuch tricky cheezein mili hain. Yeh aapse bahut risk lene ko kehta hai, time se pehle contract chhodna mushkil banata hai, aur agar payment late hui toh heavy penalty lag sakti hai.",
  riskScore: 78,
  confidenceScore: 91,
  risks: [
    {
      id: "liability-1",
      title: "Shayad aapko sab kuch pay karna pade",
      level: "high",
      description: "Company ne apna nuksan toh limit kar diya hai, par aapko aisi koi protection nahi di hai.",
      consequence: "Agar koi badi problem hoti hai, toh aapko ek bada bill pay karna pad sakta hai, chahe aapki poori galti na bhi ho."
    },
    {
      id: "term-1",
      title: "Contract chhodne ke liye bahut kam time hai",
      level: "medium",
      description: "Contract aapko notice dene ke liye bahut chota window deta hai, jismey naya intezaam karna mushkil ho sakta hai.",
      consequence: "Agar contract achanak khatam ho gaya, toh aapka kaam ruk sakta hai jab tak aap nayi company nahi dhoond lete."
    },
    {
      id: "payment-1",
      title: "Late payment pe heavy penalty",
      level: "medium",
      description: "Agar payment late hui toh interest rate bahut zyada hai, jo ki normal business rules ke hisaab se sahi nahi hai.",
      consequence: "Thodi si bhi payment delay hone par aapka bill bahut jaldi badh sakta hai."
    },
    {
      id: "ip-1",
      title: "Kaam ka malik kaun hoga, yeh clear nahi hai",
      level: "low",
      description: "Contract is baat pe clear nahi hai ki pehle se banayi hui cheezein kiski hain aur nayi banayi hui cheezein kiski hain.",
      consequence: "Aage chalkar is baat pe jhagra ho sakta hai ki property kiski hai, jisse aapka future work complicate ho sakta hai."
    }
  ],
  consequences: [
    "Kisi jhagde mein unexpected kharcha aa sakta hai",
    "Contract jaldi khatam hone se kaam ruk sakta hai",
    "Late payment fees se aapka financial nuksan ho sakta hai"
  ]
};

const demoGujaratiTranslation: AnalysisResult = {
  documentName: "service-agreement.pdf",
  summary: "અમને આ કરારમાં કેટલીક મુશ્કેલ બાબતો મળી છે. તે તમને ઘણું જોખમ લેવા માટે કહે છે, વહેલા કરાર છોડવાનું મુશ્કેલ બનાવે છે, અને જો ચુકવણી મોડી થાય તો ભારે દંડ લાદી શકે છે.",
  riskScore: 78,
  confidenceScore: 91,
  risks: [
    {
      id: "liability-1",
      title: "તમારે બધું ચૂકવવું પડી શકે છે",
      level: "high",
      description: "કંપનીએ પોતાનું નુકસાન મર્યાદિત કર્યું છે, પરંતુ તમને કોઈ રક્ષણ આપ્યું નથી.",
      consequence: "જો કોઈ મોટી સમસ્યા ઊભી થાય, તો તમારે મોટું બિલ ચૂકવવું પડી શકે છે."
    },
    {
      id: "term-1",
      title: "કરાર છોડવા માટે ખૂબ ઓછો સમય",
      level: "medium",
      description: "કરાર તમને નોટિસ આપવા માટે ખૂબ જ ટૂંકી વિંડો આપે છે.",
      consequence: "જો કરાર અચાનક સમાપ્ત થાય છે, તો તમારું કાર્ય અટકી શકે છે."
    },
    {
      id: "payment-1",
      title: "મોડી ચુકવણી પર ભારે દંડ",
      level: "medium",
      description: "જો ચુકવણી મોડી થાય તો વ્યાજ દર ઘણો .ંચો હોય છે.",
      consequence: "થોડો ચૂકવણીમાં વિલંબ પણ તમારું બિલ ઝડપથી વધારી શકે છે."
    },
    {
      id: "ip-1",
      title: "મિલકતનો માલિક કોણ છે, તે સ્પષ્ટ નથી",
      level: "low",
      description: "કરાર સ્પષ્ટ કરતું નથી કે કઈ વસ્તુઓ કોની છે.",
      consequence: "આનાથી ભવિષ્યમાં વિવાદ થઈ શકે છે."
    }
  ],
  consequences: [
    "વિવાદોમાં અણધાર્યા ખર્ચ થઈ શકે છે",
    "કરાર વહેલો સમાપ્ત થવાથી કામ અટકી શકે છે",
    "મોડી ચૂકવણીથી નાણાકીય નુકસાન થઈ શકે છે"
  ]
};

export function getDemoTranslation(analysis: AnalysisResult, targetLanguage: "hi" | "hinglish" | "gu" | "ta" | "te"): AnalysisResult {
  if (targetLanguage === "hinglish" || targetLanguage === "hi") {
    // Return hindi/hinglish translation but keep the user's risk scores and document name just in case they're different
    return {
      ...demoHindiTranslation,
      documentName: analysis.documentName,
      riskScore: analysis.riskScore,
      confidenceScore: analysis.confidenceScore,
    };
  }
  
  if (targetLanguage === "gu") {
    return {
      ...demoGujaratiTranslation,
      documentName: analysis.documentName,
      riskScore: analysis.riskScore,
      confidenceScore: analysis.confidenceScore,
    };
  }
  
  // If no demo translation exists for the specific language, just return original to prevent crashing
  return analysis;
}
