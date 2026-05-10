# TaskBoard Backend (api)

Spring Boot 4.0.3 + Java 25 + Gradle (Kotlin DSL) のひな型。
依存は最小構成（Spring Web のみ）。DB／認証／その他依存はカリキュラムの進行に合わせて追加していく。

## 構成

```
backend/
├─ build.gradle.kts                                 # Gradle ビルド設定
├─ settings.gradle.kts                              # プロジェクト名（api）
├─ .gitignore                                       # Gradle/Java/IDE 用
├─ src/
│   ├─ main/
│   │   ├─ java/com/taskmanagement/api/
│   │   │   └─ Application.java                     # エントリポイント
│   │   └─ resources/
│   │       └─ application.yml                      # アプリ設定（ポート等）
│   └─ test/
│       └─ java/com/taskmanagement/api/
│           └─ ApplicationTests.java                # コンテキスト読み込みテスト
```

## まだ含まれていないもの

このひな型には Gradle Wrapper（`gradlew`、`gradlew.bat`、`gradle/wrapper/*`）は含まれていない。
ビルド・実行を行うには、以下のいずれかが必要：

1. ローカルに Gradle をインストールして `gradle wrapper` を実行 → Wrapper ファイル一式を生成し、以後 `./gradlew` を使う
2. Spring Initializr (https://start.spring.io) から同等のスケルトンを ZIP でダウンロードし、Wrapper ファイルだけ取り出してこのフォルダに置く

## 起動方法（Wrapper を用意したあと）

```sh
cd backend
./gradlew bootRun        # Mac/Linux
gradlew.bat bootRun      # Windows
```

`http://localhost:8080` で Spring Boot が起動する（現状エンドポイントはなし）。

## テスト実行

```sh
./gradlew test
```
