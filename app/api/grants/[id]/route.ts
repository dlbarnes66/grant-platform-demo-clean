import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const grant = await prisma.grantPreview.findUnique({
      where: { id: params.id },
    });

    if (!grant) {
      return NextResponse.json({ grant: null }, { status: 404 });
    }

    return NextResponse.json({ grant });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
