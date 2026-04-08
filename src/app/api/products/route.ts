// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, sku, category, quantity, alertLevel } = body;

    // 実務ポイント: トランザクションで一貫性を守る
    const result = await prisma.$transaction(async (tx) => {
      // 1. 商品を登録
      const product = await tx.product.create({
        data: {
          name,
          sku,
          category,
          quantity: Number(quantity),
          alertLevel: Number(alertLevel),
        },
      });

      // 2. 入庫履歴に「初期登録」として記録を残す
      await tx.stockLog.create({
        data: {
          productId: product.id,
          changeQty: Number(quantity),
          reason: "初期在庫登録",
        },
      });

      return product;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "商品の登録に失敗しました。", details: error.message },
      { status: 500 },
    );
  }
}
