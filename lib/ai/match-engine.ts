import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Main function: Scores and ranks grants using AI.
 */
export async function matchGrants(project: any, grants: any[]) {
  const results: any[] = [];

  for (const grant of grants) {
    const prompt = `
You are an expert grant reviewer. Score how well this project matches the grant.

Project:
${JSON.stringify(project, null, 2)}

Grant:
${JSON.stringify(grant, null, 2)}

Return a JSON object with:
- score (0-100)
- explanation (2-3 sentences)
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    results.push({
      grant,
      score: parsed.score,
      explanation: parsed.explanation
    });
  }

  return rankResults(results);
}

/**
 * 126C — Ranking Algorithm
 * Sorts grants by score (highest → lowest).
 */
function rankResults(results: any[]) {
  return results.sort((a, b) => b.score - a.score);
}
