# TaskManagement Backend

Java 25 / Spring Boot 4.0.9 / Gradle 9.5.0（Kotlin DSL）によるREST API。
ユーザー登録・JWT認証・ニックネーム編集・ユーザー単位のカラム/タスク管理・検索を実装している。

## 構成

- `src/main/java/com/taskmanagement/api/auth/`：登録・ログイン・現在のユーザー・ニックネーム更新
- `security/`：JWT認証、BCrypt、ユーザー識別、CORS
- `user/`、`list/`、`task/`：Entity / Repository / Service / Controller
- `src/main/resources/application.yml`：DB接続、JWT、Flyway
- `src/main/resources/db/migration/`：V1〜V12。V4でcard→taskへ改名、V9でsample_itemを削除
- `src/test/`：コンテキスト読込・ユーザー分離のテスト
- `config/checkstyle/`：Checkstyle 10.21.4のルール

## セットアップ・起動

Java 25とDockerが必要。リポジトリルートから次を実行する。

```powershell
cd backend
# 初回のみ。既存 .env がある場合はコピーしない
Copy-Item .env.example .env
# .env の各値を設定してから起動
# JWT_SECRET はHS256で使える十分な長さ（32バイト以上）の専用値にする
docker compose up -d
.\gradlew.bat bootRun
```

macOS/Linuxは初回コピーに `cp .env.example .env`、起動に `./gradlew bootRun` を使用する。
APIは `http://localhost:8080/api`。フロントエンドは別ターミナルで起動する（[手順](../frontend/README.md)）。

- `backend/.env` でPOSTGRES_DB / POSTGRES_USER / POSTGRES_PASSWORD / JWT_SECRETを指定する。実値はGitへ追加しない。
- Composeは `taskboard-db`、ホスト5432、名前付きデータボリュームを使用。既存開発データと混ぜたくない場合は専用環境と接続先を別途用意する。
- Springはbackendを作業ディレクトリとして `.env` を読み込む。Flywayが未適用マイグレーションを順に適用し、Hibernateはスキーマをvalidateする。
- 過去のマイグレーションには試験ユーザー・タスクの投入がある。公開運用向けの初期化手順ではない。
- アプリはCtrl+C、DBは `docker compose down` で停止。通常停止にボリューム削除オプションは付けない。

## APIの確認

[ルートREADMEのAPI一覧](../README.md#api-エンドポイント一覧)を参照。
フロント画面で架空アカウントを登録し、タスク作成・更新を確認できる。APIを直接呼ぶ場合は登録/ログイン応答のJWTをBearerヘッダーへ指定する。認証情報やJWTを画面共有・ログ・資料へ貼らない。

- `POST /api/auth/register` は成功時201とJWTを返す。登録時に初期3カラムを作成する。
- `GET /api/auth/me`、`PATCH /api/auth/me/nickname` は認証済みのユーザー情報を前提とする。
- タスク/カラムの操作はログインユーザーのデータに限定する。
- 旧 `/api/sample-items` とsampleパッケージは存在しない。既適用マイグレーションV1を削除・置換する手順は実施しない。

## 検証

backendで実行する。統合テストには接続可能なPostgreSQLとDB/JWT設定が必要。テスト用には本番・既存開発用と分離したDBを使用する。

```powershell
.\gradlew.bat test checkstyleMain checkstyleTest
```

macOS/Linuxは `./gradlew test checkstyleMain checkstyleTest`。
テストはSpring Boot Test（JUnit Platform、Mockito等を含むstarter-test）で実行する。

## 現行の制約

[現行実装との対応表](../docs/implementation-status.md)に、削除とアーカイブの使い分け、期限クリア、検索、認証・運用上の制約をまとめている。本番ホスティング・HTTPS・自動バックアップ等は設定されていない。
