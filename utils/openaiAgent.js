import OpenAI from "openai";
import { estimateMilesOptions } from "./milesEstimator.js";
import { amexTransferPrograms } from "./amexPartners.js";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function analyzeWithOpenAI(flights, travelClass) {
  const enrichedFlights = flights.map(flight => ({ ...flight, amex_programs: estimateMilesOptions(flight) }));
  const prompt = \`
You are a travel optimization assistant for an American Express Platinum user.
Compare paying cash vs transferring Amex points to partner programs:
\${amexTransferPrograms.map(p => \`• \${p.program}: \${p.ratio} (\${p.alliance})\`).join("\\n")}
For each flight:
1. Show best transfer option based on €/point.
2. Consider transfer ratio and time.
3. Recommend top 3 total-value offers.
Flights:
\${JSON.stringify(enrichedFlights, null, 2)}
Output strict JSON.
\`;
  const completion = await openai.chat.completions.create({
    model: "gpt-5-turbo",
    messages: [{ role: "system", content: "You are a precise financial travel assistant." },{ role: "user", content: prompt }],
    temperature: 0.25
  });
  try { return JSON.parse(completion.choices[0].message.content); }
  catch { return [{ error: "Failed to parse AI output", raw: completion.choices[0].message.content }]; }
}
