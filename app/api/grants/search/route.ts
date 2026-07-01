import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { query, workspaceId } = await req.json();

    // Fetch workspace context
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        name: true,
        mission: true,
        history: true
      }
    });

    // 1. Fetch Federal Grants (Grants.gov)
    const federalRes = await fetch(
      `https://www.grants.gov/grantsws/rest/opportunities/search?keyword=${encodeURIComponent(
        query
      )}&limit=50`
    );
    const federalData = await federalRes.json();

    // 2. Fetch State Grants (Firecrawl ingestion)
    const stateRes = await fetch(
      `https://api.firecrawl.dev/v1/scrape`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FIRECRAWL_API_KEY}`
        },
        body: JSON.stringify({
          url: `https://www.usa.gov/state-government`,
          formats: ["markdown"]
        })
      }
    );
    const stateData = await stateRes.json();

    // Combine raw results
    const rawGrants = [
      ...(federalData?.opportunities || []),
      ...(stateData?.markdown ? [{ title: "State Grants", summary: stateData.markdown }] : [])
    ];

    // AI relevance scoring
    const prompt = `
You are an expert grant analyst. Score each grant based on relevance to this workspace:

Workspace:
- Name: ${workspace?.name}
- Mission: ${workspace?.mission}
- History: ${workspace?.history}

User Query: ${query}

Return ONLY valid JSON in this format:

{
  "results": [
    {
      "title": "Grant Title",
      "summary": "Grant Summary",
      "agency": "Agency Name",
      "deadline": "Deadline",
      "score": 0-100
    }
  ]
}

Grants to score:
${JSON.stringify(rawGrants, null, 2)}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const output = completion.choices[0].message.content;

    return NextResponse.json(JSON.parse(output));
  } catch (error) {
    console.error("Grant Search Error:", error);
    return NextResponse.json(
      { error: "Grant search failed" },
      { status: 500 }
    );
  }
}
