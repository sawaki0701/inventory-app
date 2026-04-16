import { AddProductDialog } from "@/components/AddProductDialog";

export default function InventoryPage() {
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

          {/* ここにあなたが作ったコンポーネントを配置！ */}
          <AddProductDialog />
        </div>

        {/* 在庫一覧（今はまだ枠だけ） */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">在庫一覧</h2>
          <div className="border-t pt-4 text-center text-gray-400">
            <p>ここに登録した商品が表示されるようになる（まだ）</p>
            <p className="text-sm mt-2">とりあえず右上のボタンから商品を登録</p>
          </div>
        </div>
      </div>
    </main>
  );
}
