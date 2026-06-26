"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function Sort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      {/* カテゴリ */}
      <h3 className="pl-5">カテゴリ:</h3>
      <select
        name="category"
        defaultValue={searchParams.get("category") ?? ""}
        onChange={(e) => handleChange("category", e.target.value)}
        className="border px-2 py-1 rounded-lg w-40"
      >
        <option value="" className="font-semibold">
          カテゴリ指定なし
        </option>
        <option value="スマートフォン">スマートフォン</option>
        <option value="タブレット">タブレット</option>
        <option value="PC">PC</option>
      </select>
      {/* 在庫状態 */}
      <h3 className="pl-5">在庫状況:</h3>
      <select
        name="stock"
        defaultValue={searchParams.get("stock") ?? ""}
        onChange={(e) => handleChange("stock", e.target.value)}
        className="border px-2 py-1 rounded-lg w-40"
      >
        <option value="">在庫状況指定なし</option>
        <option value="low">在庫少ない</option>
        <option value="out">在庫切れ</option>
      </select>
      {/* 並び替え */}
      <h3 className="pl-5">並び替え:</h3>
      <select
        defaultValue={searchParams.get("sort") ?? ""}
        onChange={(e) => handleChange("sort", e.target.value)}
        className="border px-2 py-1 rounded-lg w-40"
      >
        <option value="">新しい順</option>
        <option value="stockAsc">在庫少ない順</option>
        <option value="stockDesc">在庫多い順</option>
      </select>
    </div>
  );
}
