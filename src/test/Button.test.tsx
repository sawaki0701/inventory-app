import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("asChild=trueで描画できる", () => {
    render(
      <Button asChild>
        <a href="/products">商品一覧</a>
      </Button>,
    );

    const link = screen.getByRole("link", {
      name: "商品一覧",
    });

    expect(link).toBeTruthy();
  });
});
