import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    // ① リクエスト取得
    const body = await request.json();
    const { name, email, password } = body;

    // ② バリデーション（最低限）
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 },
      );
    }

    // ③ 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に使用されています" },
        { status: 409 },
      );
    }

    // ④ パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ⑤ ユーザー作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // ⑥ レスポンス（passwordは返さない）
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: "ユーザー登録に失敗しました" },
      { status: 500 },
    );
  }
}
