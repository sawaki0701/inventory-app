"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      category: formData.get("category"),
      quantity: Number(formData.get("quantity")),
      alertLevel: Number(formData.get("alertLevel")),
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setOpen(false); // 成功したらポップアップを閉じる
        window.location.reload(); // 一覧に反映させるためにリロード
      } else {
        const errorData = await res.json();
        alert(`登録に失敗しました: ${errorData.error || "不明なエラー"}`);
      }
    } catch (error) {
      console.error("通信エラー:", error);
      alert(
        "サーバーとの通信に失敗しました。Dockerや環境変数を確認してください。",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="font-bold">
          ＋ 商品を追加
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新規商品登録</DialogTitle>
          <DialogDescription>
            新しい商品の情報を入力してください。SKUは重複できません。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">商品名</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="例: iPhone 16 Pro"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sku">SKU（識別コード）</Label>
            <Input
              id="sku"
              name="sku"
              required
              placeholder="例: IPHONE-16-PRO"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">カテゴリ</Label>
            <Input
              id="category"
              name="category"
              placeholder="例: スマートフォン"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">初期在庫数</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                defaultValue="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="alertLevel">アラート閾値</Label>
              <Input
                id="alertLevel"
                name="alertLevel"
                type="number"
                min="0"
                defaultValue="5"
              />
            </div>
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "登録中..." : "商品を登録する"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
