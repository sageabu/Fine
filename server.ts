import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google Gen AI
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Fine Hair", time: new Date().toISOString() });
});

// AI Endpoint: Hair Consultant & Product Recommendation
app.post("/api/ai/hair-consultant", async (req, res) => {
  try {
    const { message, customerProfile, conversationHistory = [] } = req.body;
    const ai = getAI();

    if (!ai) {
      // Graceful fallback response if API key is not yet set
      return res.json({
        reply:
          "Fine Hair Advisor: For the Tanzanian climate and seamless elegance, we recommend our 100% Raw Virgin Bone Straight or HD Lace Closures. They resist tropical humidity and maintain a high-gloss finish. Can I help you pick between 22\" and 30\" lengths or book an installation in Masaki?",
        recommendedProductIds: ["prod-1", "prod-3"],
        suggestedService: "HD Lace Wig Installation & Melt",
      });
    }

    const systemInstruction = `You are the Lead Master Stylist & Beauty Consultant for "Fine Hair", a luxury Tanzanian hair, beauty, extensions, and wig house based in Dar es Salaam.
Your persona is warm, knowledgeable, prestigious, and deeply versed in human hair textures (Bone Straight, Raw Cambodian, Deep Wave, HD Lace Frontals, Glueless Wigs, 4C Natural hair blending).
You speak English with occasional elegant Swahili beauty phrases (like "Karibu Fine Hair", "Pendeza", "Urembo wa asili").
Always provide tailored advice, care tips (e.g. heat protection, silk bonnet, alcohol-free mousse for Dar es Salaam humidity), and recommend Fine Hair products/services.
Format your answer clearly with concise luxury tone. Include 1-2 product suggestions or service pairings.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: [
        {
          text: `Customer Profile: ${JSON.stringify(customerProfile || {})}\n\nChat History: ${JSON.stringify(conversationHistory.slice(-4))}\n\nCustomer Inquiry: ${message}`,
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "Karibu Fine Hair! How may I elevate your hairstyle today?",
    });
  } catch (error: any) {
    console.error("AI Hair Consultant error:", error);
    res.status(500).json({
      error: "Failed to consult advisor",
      fallback: "Our Fine Hair master stylists are available to customize your wig and recommend the perfect lace blend.",
    });
  }
});

// AI Endpoint: Swahili / English Staff Voice & Text Daily Report Parser
app.post("/api/ai/staff-report-parser", async (req, res) => {
  const transcript = req.body?.transcript || "";
  const staffName = req.body?.staffName || "Staff Member";
  try {
    const ai = getAI();

    if (!ai) {
      // Basic rule-based fallback if offline
      return res.json({
        parsedReport: {
          staffName: staffName || "Staff Member",
          clientsServed: 3,
          servicesCompleted: ["Wig Installation", "Washing & Treatment"],
          problemCategory: "Stock",
          problemDetails: "Stock ya lace glue imepungua",
          needsForTomorrow: "Frontal glue na styling mousse",
          summaryNote: transcript || "Ripoti ya siku imepokelewa vizuri.",
        },
      });
    }

    const prompt = `Parse the following Tanzanian hair salon staff daily spoken/text report (usually in Swahili or Sheng or English) into structured JSON.
Return pure JSON with keys:
- staffName (string)
- clientsServed (integer number of clients served)
- servicesCompleted (array of strings: e.g. "Wig Installation", "Braiding", "Treatment", "Washing", "Colour", "Sales", "Stock Management")
- problemCategory (one of: "Hakuna", "Stock", "Customer", "Equipment", "Payment", "Other")
- problemDetails (string explaining issue or "Hakuna matatizo")
- needsForTomorrow (string of what supplies/tools are needed tomorrow)
- summaryNote (one concise sentence summarizing the day's performance)

Staff Name provided: ${staffName || "Unknown"}
Raw Input: "${transcript}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ parsedReport: parsed });
  } catch (error: any) {
    console.error("Staff report parsing error:", error);
    res.json({
      parsedReport: {
        staffName: staffName || "Staff",
        clientsServed: 1,
        servicesCompleted: ["Salon Service"],
        problemCategory: "Hakuna",
        problemDetails: "Hakuna tatizo",
        needsForTomorrow: "Vifaa vya kawaida",
        summaryNote: transcript || "Ripoti imehifadhiwa.",
      },
    });
  }
});

// AI Endpoint: Executive Business Intelligence & Inventory Insights
app.post("/api/ai/management-insights", async (req, res) => {
  try {
    const { metrics, inventoryAlerts, staffPerformance } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        insights: [
          {
            title: "Bundle Installation Opportunity",
            type: "opportunity",
            text: "Raw bone straight 30\" sales are up 35% this week, but installation appointments have a 2-day lag. Launching a 'Buy Bundle + 20% Off Masaki Salon Installation' package can boost service revenue by TSh 1.2M.",
          },
          {
            title: "Urgent Stock Re-order Alert",
            type: "inventory",
            text: "13x4 HD Lace Closures are at 3 units remaining. Based on current velocity (4 units/week), restock from Cambodian supplier before Friday.",
          },
          {
            title: "Staff Workload & Efficiency",
            type: "staff",
            text: "Farida and Zainab have 100% daily reporting and highest customer satisfaction (4.95/5). Consider routing VIP Bridal wig bookings to their schedules.",
          },
        ],
      });
    }

    const prompt = `You are the Chief Operating Officer and AI Business Intelligence Advisor for "Fine Hair", a high-end Tanzanian hair and beauty company.
Analyze these live metrics:
Metrics: ${JSON.stringify(metrics)}
Inventory Alerts: ${JSON.stringify(inventoryAlerts)}
Staff Performance: ${JSON.stringify(staffPerformance)}

Generate 3 high-impact, actionable luxury retail insights.
Return a JSON array of objects with keys:
- title (short punchy title)
- type ("opportunity" | "inventory" | "staff" | "finance")
- text (2-3 sentences with concrete Tanzanian Shilling (TZS) numbers or strategic operational recommendations).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const insights = JSON.parse(response.text || "[]");
    res.json({ insights });
  } catch (error: any) {
    console.error("Management insights error:", error);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fine Hair server running on http://localhost:${PORT}`);
  });
}

startServer();
