import { render, screen } from "@testing-library/react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";

describe("Dialog Components", () => {
  it("Dialog系コンポーネントを描画できる", () => {
    render(
      <Dialog open>
        <DialogPortal>
          <DialogOverlay />

          <DialogContent>
            <DialogClose>閉じる</DialogClose>
            <DialogHeader>
              <DialogTitle>タイトル</DialogTitle>

              <DialogDescription>説明文</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <button>保存</button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>,
    );

    expect(screen.getByText("タイトル")).toBeTruthy();

    expect(screen.getByText("説明文")).toBeTruthy();

    expect(screen.getByText("保存")).toBeTruthy();
  });
});
