import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Interactive API endpoints
app.post("/api/generate", async (req, res) => {
  const { prompt, tone = "confident & approachable", assetType = "email" } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "A valid prompt string is required." });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Elegant fallback mock content when API key is not configured yet
    console.log("No valid GEMINI_API_KEY found, returning premium mock brand assets.");
    
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockResponses: Record<string, string> = {
      email: `Subject: Introducing Lumio Pro – Bring your creative vision into focus

Hey Team,

We've always believed that true creativity shouldn't be held back by administrative friction. That's why today, we're incredibly excited to introduce Lumio Pro – the next chapter in brand intelligence.

Lumio Pro is crafted specifically for fast-growing creative teams who need absolute visual consistency and strategic focus across all channels. 

Here's a look at what's new in Pro:
• Real-time Brand Audits: Instantly evaluate assets against your visual style guide.
• Predictive Visual Analytics: Understand layout performance before publishing.
• Multi-channel Deployment: Distribute files and creative guidelines in one single click.

It's everything you love about Lumio, calibrated for scale.

We'd love to show you how Lumio Pro can redefine your daily workflow. Click below to schedule your custom walkthrough.

Warmly,
The Lumio Team`,
      social: `✨ Standardizing visual style isn't about restriction—it's about acceleration. 

Introducing Lumio Pro: the intelligent companion that aligns your creative output with your brand identity in real-time. Say goodbye to outdated style guides and endless feedback loops. 

With Lumio Pro, every team member has the context they need to create cohesive, stunning assets at lightning speed. 

How does your team protect brand consistency? Let's discuss in the comments below! 👇

#BrandOS #CreativeIntelligence #DesignSystem #LumioPro #ModernWork`,
      brief: `# Campaign Brief: Lumio Pro Launch Campaign
**Status:** Approved • **Target Launch:** Q3

### 1. Objective
Establish Lumio Pro as the standard enterprise operating system for brand consistency, driving product adoption among product marketing managers and creative directors.

### 2. Tone & Voice Guidelines
• **Confident & Visionary:** We are pioneers, but we write with humble clarity. Avoid buzzwords; prefer direct, striking statements.
• **Approachable & Empathetic:** Understand the daily pain points of creative drift. We are here to liberate minds, not micromanage designers.

### 3. Key Messaging Pillars
• **The Singular Truth:** Unify assets, design guidelines, and copy in one self-syncing database.
• **Frictionless Creation:** AI-guided feedback loops that keep content on-brand from first draft to final sign-off.
• **Strategic Sovereignty:** Free designers from menial resizing and guideline checks so they can focus on true design innovation.`,
      guidelines: `# Brand Tone & Voice Guidelines

### 1. Core Principles
• **Bold Simplicity:** Say more with less. Our layouts use generous negative space, and our language should reflect that spaciousness.
• **Empowering Clarity:** Speak with authority but remain conversational.
• **Architectural Honesty:** We never use deceptive marketing fluff. We tell simple, powerful truths.

### 2. Vocabulary Preferences
• **Use:** Unify, focus, clarity, sovereignty, foundation, intelligence.
• **Avoid:** Synergy, revolutionary paradigm, next-generation hyper-automation, next-level.

### 3. Sentence Structure
Prefer short, punchy active sentences. Break complex thoughts into clean bullet points.`
    };

    const lowercaseType = assetType.toLowerCase();
    const resultText = mockResponses[lowercaseType] || mockResponses["email"];
    
    return res.json({
      text: resultText,
      mode: "demo"
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are Lumio Studio, the built-in brand intelligence engine for Lumio (The Operating System for Modern Work). Your job is to generate premium, high-converting, exceptionally written brand assets. 
When drafting assets, respect the requested asset type (e.g. Email newsletter, Social caption, Campaign brief, Tone guidelines) and tone (current requested tone: ${tone}).
Return ONLY the finished creative copy. Keep it polished and beautiful, utilizing clear markdown headings, paragraphs, and lists when appropriate. Do not include any meta-introductions (like "Here is your email:") or conversational chit-chat. Just write the asset itself.`,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text || "No response generated.",
      mode: "live"
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate asset. " + error.message });
  }
});

// Mock files list endpoint for the interactive files panel
let simulatedFiles = [
  { id: "1", name: "Lumio_Strategy.pdf", type: "folder", category: "Strategy", icon: "folder", date: "June 25, 2026", size: "4.2 MB", content: "Comprehensive brand strategy guidelines for Lumio, containing visual style principles, mission alignments, and market positioning." },
  { id: "2", name: "BrandBook_v2.docx", type: "description", category: "Guidelines", icon: "description", date: "June 28, 2026", size: "1.8 MB", content: "Master brand guidelines. Covers typography pairing, spacing grids, brand voice principles, and standard logo usage rules." },
  { id: "3", name: "Campaign_Assets.zip", type: "image", category: "Assets", icon: "image", date: "June 29, 2026", size: "48.5 MB", content: "High-resolution graphic assets, Figma exports, and social media image templates for the summer launch campaign." },
  { id: "4", name: "Q3_Performance.xlsx", type: "analytics", category: "Strategy", icon: "analytics", date: "June 30, 2026", size: "1.2 MB", content: "Q3 performance analysis metrics, click-through rates on visual campaigns, and asset ROI calculations." }
];

app.get("/api/files", (req, res) => {
  res.json(simulatedFiles);
});

app.post("/api/files", (req, res) => {
  const { name, type, category, content } = req.body;
  if (!name) {
    return res.status(400).json({ error: "File name is required." });
  }

  const newFile = {
    id: String(simulatedFiles.length + 1),
    name,
    type: type || "description",
    category: category || "Strategy",
    icon: type === "folder" ? "folder" : type === "image" ? "image" : type === "analytics" ? "analytics" : "description",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
    content: content || "Custom brand document uploaded to Lumio OS."
  };

  simulatedFiles.push(newFile);
  res.status(201).json(newFile);
});

app.delete("/api/files/:id", (req, res) => {
  const { id } = req.params;
  simulatedFiles = simulatedFiles.filter(f => f.id !== id);
  res.json({ success: true });
});

// Serve Vite client app
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
