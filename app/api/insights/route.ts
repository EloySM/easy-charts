const system = `
Devuelve SOLO un JSON válido (sin markdown, sin texto antes/después).
Formato EXACTO:
{
  "headline": string,
  "patterns": string[],
  "risk_times": string[],
  "recommendations": [
    { "title": string, "why": string, "action": string, "impact": string }
  ],
  "plan_7_days": string[]
}
Usa SOLO los datos recibidos, no inventes cifras.
Responde en español.
`;
