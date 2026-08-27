# arl.pg72.tw

業餘無線電等級 3 AI 題庫練習站。

## 開發

```sh
pnpm install
pnpm exec tsc --noEmit
pnpm dev
```

## Cloudflare 設定

1. 建立 D1 database `arl-pg72-tw`，把 ID 寫入 `wrangler.jsonc`。
2. 執行 `wrangler d1 execute arl-pg72-tw --remote --file=schema.sql`。
3. 設定 secrets：`OIDC_CLIENT_ID`、`OIDC_CLIENT_SECRET`、`OIDC_REDIRECT_URI`、`GEMINI_API_KEY`。
4. `GEMINI_MODEL` 可在 `wrangler.jsonc` 修改，預設 `gemini-2.5-flash`。

登入 callback 必須登記為 production 網址的 `/callback`。
