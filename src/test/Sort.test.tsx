import { render, screen, fireEvent } from "@testing-library/react";
import { Sort } from "@/components/ui/sort";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("Sort", () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push,
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(() => null),
      toString: jest.fn(() => ""),
    });
  });

  it("在庫状態変更でURL更新", () => {
    render(<Sort />);

    const selects = screen.getAllByRole("combobox");

    fireEvent.change(selects[1], {
      target: {
        value: "low",
      },
    });

    expect(push).toHaveBeenCalledWith("/?stock=low");
  });

  it("並び替え変更でURL更新", () => {
    render(<Sort />);

    const selects = screen.getAllByRole("combobox");

    fireEvent.change(selects[2], {
      target: {
        value: "stockDesc",
      },
    });

    expect(push).toHaveBeenCalledWith("/?sort=stockDesc");
  });

  it("空文字の場合はパラメータ削除", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(() => null),
      toString: jest.fn(() => "category=PC"),
    });

    render(<Sort />);

    const selects = screen.getAllByRole("combobox");

    fireEvent.change(selects[0], {
      target: {
        value: "",
      },
    });

    expect(push).toHaveBeenCalledWith("/?");
  });

  it("URLパラメータが初期値に反映される", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn((key: string) => {
        if (key === "category") return "PC";
        if (key === "stock") return "low";
        if (key === "sort") return "stockDesc";
        return null;
      }),
      toString: jest.fn(() => ""),
    });

    render(<Sort />);

    const selects = screen.getAllByRole("combobox");

    expect((selects[0] as HTMLSelectElement).value).toBe("PC");
    expect((selects[1] as HTMLSelectElement).value).toBe("low");
    expect((selects[2] as HTMLSelectElement).value).toBe("stockDesc");
  });
});
