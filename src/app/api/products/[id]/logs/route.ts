import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const logs = await prisma.stockLog.findMany({
      where: {
        productId: Number(id),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "履歴取得に失敗しました",
      },
      {
        status: 500,
      },
    );
  }
}
