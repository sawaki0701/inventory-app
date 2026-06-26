describe("ページネーション", () => {
  const products = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `商品${i + 1}`,
  }));

  it("1ページ目は10件", () => {
    const page = 1;
    const take = 10;
    const skip = (page - 1) * take;

    const result = products.slice(skip, skip + take);

    expect(result.length).toBe(10);
    expect(result[0].id).toBe(1);
    expect(result[9].id).toBe(10);
  });

  it("2ページ目は10件", () => {
    const page = 2;
    const take = 10;
    const skip = (page - 1) * take;

    const result = products.slice(skip, skip + take);

    expect(result.length).toBe(10);
    expect(result[0].id).toBe(11);
    expect(result[9].id).toBe(20);
  });

  it("3ページ目は5件", () => {
    const page = 3;
    const take = 10;
    const skip = (page - 1) * take;

    const result = products.slice(skip, skip + take);

    expect(result.length).toBe(5);
    expect(result[0].id).toBe(21);
    expect(result[4].id).toBe(25);
  });

  it("総ページ数が正しい", () => {
    const totalCount = 25;
    const take = 10;

    const totalPages = Math.ceil(totalCount / take);

    expect(totalPages).toBe(3);
  });
});
