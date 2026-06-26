import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditProductDialog } from "@/components/EditProductDialog";

const product = {
  id: 1,
  name: "iPhone16",
  category: "スマホ",
  quantity: 10,
  alertLevel: 5,
};

describe("EditProductDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, "location", {
      value: {
        reload: jest.fn(),
      },
      writable: true,
    });

    global.alert = jest.fn();
    global.confirm = jest.fn();
  });

  it("商品更新成功（在庫変更あり）", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
    });

    render(<EditProductDialog product={product} />);

    await userEvent.click(screen.getByText("編集"));

    const quantityInput = screen.getByLabelText("在庫数");

    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "15");

    await userEvent.click(
      screen.getByRole("button", {
        name: "商品を更新する",
      }),
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "/api/products/1",
      expect.objectContaining({
        method: "PATCH",
      }),
    );

    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "/api/stock",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("商品更新成功（在庫変更なし）", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
    });

    render(<EditProductDialog product={product} />);

    await userEvent.click(screen.getByText("編集"));

    await userEvent.click(
      screen.getByRole("button", {
        name: "商品を更新する",
      }),
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/products/1",
      expect.objectContaining({
        method: "PATCH",
      }),
    );
  });

  it("商品更新失敗", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("update error"));

    render(<EditProductDialog product={product} />);

    await userEvent.click(screen.getByText("編集"));

    await userEvent.click(
      screen.getByRole("button", {
        name: "商品を更新する",
      }),
    );

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith("更新に失敗しました");
    });
  });

  it("削除キャンセル", async () => {
    global.confirm = jest.fn(() => false);

    global.fetch = jest.fn();

    render(<EditProductDialog product={product} />);

    await userEvent.click(screen.getByText("編集"));

    await userEvent.click(
      screen.getByRole("button", {
        name: "削除する",
      }),
    );

    expect(confirm).toHaveBeenCalled();

    expect(fetch).not.toHaveBeenCalled();
  });

  it("削除成功", async () => {
    global.confirm = jest.fn(() => true);

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
    });

    render(<EditProductDialog product={product} />);

    await userEvent.click(screen.getByText("編集"));

    await userEvent.click(
      screen.getByRole("button", {
        name: "削除する",
      }),
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/products/1", {
        method: "DELETE",
      });
    });

    expect(window.location.reload).toHaveBeenCalled();
  });

  it("削除失敗", async () => {
    global.confirm = jest.fn(() => true);

    global.fetch = jest.fn().mockRejectedValue(new Error("delete error"));

    render(<EditProductDialog product={product} />);

    await userEvent.click(screen.getByText("編集"));

    await userEvent.click(
      screen.getByRole("button", {
        name: "削除する",
      }),
    );

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith("削除に失敗しました");
    });
  });

  it("カテゴリ未設定でも表示できる", async () => {
    const productWithoutCategory = {
      id: 1,
      name: "iPhone16",
      category: null,
      quantity: 10,
      alertLevel: 5,
    };

    render(<EditProductDialog product={productWithoutCategory} />);

    await userEvent.click(screen.getByText("編集"));

    const categoryInput = screen.getByLabelText("カテゴリ") as HTMLInputElement;

    expect(categoryInput.value).toBe("");
  });
});
