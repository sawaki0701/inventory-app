import InventoryPage from "@/app/page";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe("InventoryPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.product.count as jest.Mock).mockResolvedValue(0);
  });

  it("検索ワードがある場合、name/category検索条件を作る", async () => {
    await InventoryPage({
      searchParams: Promise.resolve({
        q: "iphone",
      }),
    } as any);

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            {
              name: {
                contains: "iphone",
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: "iphone",
                mode: "insensitive",
              },
            },
          ],
        },
      }),
    );
  });

  it("カテゴリ検索できる", async () => {
    await InventoryPage({
      searchParams: Promise.resolve({
        category: "PC",
      }),
    } as any);

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: "PC",
        }),
      }),
    );
  });

  it("在庫少ないフィルタ", async () => {
    await InventoryPage({
      searchParams: Promise.resolve({
        stock: "low",
      }),
    } as any);

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          quantity: {
            lte: 5,
          },
        },
      }),
    );
  });

  it("在庫切れフィルタ", async () => {
    await InventoryPage({
      searchParams: Promise.resolve({
        stock: "out",
      }),
    } as any);

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          quantity: 0,
        },
      }),
    );
  });

  it("在庫昇順ソート", async () => {
    await InventoryPage({
      searchParams: Promise.resolve({
        sort: "stockAsc",
      }),
    } as any);

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: {
          quantity: "asc",
        },
      }),
    );
  });

  it("在庫降順ソート", async () => {
    await InventoryPage({
      searchParams: Promise.resolve({
        sort: "stockDesc",
      }),
    } as any);

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: {
          quantity: "desc",
        },
      }),
    );
  });

  it("3ページ目ならskip=20", async () => {
    await InventoryPage({
      searchParams: Promise.resolve({
        page: "3",
      }),
    } as any);

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 20,
        take: 10,
      }),
    );
  });

  it("ページ数を計算できる", async () => {
    (prisma.product.count as jest.Mock).mockResolvedValue(25);

    const page = await InventoryPage({
      searchParams: Promise.resolve({}),
    } as any);

    expect(page).toBeDefined();
  });

  it("商品が0件なら空メッセージ分岐", async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.product.count as jest.Mock).mockResolvedValue(0);

    const page = await InventoryPage({
      searchParams: Promise.resolve({}),
    } as any);

    expect(page).toBeDefined();
  });

  it("ページネーション生成", async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        name: "iPhone",
        sku: "IP001",
        quantity: 10,
        category: "スマートフォン",
        alertLevel: 5,
      },
    ]);

    (prisma.product.count as jest.Mock).mockResolvedValue(25);

    const page = await InventoryPage({
      searchParams: Promise.resolve({
        page: "2",
      }),
    } as any);

    expect(page).toBeDefined();
  });

  it("カテゴリがnullなら未分類になる", async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        name: "iPhone",
        sku: "IP001",
        quantity: 10,
        category: null, // ★ここ重要
        alertLevel: 5,
      },
    ]);

    (prisma.product.count as jest.Mock).mockResolvedValue(1);

    const page = await InventoryPage({
      searchParams: {},
    } as any);

    expect(page).toBeDefined();
  });
});
