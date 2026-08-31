import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoleApi } from "@/modules/auth/permissions";

export async function GET(req: Request) {
  try {
    await requireRoleApi(["ADMIN", "SUPER_ADMIN"]);
    const segments = await prisma.marketingSegment.findMany({
        where: {
             },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(segments);
  } catch (error) {
    console.error("Error fetching marketing segments:", error);
    return NextResponse.json(
      { error: "Failed to fetch marketing segments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireRoleApi(["ADMIN", "SUPER_ADMIN"]);
    const body = await req.json();
    
    const { name, description, rules } = body;
    
    if (!name || !rules) {
      return NextResponse.json({ error: "Name and rules are required" }, { status: 400 });
    }

    const segment = await prisma.marketingSegment.create({
      data: {
          
        name,
        description,
        rules,
      },
    });

    return NextResponse.json(segment);
  } catch (error: any) {
    console.error("Error creating marketing segment:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A segment with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create marketing segment" },
      { status: 500 }
    );
  }
}
