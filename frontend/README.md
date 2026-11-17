# TaskManagement Frontend

React 19 / TypeScript 6 / Vite 8による個人用カンバンUI。

## 起動

Node.jsとnpmを用意する。必要なNode.jsの版は `package-lock.json` 内のVite等のengines条件を満たすものを使用する。
リポジトリルートから実行する。

```sh
cd frontend
npm ci
npm run dev
```

ブラウザで `http://localhost:5173` を開く。[バックエンドとDB](../backend/README.md)も別途起動する。
API接続先は `src/api/authApi.ts` と `src/api/taskApi.ts` 内の `http://localhost:8080/api` に固定されている。
バックエンドのCORS許可元も `http://localhost:5173`。別ポート・別ホスト・HTTPS配信に変える場合は接続先とCORS設定を合わせて変更する必要がある。

## コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | Vite開発サーバー |
| `npm run build` | TypeScriptチェックと本番用ビルド（dist） |
| `npm run lint` | ESLint |
| `npm run preview` | ビルド済みdistのローカル確認。バックエンドのCORS許可元と異なる既定ポートではAPI利用不可 |

テストスクリプト、Vitest、React Testing Library、Prettierは現時点で未導入。上記コマンドの定義は `package.json`、確定版は `package-lock.json` を参照。

## 画面・構成

| URL | 画面 |
| --- | --- |
| /login | メールとパスワードによるログイン |
| /register | ニックネーム・メール・パスワード・確認入力。登録成功後はボードへ直接遷移 |
| / | ボード。認証必須 |
| /completed | 完了タスク一覧・タイトル/説明検索。認証必須 |

- `src/components/`：画面・カラム・カード・追加/編集モーダル
- `src/hooks/`：認証状態・タスク操作と一覧更新
- `src/api/`：Axios通信とJWT保存（localStorage）
- `src/router/ProtectedRoute.tsx`：認証ガード
- `src/types/task.ts`：リクエスト/レスポンス型

実装済みの操作と制約は [ルートREADME](../README.md) と [現行実装との対応表](../docs/implementation-status.md) を参照。
タスク本体はPostgreSQLへ保存され、localStorageへ保存するのはJWT。グループ共有は未実装。
