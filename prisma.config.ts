// prisma.config.ts
import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";

// .envファイルを明示的に読み込む
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
