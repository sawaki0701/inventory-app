import { AddProductDialog } from "@/components/AddProductDialog";
import { EditProductDialog } from "@/components/EditProductDialog";
import { StockLogDialog } from "@/components/StockLogDialog";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Sort } from "@/components/ui/sort";
import Link from "next/link";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    stock?: string;
    sort?: string;
    page?: string;
  };
}) {
  // ★ 追加：searchParams展開
  const { q, category, stock, sort, page } = await searchParams;

  // 追加：where組み立て
  const where: any = {};

  // 検索（商品名）
  if (q) {
    where.OR = [
      {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        category: {
          contains: q,
          mode: "insensitive",
        },
      },
    ];
  }

  // カテゴリ絞り込み
  if (category) {
    where.category = category;
  }

  // 在庫状態
  if (stock === "low") {
    where.quantity = { lte: 5 }; // ※後でalertLevel連動にできる
  }

  if (stock === "out") {
    where.quantity = 0;
  }

  // DB取得
  let orderBy: any = { createdAt: "desc" };

  if (sort === "stockAsc") {
    orderBy = {
      quantity: "asc",
    };
  }

  if (sort === "stockDesc") {
    orderBy = {
      quantity: "desc",
    };
  }

  const currentPage = Number(page) || 1;
  const take = 10;
  const skip = (currentPage - 1) * take;

  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take,
  });

  const totalCount = await prisma.product.count({
    where,
  });

  const totalPages = Math.ceil(totalCount / take);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <div>
            {/* リセット */}
            <Link href="/" className="text-2xl font-bold text-gray-900">
              在庫管理システム
            </Link>
            <p className="text-gray-500">
              商品の登録と在庫状況の確認ができます
            </p>
          </div>

          {/* 追加：検索＋絞り込みUI */}
          <form method="GET" className="flex flex-col items-center gap-1">
            {/* 検索 */}
            <div className="flex items-center gap-1">
              <input
                type="text"
                name="q"
                defaultValue={q ?? ""}
                placeholder="商品名で検索"
                className="rounded-lg border pl-3 pr-60 py-1"
              />
              <Button type="submit" variant="default" className="font-bold">
                検索
              </Button>
            </div>
          </form>

          {/* 商品追加 */}
          <AddProductDialog />
        </div>

        {/* 在庫一覧（本物のデータを表示！） */}
        <div className="w-full bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4">在庫一覧</h2>
            <Sort />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-sm text-gray-600">
                  <th className="p-3 font-semibold">商品名</th>
                  <th className="p-3 font-semibold">SKU</th>
                  <th className="p-3 font-semibold">カテゴリ</th>
                  <th className="p-3 font-semibold text-right">在庫数</th>
                  <th className="p-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3">
                      <code className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        {product.sku}
                      </code>
                    </td>
                    <td className="p-3">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {product.category || "未分類"}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold">
                      {product.quantity.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <StockLogDialog
                          productId={product.id}
                          productName={product.name}
                        />
                        <EditProductDialog product={product} />
                      </div>
                    </td>
                  </tr>
                ))}

                {/* データが1件もない場合の表示 */}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-400">
                      商品がまだ登録されていません。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => (
                <Link
                  key={i}
                  href={`/?page=${i + 1}`}
                  className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-black text-white" : "bg-white"}`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
