import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddProductDialog } from "@/components/AddProductDialog";

describe("AddProductDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, "location", {
      value: {
        reload: jest.fn(),
      },
      writable: true,
    });

    global.alert = jest.fn();
  });

  it("商品登録成功", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
    });

    render(<AddProductDialog />);

    // 修正: ボタン名を実際の表示に合わせる
    await userEvent.click(
      screen.getByRole("button", {
        name: /商品を追加/,
      }),
    );

    await userEvent.type(screen.getByLabelText("商品名"), "iPhone17");

    // 修正: SKU（識別コード）にも対応
    await userEvent.type(screen.getByLabelText(/SKU/), "IP17");

    await userEvent.click(
      screen.getByRole("button", {
        name: /登録/,
      }),
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it("APIエラー", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "SKU重複",
      }),
    });

    render(<AddProductDialog />);

    await userEvent.click(
      screen.getByRole("button", {
        name: /商品を追加/,
      }),
    );

    // 必須項目入力
    await userEvent.type(screen.getByLabelText("商品名"), "iPhone17");

    await userEvent.type(screen.getByLabelText(/SKU/), "IP17");

    await userEvent.click(
      screen.getByRole("button", {
        name: /登録/,
      }),
    );

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith("登録に失敗しました: SKU重複");
    });
  });

  it("通信エラー", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network error"));

    render(<AddProductDialog />);

    await userEvent.click(
      screen.getByRole("button", {
        name: /商品を追加/,
      }),
    );

    // 必須項目入力
    await userEvent.type(screen.getByLabelText("商品名"), "iPhone17");

    await userEvent.type(screen.getByLabelText(/SKU/), "IP17");

    await userEvent.click(
      screen.getByRole("button", {
        name: /登録/,
      }),
    );

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith(
        "サーバーとの通信に失敗しました。Dockerや環境変数を確認してください。",
      );
    });
  });

  it("APIエラー(メッセージなし)", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    render(<AddProductDialog />);

    await userEvent.click(
      screen.getByRole("button", {
        name: /商品を追加/,
      }),
    );

    await userEvent.type(screen.getByLabelText("商品名"), "iPhone17");

    await userEvent.type(screen.getByLabelText(/SKU/), "IP17");

    await userEvent.click(
      screen.getByRole("button", {
        name: /登録/,
      }),
    );

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith("登録に失敗しました: 不明なエラー");
    });
  });
});
