/**
 * FarmWise Advisor — Backend API Server
 * Node.js + Express
 *
 * Routes:
 *   POST /api/analyze-soil        – Claude vision analysis of a soil image
 *   GET  /api/weather?lat&lon     – Open-Meteo weather (free, no key needed)
 *   GET  /api/markets?location    – Simulated mandi prices (swap for real data source)
 *   POST /api/recommendations     – Claude-driven crop recommendations
 *   GET  /api/health              – Health check
 */

import express from "express";
import multer from "multer";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import fetch from "node-fetch";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

// ─── Config ──────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = "claude-opus-4-6"; // Best vision + reasoning model

// ─── Init ─────────────────────────────────────────────────────────────────────

const app = express();
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({ origin: "*" })); // Lock down in production
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Multer — store uploads in memory (up to 10 MB per image)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype);
    cb(ok ? null : new Error("Only image files are allowed"), ok);
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert multer buffer → base64 data URI that Anthropic accepts */
function bufferToBase64(buffer, mimetype) {
  return buffer.toString("base64");
}

/** Parse structured JSON that Claude returns (strips markdown fences if any) */
function parseClaudeJSON(text) {
  const stripped = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  return JSON.parse(stripped);
}

// ─── Route: Health ────────────────────────────────────────────────────────────

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Route: Soil Analysis ─────────────────────────────────────────────────────

/**
 * POST /api/analyze-soil
 * multipart/form-data:
 *   image   – soil photo (required)
 *   location – text description of farm location (optional)
 */
app.post("/api/analyze-soil", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded." });
    }

    const base64Image = bufferToBase64(req.file.buffer, req.file.mimetype);
    const location = req.body.location || "unspecified location";

    const systemPrompt = `You are an expert soil scientist and agronomist with 20+ years of experience.
You analyze soil images and provide detailed, actionable assessments for farmers.
You MUST respond ONLY with a valid JSON object — no markdown, no prose, no code fences.`;

    const userPrompt = `Analyze this soil image from ${location}.

Return a JSON object with EXACTLY this structure:
{
  "soilType": "string — e.g. Loamy Clay, Sandy Loam, Black Cotton Soil",
  "color": "Munsell-style description",
  "ph": number (estimated 4.0–9.0),
  "phCategory": "Acidic | Slightly Acidic | Neutral | Slightly Alkaline | Alkaline",
  "nitrogen": "Low | Medium | High",
  "phosphorus": "Low | Medium | High",
  "potassium": "Low | Medium | High",
  "organicMatter": "string — e.g. 2.4%",
  "moisture": "Dry | Low | Adequate | High | Waterlogged",
  "texture": "brief description of texture and drainage",
  "structure": "Granular | Blocky | Platy | Massive | Crumbly",
  "drainage": "Poor | Moderate | Good | Excellent",
  "erosionRisk": "Low | Medium | High",
  "confidence": "Low | Medium | High — confidence in this assessment",
  "recommendations": ["string", "string", "string", "string"],
  "limitations": "what cannot be determined from image alone",
  "labTestsRecommended": ["list of specific lab tests to confirm analysis"]
}

Be scientifically accurate. Base your analysis on visible soil color, texture, structure, and other visual cues.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: req.file.mimetype,
                data: base64Image,
              },
            },
            { type: "text", text: userPrompt },
          ],
        },
      ],
    });

    const rawText = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const analysis = parseClaudeJSON(rawText);

    res.json({ success: true, analysis });
  } catch (err) {
    console.error("[/api/analyze-soil]", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Route: Weather ───────────────────────────────────────────────────────────

/**
 * GET /api/weather?lat=18.5&lon=73.8&location=Pune
 * Uses Open-Meteo — free, no API key required.
 */
app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lon, location = "your area" } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required query parameters." });
    }

    // Current + hourly + daily forecast from Open-Meteo
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", lat);
    url.searchParams.set("longitude", lon);
    url.searchParams.set("current", "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m");
    url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum");
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("forecast_days", "7");

    const resp = await fetch(url.toString());
    if (!resp.ok) throw new Error(`Open-Meteo responded ${resp.status}`);
    const raw = await resp.json();

    // Map WMO weather codes to human-readable labels + emoji
    const wmoLabel = (code) => {
      if (code === 0) return { label: "Clear Sky", emoji: "☀️" };
      if (code <= 2) return { label: "Partly Cloudy", emoji: "⛅" };
      if (code === 3) return { label: "Overcast", emoji: "☁️" };
      if (code <= 49) return { label: "Foggy", emoji: "🌫️" };
      if (code <= 59) return { label: "Drizzle", emoji: "🌦️" };
      if (code <= 69) return { label: "Rain", emoji: "🌧️" };
      if (code <= 79) return { label: "Snow", emoji: "❄️" };
      if (code <= 82) return { label: "Rain Showers", emoji: "🌧️" };
      if (code <= 99) return { label: "Thunderstorm", emoji: "⛈️" };
      return { label: "Unknown", emoji: "🌡️" };
    };

    const current = raw.current;
    const daily = raw.daily;

    const forecast = daily.time.map((date, i) => ({
      date,
      day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Date(date).toLocaleDateString("en-IN", { weekday: "short" }),
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
      rainChance: daily.precipitation_probability_max[i],
      rainMm: daily.precipitation_sum[i],
      ...wmoLabel(daily.weather_code[i]),
    }));

    // Derive a basic farming advisory using Claude
    const advisoryResp = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `Given this 7-day weather forecast for ${location}, write a concise (2–3 sentence) seasonal farming advisory. Mention ideal crops, irrigation advice, or pest risk.

