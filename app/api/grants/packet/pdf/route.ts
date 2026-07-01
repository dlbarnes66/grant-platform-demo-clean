import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PDFDocument, StandardFonts } from "pdf-lib";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { grantId } = await req.json();

    const grant = await prisma.grant.findUnique({
      where: { id: grantId },
      include: {
        sections: true,
        budget: true,
        documents: true,
        workspace: true
      }
    });

    if (!grant) {
      return NextResponse.json(
        { error: "Grant not found" },
        { status: 404 }
      );
    }

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    let page = pdf.addPage();
    let y = 750;

    const write = (text: string, size = 12) => {
      page.drawText(text, {
        x: 50,
        y,
        size,
        font
      });
      y -= size + 6;

      if (y < 50) {
        page = pdf.addPage();
        y = 750;
      }
    };

    // Header
    write("Grant Submission Packet", 20);
    write("Grant Title: " + grant.title);
    write("Workspace: " + grant.workspace.name);
    write("");

    // Cover Letter
    write("--- Cover Letter ---", 16);
    write("This submission packet includes all required materials.");
    write("");

    // Narrative
    write("--- Narrative ---", 16);

    for (const section of grant.sections) {
      write(section.title, 14);

      const lines = section.content.split("\n");
      for (const line of lines) {
        write(line.substring(0, 100));
      }

      write("");
    }

    // Budget
    write("--- Budget Summary ---", 16);

    const totalBudget = grant.budget?.total || 0;
    write("Total Budget: $" + totalBudget);

    for (const item of grant.budget?.items || []) {
      const line =
        item.label +
        ": $" +
        item.amount +
        " (" +
        item.category +
        ")";
      write(line);
    }

    write("");

    // Attachments
    write("--- Attachments ---", 16);

    for (const doc of grant.documents) {
      write(doc.name + " (" + doc.tag + ")");
      write("Summary: " + doc.summary.substring(0, 100));
      write("");
    }

    const pdfBytes = await pdf.save();

    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          "attachment; filename=grant_packet_" + grantId + ".pdf"
      }
    });
  } catch (error) {
    console.error("PDF Export Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
