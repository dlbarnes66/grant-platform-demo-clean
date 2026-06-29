import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get("applicationId");

  if (!applicationId) {
    return new Response("Missing applicationId", { status: 400 });
  }

  let lastCheck = new Date();

  const stream = new ReadableStream({
    async start(controller) {
      async function poll() {
        const edits = await prisma.applicationEdit.findMany({
          where: {
            applicationId,
            createdAt: { gt: lastCheck },
          },
          orderBy: { createdAt: "asc" },
        });

        lastCheck = new Date();

        if (edits.length > 0) {
          controller.enqueue(`data: ${JSON.stringify(edits)}\n\n`);
        }

        setTimeout(poll, 1500);
      }

      poll();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
