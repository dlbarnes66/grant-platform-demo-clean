import { prisma } from "@/lib/prisma";
import { grantQueue } from "@/worker/queue";   // ⭐ Correct import
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = params;

  // 1. Load the original job
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    return NextResponse.json(
      { error: "Job not found" },
      { status: 404 }
    );
  }

  if (!job.input) {
    return NextResponse.json(
      { error: "This job has no stored input and cannot be re-run" },
      { status: 400 }
    );
  }

  // 2. Create a new job with the same input
  const newJob = await prisma.job.create({
    data: {
      text: job.text,
      input: job.input,     // ⭐ reuse original input
      status: "queued",
    },
  });

  // 3. Enqueue the new job
  await grantQueue.add("process", {
    id: newJob.id,
    input: job.input,       // ⭐ send same input to worker
  });

  // 4. Return the new job ID
  return NextResponse.json({
    success: true,
    newJobId: newJob.id,
  });
}
