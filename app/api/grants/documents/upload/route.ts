import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const grantId = formData.get("grantId") as string;
    const tag = formData.get("tag") as string;
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const prompt = `
You are an expert grant analyst. Summarize the following document.

Document Name: ${file.name}
Tag: ${tag}

Provide a JSON object:

{
  "summary": "One paragraph summary",
  "keyPoints": ["...", "..."]
}

Return ONLY valid JSON.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: base64
            }
          ]
        }
      ],
      temperature: 0.2,
    });

    const output = JSON.parse(completion.choices[0].message.content);

    const doc = await prisma.grantDocument.create({
      data: {
        grantId,
        name: file.name,
        mimeType: file.type,
        size: file.size,
        tag,
        summary: output.summary,
        keyPoints: output.keyPoints,
        contentBase64: base64
      }
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error) {
    console.error("Document Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