Forecast summary: ${forecast.map((d) => `${d.day}: ${d.label}, max ${d.tempMax}°C, rain ${d.rainChance}%`).join(" | ")}

Respond with ONLY a JSON object: { "advisory": "string", "seasonalTag": "short label e.g. Pre-Monsoon / Kharif Season" }`,
        },
      ],
    });

    const advisoryRaw = advisoryResp.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const { advisory, seasonalTag } = parseClaudeJSON(advisoryRaw);

    res.json({
      success: true,
      weather: {
        current: {
          temp: Math.round(current.temperature_2m),
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          ...wmoLabel(current.weather_code),
        },
        forecast,
        advisory,
        seasonalTag,
      },
    });
  } catch (err) {
    console.error("[/api/weather]", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Route: Market Prices ─────────────────────────────────────────────────────

/**
 * GET /api/markets?location=Pune&state=Maharashtra
 *
 * In production, replace the mock data below with a real source:
 *   - India: Agmarknet API (https://agmarknet.gov.in)
 *   - Global: FAO GIEWS, World Bank Commodity Prices API
 *
 * The current implementation returns realistic mock data augmented
 * by a Claude-generated market commentary.
 */
app.get("/api/markets", async (req, res) => {
  try {
    const { location = "Maharashtra", state = "Maharashtra" } = req.query;

    // ── Mock commodity price database ──
    // Replace this section with a live API call e.g.:
    //   const agmarknetResp = await fetch(`https://agmarknet.gov.in/SearchCmmMkt.aspx?...`);
    const BASE_PRICES = {
      Rice:      { unit: "quintal", basePrice: 2100, currency: "INR" },
      Cotton:    { unit: "quintal", basePrice: 5800, currency: "INR" },
      Sugarcane: { unit: "quintal", basePrice: 3200, currency: "INR" },
      Wheat:     { unit: "quintal", basePrice: 2400, currency: "INR" },
      Soybean:   { unit: "quintal", basePrice: 4100, currency: "INR" },
      Maize:     { unit: "quintal", basePrice: 1900, currency: "INR" },
      Onion:     { unit: "quintal", basePrice:  900, currency: "INR" },
      Tomato:    { unit: "quintal", basePrice:  600, currency: "INR" },
    };

    // Simulate three market rings with distance-based price adjustments
    const markets = [
      { name: "Local Mandi",    distanceKm: 15, premiumPct: 0.00 },
      { name: "District Market", distanceKm: 45, premiumPct: 0.07 },
      { name: "City Market",    distanceKm: 80, premiumPct: 0.14 },
    ];

    // Assign random-but-stable trend + demand based on crop
    const trendMap = { Rice: "up", Cotton: "up", Sugarcane: "stable", Wheat: "down", Soybean: "up", Maize: "stable", Onion: "up", Tomato: "down" };
    const demandMap = { Rice: "High", Cotton: "High", Sugarcane: "Medium", Wheat: "Low", Soybean: "Medium", Maize: "Medium", Onion: "High", Tomato: "Low" };

    const nearbyMarkets = markets.map((m) => ({
      name: `${m.name} (${m.distanceKm} km)`,
      distanceKm: m.distanceKm,
      crops: Object.entries(BASE_PRICES).map(([crop, info]) => ({
        name: crop,
        price: Math.round(info.basePrice * (1 + m.premiumPct) * (0.97 + Math.random() * 0.06)),
        unit: info.unit,
        currency: info.currency,
        trend: trendMap[crop],
        demand: demandMap[crop],
      })),
    }));

    // Claude generates a short market commentary
    const commentaryResp = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 350,
      messages: [
        {
          role: "user",
          content: `You are an agricultural market analyst. Based on these crop prices in ${location}, ${state}, write a brief market commentary (2–3 sentences) and identify the top 3 crops with best profit potential.

Prices (Local Mandi): ${nearbyMarkets[0].crops.map((c) => `${c.name} ₹${c.price}/${c.unit} (${c.trend})`).join(", ")}

Respond ONLY with JSON: { "commentary": "string", "hotCrops": ["crop1","crop2","crop3"], "alertMessage": "one-line market alert or opportunity" }`,
        },
      ],
    });

    const commRaw = commentaryResp.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const { commentary, hotCrops, alertMessage } = parseClaudeJSON(commRaw);

    res.json({
      success: true,
      markets: {
        location,
        state,
        lastUpdated: new Date().toISOString(),
        nearbyMarkets,
        commentary,
        hotCrops,
        alertMessage,
        dataSource: "Mock data — integrate Agmarknet API for live prices",
      },
    });
  } catch (err) {
    console.error("[/api/markets]", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Route: Crop Recommendations ─────────────────────────────────────────────

/**
 * POST /api/recommendations
 * Body (JSON):
 *   soilAnalysis  – object from /api/analyze-soil
 *   weatherData   – object from /api/weather
 *   marketData    – object from /api/markets
 *   location      – string
 *   farmSizeAcres – number (optional)
 *   budget        – "low" | "medium" | "high" (optional)
 *   preferOrganic – boolean (optional)
 */
app.post("/api/recommendations", async (req, res) => {
  try {
    const {
      soilAnalysis,
      weatherData,
      marketData,
      location = "unspecified",
      farmSizeAcres = 5,
      budget = "medium",
      preferOrganic = false,
    } = req.body;

    if (!soilAnalysis) {
      return res.status(400).json({ error: "soilAnalysis is required." });
    }

    const systemPrompt = `You are a senior agronomist and farm business consultant.
You create detailed, actionable crop recommendations by integrating soil science,
agro-meteorology, and commodity market analysis. All monetary values are in INR.
You MUST respond ONLY with a valid JSON object — no markdown, no prose, no code fences.`;

    const context = {
      soil: soilAnalysis,
      weather: weatherData?.weather || null,
      market: marketData?.markets || null,
      farm: { location, farmSizeAcres, budget, preferOrganic },
    };

    const userPrompt = `Given the following farm context, provide the top 4 crop recommendations ranked by estimated profitability.

Farm Context:
${JSON.stringify(context, null, 2)}

Return a JSON object with EXACTLY this shape:
{
  "summary": "2-sentence overall assessment",
  "topCrops": [
    {
      "rank": 1,
      "name": "crop name",
      "suitabilityScore": 0–100,
      "estimatedProfitPerAcre": number in INR,
      "estimatedRevenuePerAcre": number in INR,
      "estimatedCostPerAcre": number in INR,
      "growthDurationDays": number,
      "bestMarket": "market name",
      "bestPricePerQuintal": number,
      "expectedYieldQuintalsPerAcre": number,
      "waterRequirement": "Low | Medium | High | Very High",
      "fertilizerNeeds": "brief description",
      "plantingWindow": "e.g. June–July",
      "harvestWindow": "e.g. October–November",
      "soilFitReasons": ["reason1", "reason2", "reason3"],
      "marketFitReasons": ["reason1", "reason2"],
      "weatherFitReasons": ["reason1"],
      "requirements": "one-line summary",
      "riskFactors": ["risk1", "risk2"],
      "mitigationTips": ["tip1", "tip2"],
      "organicFeasible": true | false,
      "governmentSchemes": ["scheme names if applicable in India"]
    }
  ],
  "intercropSuggestion": "optional pairing idea e.g. Rice + Duckweed",
  "keyAlert": "most important warning or opportunity for this farmer",
  "nextSteps": ["actionable step 1", "step 2", "step 3"]
}`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const rawText = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const recommendations = parseClaudeJSON(rawText);

    res.json({ success: true, recommendations });
  } catch (err) {
    console.error("[/api/recommendations]", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Route: Geocode (lat/lon from place name) ─────────────────────────────────

/**
 * GET /api/geocode?location=Pune,Maharashtra
 * Uses Open-Meteo Geocoding API — free, no key.
 */
app.get("/api/geocode", async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) return res.status(400).json({ error: "location is required." });

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Geocoding API responded ${resp.status}`);
    const data = await resp.json();

    if (!data.results?.length) {
      return res.status(404).json({ error: "Location not found." });
    }

    const { latitude, longitude, name, country } = data.results[0];
    res.json({ success: true, latitude, longitude, name, country });
  } catch (err) {
    console.error("[/api/geocode]", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Error handler ────────────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error("[Unhandled Error]", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║      🌾  FarmWise Advisor — Backend          ║
║      Listening on http://localhost:${PORT}      ║
╠══════════════════════════════════════════════╣
║  POST /api/analyze-soil   (multipart)        ║
║  GET  /api/weather                           ║
║  GET  /api/markets                           ║
║  POST /api/recommendations                   ║
║  GET  /api/geocode                           ║
║  GET  /api/health                            ║
╚══════════════════════════════════════════════╝
  `);
});
