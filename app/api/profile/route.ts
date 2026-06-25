import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // TEMP: Replace with real user ID from auth session later
    const userId = "test-user-id";

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    // If no profile exists yet, return defaults
    if (!profile) {
      return NextResponse.json({
        name: "Your Organization",
      });
    }

    return NextResponse.json({
      name: profile.organizationName || "Your Organization",
      profile,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
