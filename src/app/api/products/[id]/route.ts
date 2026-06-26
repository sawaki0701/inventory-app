import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ==============================
// 更新（PATCH）
// ==============================
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await context.params;
    const id = Number(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: "IDが不正です" }, { status: 400 });
    }

    const body = await request.json();
    const { name, category, alertLevel } = body;

    // 更新データ組み立て（undefinedは除外）
    const updateData: any = {};

    if (name) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (alertLevel !== undefined) {
      const level = Number(alertLevel);
      if (isNaN(level)) {
        return NextResponse.json(
          { error: "alertLevelが不正です" },
          { status: 400 },
        );
      }
      updateData.alertLevel = level;
    }

    // トランザクション（ログも残す）
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: updateData,
      });

      // 更新ログ（任意だけど実務的にはおすすめ）
      await tx.stockLog.create({
        data: {
          productId: id,
          changeQty: 0,
          reason: "商品情報更新",
        },
      });

      return updated;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "更新に失敗しました", detail: error.message },
      { status: 500 },
    );
  }
}

// ==============================
// 削除（DELETE）
// ==============================
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // IDチェック
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "IDが不正です" }, { status: 400 });
    }

    // トランザクションで安全に削除
    await prisma.$transaction([
      // ① 履歴削除
      prisma.stockLog.deleteMany({
        where: { productId: id },
      }),

      // ② 商品削除
      prisma.product.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({ message: "削除成功" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "削除に失敗しました", detail: error.message },
      { status: 500 },
    );
  }
}
