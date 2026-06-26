"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type Props = {
  productId: number;
  productName: string;
};

type StockLog = {
  id: number;
  changeQty: number;
  reason: string | null;
  createdAt: string;
};

export function StockLogDialog({ productId, productName }: Props) {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<StockLog[]>([]);

  useEffect(() => {
    if (!open) return;

    const fetchLogs = async () => {
      const res = await fetch(`/api/products/${productId}/logs`);

      const data = await res.json();

      setLogs(data);
    };

    fetchLogs();
  }, [open, productId]);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        履歴
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] h-[470px] flex flex-col">
          <DialogHeader>
            <DialogTitle>{productName} の履歴</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-sm text-gray-600">
                  <th className="p-3 font-semibold text-left">日時</th>
                  <th className="p-3 font-semibold text-right">数量</th>
                  <th className="p-3 font-semibold text-left">理由</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b">
                    <td className="p-3">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td
                      className={
                        log.changeQty > 0
                          ? "text-green-600 p-3 text-right"
                          : "text-red-600 p-3 text-right"
                      }
                    >
                      {log.changeQty > 0 ? `+${log.changeQty}` : log.changeQty}
                    </td>

                    <td className="p-3">{log.reason ?? "-"}</td>
                  </tr>
                ))}

                {logs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-5">
                      履歴がありません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
