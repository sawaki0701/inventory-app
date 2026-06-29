import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    // ① リクエスト取得
    const body = await request.json();
    const { email, password } = body;

    // ② バリデーション
    if (!email || !password) {
      return NextResponse.json(
        { error: "email と password は必須です" },
        { status: 400 },
      );
    }
    /*
    // ③ ユーザー取得
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが存在しません" },
        { status: 404 },
      );
    }

    // ④ パスワードチェック
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "パスワードが違います" },
        { status: 401 },
      );
    }*/
    const user = {
      id: 1,
      name: "Demo User",
      email,
    }; //一時的にログイン可能

    // ⑤ JWT発行
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "dev_secret",
      {
        expiresIn: "1d",
      },
    );

    // ⑥ 成功レスポンス
    const res = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "ログインに失敗しました" },
      { status: 500 },
    );
  }
}
