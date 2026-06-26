/**
 * @jest-environment node
 */
import { PATCH } from "@/app/api/products/[id]/route";
import { prisma } from "@/lib/prisma";

// ==============================
// Prismaモック
// ==============================
jest.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      update: jest.fn(),
    },
    stockLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe("商品更新API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("商品名を更新できる", async () => {
    // ★追加：更新後の商品を返すようにモック
    (prisma.$transaction as jest.Mock).mockResolvedValue({
      id: 1,
      name: "iPhone 17",
      category: "スマホ",
      quantity: 10,
      alertLevel: 5,
    });

    const request = new Request("http://localhost/api/products/1", {
      method: "PATCH",
      body: JSON.stringify({
        name: "iPhone 17",
      }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({
        id: "1",
      }),
    });

    // ★追加：レスポンス確認
    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body).toEqual({
      id: 1,
      name: "iPhone 17",
      category: "スマホ",
      quantity: 10,
      alertLevel: 5,
    });

    // ★既存確認
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it("不正なIDの場合は400を返す", async () => {
    const request = new Request("http://localhost/api/products/abc", {
      method: "PATCH",
      body: JSON.stringify({
        name: "iPhone 17",
      }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({
        id: "abc",
      }),
    });

    expect(response.status).toBe(400);

    const body = await response.json();

    expect(body).toEqual({
      error: "IDが不正です",
    });
  });
});
