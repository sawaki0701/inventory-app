"use client";

type Props = {
  productId: number;
};

export const StockBtn = ({ productId }: Props) => {
  const handleStock = async (changeQty: number) => {
    await fetch("/api/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        changeQty,
        reason: changeQty > 0 ? "入庫" : "販売",
      }),
    });

    location.reload();
  };

  return (
    <>
      <button
        onClick={() => handleStock(1)}
        className="ml-2 bg-green-500 text-white px-1 rounded"
      >
        ＋
      </button>

      <button
        onClick={() => handleStock(-1)}
        className="ml-1 bg-red-500 text-white px-1 rounded"
      >
        ー
      </button>
    </>
  );
};
