import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ==============================
// 在庫増減API
// ==============================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, changeQty, reason } = body;

    // ==============================
    // ① バリデーション
    // ==============================
    const id = Number(productId);
    const qty = Number(changeQty);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "productIdが不正です" },
        { status: 400 },
      );
    }

    if (isNaN(qty)) {
      return NextResponse.json(
        { error: "changeQtyが不正です" },
        { status: 400 },
      );
    }

    if (qty === 0) {
      return NextResponse.json(
        { error: "changeQtyは0以外にしてください" },
        { status: 400 },
      );
    }

    // ==============================
    // ② トランザクション
    // ==============================
    const result = await prisma.$transaction(async (tx: any) => {
      // 商品取得
      const product = await tx.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new Error("商品が存在しません");
      }

      // 在庫チェック（マイナス防止）
      const newQuantity = product.quantity + qty;

      if (newQuantity < 0) {
        throw new Error("在庫が不足しています");
      }

      // ① 在庫更新
      const updated = await tx.product.update({
        where: { id },
        data: {
          quantity: newQuantity,
        },
      });

      // ② 履歴追加
      await tx.stockLog.create({
        data: {
          productId: id,
          changeQty: qty,
          reason: reason || "在庫操作",
        },
      });

      return updated;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: "在庫操作に失敗しました",
        detail: error.message,
      },
      { status: 500 },
    );
  }
}
