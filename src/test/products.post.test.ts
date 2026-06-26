import { POST } from "@/app/api/products/route";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

describe("POST /api/products", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("商品登録成功（transaction成功）", async () => {
    const mockProduct = { id: 1, name: "iPhone" };

    (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
      return cb({
        product: {
          create: jest.fn().mockResolvedValue(mockProduct),
        },
        stockLog: {
          create: jest.fn().mockResolvedValue({}),
        },
      });
    });

    const req = {
      json: async () => ({
        name: "iPhone",
        sku: "IP001",
        category: "PC",
        quantity: 10,
        alertLevel: 5,
      }),
    } as any;

    const res = await POST(req);

    expect(res.status).toBe(201);
  });

  it("transactionエラーで500になる", async () => {
    (prisma.$transaction as jest.Mock).mockRejectedValue(new Error("db error"));

    const req = {
      json: async () => ({
        name: "iPhone",
        sku: "IP001",
        category: "PC",
        quantity: 10,
        alertLevel: 5,
      }),
    } as any;

    const res = await POST(req);

    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json).toEqual(
      expect.objectContaining({
        error: "商品の登録に失敗しました。",
      }),
    );
  });
});
