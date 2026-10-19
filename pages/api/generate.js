import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const websitePrompt = `
You are an AI website designer.

The user will describe the website they want.

DO NOT generate HTML.
DO NOT generate CSS.
DO NOT generate JavaScript.
DO NOT return code.

Instead, analyze the user's request and return a JSON object describing the website.

The website can contain:
- hero section
- about section
- features section
- projects section
- skills section
- contact section
- footer

Only include sections that make sense for the user's request.

Return ONLY valid JSON.

The JSON must follow this structure:

{
  "siteName": "string",
  "description": "string",
  "theme": {
    "style": "string",
    "primaryColor": "string",
    "backgroundColor": "string",
    "textColor": "string"
  },
  "hero": {
    "title": "string",
    "subtitle": "string",
    "buttonText": "string"
  },
  "sections": [
    {
      "type": "about | features | projects | skills | contact",
      "title": "string",
      "description": "string",
      "items": [
        {
          "title": "string",
          "description": "string"
        }
      ]
    }
  ]
}

User's website request:

${prompt}
`;

    let response;

    // Try Gemini up to 3 times if the service is temporarily unavailable
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: websitePrompt,
        });

        break;
      } catch (error) {
        console.error(`Gemini attempt ${attempt} failed:`, error);

        if (attempt === 3) {
          throw error;
        }

        // Wait before trying again
        await new Promise((resolve) =>
          setTimeout(resolve, attempt * 2000)
        );
      }
    }

    return res.status(200).json({
      result: response.text,
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return res.status(500).json({
      error: "Gemini is temporarily unavailable. Please try again.",
    });
  }
}