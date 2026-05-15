# TaskManagement

Trello 風カンバンボードで個人タスクを視覚的に管理する Web アプリ。
React 19 + TypeScript（フロントエンド）と Spring Boot 4.0.3 + PostgreSQL 17（バックエンド）で構成する。

---

## 機能フェーズ

| フェーズ | 内容 | 主な機能 |
| --- | --- | --- |
| Phase 1 | MVP | カード追加・表示・移動・削除 |
| Phase 2 | 基本機能拡張 | 期限・説明文・ドラッグ&ドロップ・アーカイブ |
| Phase 3 | ユーザー機能 | メール+パスワード認証（登録・ログイン・ログアウト） |
| Phase 4 | 便利機能 | 優先度・並び替え・期限警告色・履歴検索 |
| Phase 5 | グループ機能 | グループ作成・メンバー招待・タスク共有 |

---

## 技術スタック

### フロントエンド（Phase 1〜）

| 項目 | 内容 |
| --- | --- |
| 言語 | TypeScript 6.0 |
| ライブラリ | React 19 |
| ビルドツール | Vite 8 |
| ルーティング | React Router |
| HTTP クライアント | Axios（Phase 3〜） |
| テスト | Vitest + React Testing Library |
| Lint / Format | ESLint + Prettier |

### バックエンド（Phase 3〜）

| 項目 | 内容 |
| --- | --- |
| 言語 | Java 25 |
| フレームワーク | Spring Boot 4.0.3 |
| ビルドツール | Gradle 9.5.0（Kotlin DSL） |
| ORM | Spring Data JPA（Hibernate） |
| 認証 | Spring Security + JWT |
| DB マイグレーション | Flyway |
| テスト | JUnit 5 + Mockito |

### データベース

| 項目 | 内容 |
| --- | --- |
| DB | PostgreSQL 17 |
| 起動方法 | Docker / docker-compose |

---

## リポジトリ構成

```text
TaskManagement/
├── backend/          # Spring Boot アプリケーション
│   ├── src/
│   ├── docker-compose.yml
│   └── build.gradle.kts
├── frontend/         # React + TypeScript アプリケーション
│   └── src/
├── docs/             # 要件定義・設計ドキュメント
│   ├── requirements.md
│   ├── requirements_phase5.md
│   └── details/
└── CLAUDE.md         # Claude Code ワークフロールール
```

---

## セットアップ・起動方法

### バックエンド

前提: Docker Desktop が起動していること

```sh
# 1. PostgreSQL を起動
cd backend
docker compose up -d

# 2. アプリを起動（Windows PowerShell）
.\gradlew.bat bootRun

# Mac / Linux
./gradlew bootRun
```

- 起動後、`http://localhost:8080` でアクセス可能
- DB 接続情報（学習用）: DB名・ユーザー・パスワードすべて `taskboard`、ポート `5432`
- 停止: `Ctrl+C`（アプリ）、`docker compose down`（DB）

### フロントエンド

```sh
cd frontend
npm install
npm run dev
```

- 起動後、`http://localhost:5173` でアクセス可能

---

## ドキュメント一覧

| ドキュメント | 内容 |
| --- | --- |
| [要件定義書](docs/requirements.md) | プロジェクト概要・機能要件・非機能要件・技術スタック全体 |
| [フェーズ5 要件（グループ機能）](docs/requirements_phase5.md) | グループ機能の詳細仕様 |
| [業務フロー](docs/details/business-flow.md) | タスク登録〜完了のメイン業務サイクル |
| [ユースケース](docs/details/use-cases.md) | UC-01〜UC-10 の標準形式記述 |
| [画面遷移図](docs/details/screen-transitions.md) | 画面間ナビゲーションフロー |
| [ワイヤーフレーム](docs/details/wireframes.md) | S-01〜S-05 の画面レイアウト |
| [機能 IPO](docs/details/function-ipo.md) | 各機能の入力・処理・出力一覧 |
| [入力チェック仕様](docs/details/input-validation.md) | 画面ごとのバリデーションルール |
| [エラーメッセージ一覧](docs/details/error-messages.md) | エラーコード・メッセージ定義 |
| [データモデル / ER 図](docs/details/data-model.md) | エンティティ定義と ER 図 |
| [システム構成図](docs/details/system-architecture.md) | 3層構成の設計 |
| [改訂履歴](docs/details/revision-history.md) | ドキュメントの変更履歴 |
