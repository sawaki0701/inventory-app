import { AddProductDialog } from "@/components/AddProductDialog";
import { EditProductDialog } from "@/components/EditProductDialog";
import { StockBtn } from "@/components/ui/stockBtn";
import { prisma } from "@/lib/prisma";

export default async function InventoryPage() {
  // 1. サーバーサイドでデータベースから全商品を取得
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }, // 登録が新しい順に並べる
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              在庫管理システム
            </h1>
            <p className="text-gray-500">
              商品の登録と在庫状況の確認ができます
            </p>
          </div>
          <AddProductDialog />
        </div>

        {/* 在庫一覧（本物のデータを表示！） */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">在庫一覧</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-sm text-gray-600">
                  <th className="p-3 font-semibold">商品名</th>
                  <th className="p-3 font-semibold">SKU</th>
                  <th className="p-3 font-semibold text-right">在庫数</th>
                  <th className="p-3 font-semibold">カテゴリ</th>
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
                    <td className="p-3 text-right font-bold">
                      {product.quantity.toLocaleString()}
                      {/* <StockBtn productId={product.id} /> */}
                    </td>
                    <td className="p-3">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {product.category || "未分類"}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold">
                      <EditProductDialog product={product} />
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
          </div>
        </div>
      </div>
    </main>
  );
}
