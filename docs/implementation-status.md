# 現行実装との対応表

[← README](../README.md) / [要件定義](requirements.md)

2026-11-15、Issue [#100](https://github.com/yamamotonaoki3/TaskManagement/issues/100) で main の `7a6ff8b` を基準に照合した。要件定義に書かれた目標を実装済みとはみなさず、以下はリポジトリ内のコード・設定を根拠とする。本番の稼働・性能・運用体制を保証する資料ではない。

## 機能と操作

| 項目 | 現行の動作 | 根拠 |
| --- | --- | --- |
| 登録 | ニックネーム・メール・パスワードを登録。JWTを保存してボードへ直接遷移し、初期3列を自動作成 | `RegisterPage.tsx`、`AuthService.java`、`TaskListService.java` |
| カード追加 | 表示順の先頭カラムだけに「+ 追加」がある。カラムを並べ替えると追加先も変わる。新規タスクのstatusは常にtodo | `KanbanBoard.tsx`、`TaskCreateModal.tsx`、`TaskService.create` |
| 移動 | カード・カラムをドラッグで並べ替え可能。既定の列名に応じてstatusを変更。カスタム列への移動では直前のstatusを保持 | `KanbanBoard.tsx`、`TaskService.updateStatus` |
| 完了日 | statusをdoneに更新するたび現在日時を設定。done以外に更新すると完了日時をクリア | `TaskService.updateStatus` |
| 編集 | タイトル・説明・期限・優先度を変更して保存。既存期限を空欄にしてもAPIでは元の日付が残る制約あり | `TaskDetailModal.tsx`、`TaskService.updateTask` |
| ボードから削除 | status=doneならアーカイブ。未完了なら物理削除 | `useTasks.deleteTask` |
| 完了一覧から削除 | 詳細モーダルの「削除する」で物理削除。履歴も残らない | `CompletedTasksPage.handleDelete` |
| カラム削除 | デフォルト列は不可。未アーカイブのタスクが残るカスタム列も不可。削除可能なカスタム列に残るアーカイブ済みタスクは物理削除される | `TaskListService.delete` |
| ソート | 各列で優先度順（高→中→低）、期限順（早い順・未設定は末尾）を保存。タイトル順は未実装。ボタンの選択解除で以前の順序に戻す処理はない | `KanbanColumn.handleSort` |
| 期限警告色 | 残り7日以内から白→赤へ連続変化。期限切れは最大強度。doneは対象外 | `TaskCard.getDueDateStyle` |
| ボード検索 | 入力後300msでAPI検索。タイトル・説明を空白区切りORで部分一致。検索APIにはarchived除外条件がないため、通常ボードでは隠れるアーカイブ済みタスクが検索で現れる場合がある | `useTasks.refresh`、`TaskService.search`、`TaskRepository.searchByKeyword` |
| 完了一覧・検索 | status=doneが対象でarchivedの真偽は問わない。空欄時は完了日時降順。検索はタイトル欄・説明欄の各単語および両欄間ともOR | `TaskService.searchCompleted` |
| 検索文字の扱い | 小文字化して照合。NFKC正規化なしで、全角半角は区別する。単語分割はJavaの `trim()` と `split("\\s+")` によるため、全角スペース等のUnicode空白の分割は保証しない | `TaskService.java` |
| 完了検索の順序 | タイトル一致を先に追加し、説明一致を後から重複除外して追加。両欄を使うと、検索結果全体が完了日時降順になるとは限らない | `TaskService.searchCompleted` |

## 認証・構成・運用

- 画面ルートは `/login`、`/register`、`/`、`/completed`。ボードと完了一覧には認証ガードがある。
- JWTをlocalStorageの `jwt_token` に保存し、APIへ `Authorization: Bearer ...` を送る。既定の有効期間は24時間。ログアウトはブラウザのJWT削除で、サーバー側失効APIはない。
- Spring SecurityはSTATELESS、BCrypt、CSRF無効。CORS許可元は `http://localhost:5173`。認証・タスクAPIのURLはフロントコード内で `http://localhost:8080/api` に固定されている。
- APIの `/api/auth/**` はSecurityFilterChain上でpermitAllだが、`/me` と `/me/nickname` は認証済みユーザー情報を前提とする。未認証の正常利用を案内しない。
- 本番HTTPS、HttpOnly/Secure Cookie、アカウントロックアウト、JWT失効、CSRFトークン方式、自動バックアップ、監視、ログ保管、CI/CDは現行リポジトリで実装・運用を確認できない。要件上の将来目標として扱う。
- タスク・カラムはREST API経由でPostgreSQLへ保存する。現行ReactアプリにlocalStorageでタスクを管理するモードはない。`prototype/` は別の試作用HTML/JavaScriptで、現行アプリの仕様根拠にはしない。
- Flyway V1〜V12には試験データ・試験ユーザーを投入する履歴がある。空DBへの導入でも「初期データなし」にはならない。公開運用へそのまま利用できる構成とはしていない。
- フロントエンドは `dev` / `build` / `lint` / `preview` のみ。Vitest、React Testing Library、Prettierは未導入。バックエンドはSpring Boot Testによるコンテキスト読込とユーザー分離テストがある。

## 将来設計と未実装

フェーズ5のグループ・メンバー招待・共有は [将来要件](requirements_phase5.md) に限定する。現行のController・Entity・マイグレーションにグループ実装はない。将来案はBOARDを新設する方式ではなく、LISTへgroup_idを追加する案。

タイトル順ソート、独自の日付8桁自動整形、NFKC検索、上記運用・セキュリティ目標は実装済みとして扱わない。期限クリアや検索結果の順序・アーカイブ露出は現状の制約であり、この文書修正ではアプリの挙動を変えていない。

## 監査範囲

ルート・frontend・backendのREADME、CLAUDE.mdの技術情報、要件定義2件、`docs/details/` の全10資料を確認した。改訂履歴の過去の版・内容は当時の記録として保持する。`.github` のIssue/PRテンプレートは作業用書式で、製品機能の説明ではないため変更しない。

今回の追加検証は文書とソースの静的照合・リンク/コマンド/版の整合確認であり、全機能の新規E2E・本番動作確認は実施していない。
