/**
 * @jest-environment node
 */
import { DELETE } from "@/app/api/products/[id]/route";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    stockLog: {
      deleteMany: jest.fn(),
    },
    product: {
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe("商品削除API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("商品を削除できる", async () => {
    (prisma.$transaction as jest.Mock).mockResolvedValue([]);

    const request = new Request("http://localhost/api/products/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({
        id: "1",
      }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body.message).toBe("削除成功");

    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it("IDが不正なら400を返す", async () => {
    const request = new Request("http://localhost/api/products/abc", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({
        id: "abc",
      }),
    });

    expect(response.status).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("IDが不正です");
  });
});
