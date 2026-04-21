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

type Props = {
  product: {
    id: number;
    name: string;
    category: string | null;
    quantity: number;
    alertLevel: number;
  };
};

export function EditProductDialog({ product }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get("name"),
      category: formData.get("category"),
      alertLevel: Number(formData.get("alertLevel")),
    };

    try {
      // 商品情報更新
      await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // 在庫変更（差分）
      const newQty = Number(formData.get("quantity"));
      const diff = newQty - product.quantity;

      if (diff !== 0) {
        await fetch("/api/stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            changeQty: diff,
            reason: "手動調整",
          }),
        });
      }

      setOpen(false);
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("更新に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const ok = confirm("履歴は完全に削除されますがよろしいですか？");

    if (!ok) return;

    try {
      await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      setOpen(false);
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("削除に失敗しました");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="ml-2">
          編集
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>商品編集</DialogTitle>
          <DialogDescription>
            商品情報と在庫数を更新できます。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-4">
          {/* 商品名 */}
          <div className="grid gap-2">
            <Label htmlFor="name">商品名</Label>
            <Input id="name" name="name" defaultValue={product.name} />
          </div>

          {/* カテゴリ */}
          <div className="grid gap-2">
            <Label htmlFor="category">カテゴリ</Label>
            <Input
              id="category"
              name="category"
              defaultValue={product.category ?? ""}
            />
          </div>

          {/* 在庫 */}
          <div className="grid gap-2">
            <Label htmlFor="quantity">在庫数</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              defaultValue={product.quantity}
            />
          </div>

          {/* アラート */}
          <div className="grid gap-2">
            <Label htmlFor="alertLevel">アラート閾値</Label>
            <Input
              id="alertLevel"
              name="alertLevel"
              type="number"
              defaultValue={product.alertLevel}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "更新中..." : "商品を更新する"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
          >
            削除する
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
