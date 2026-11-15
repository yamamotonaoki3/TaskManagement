# 入力チェック仕様（現行実装）

[← 要件定義書](../requirements.md) / [現行実装との対応表](../implementation-status.md)

2026-11-15にReactフォーム、リクエストDTO、GlobalExceptionHandlerを照合した。日本語文言を実装している箇所と、HTML標準制約・サーバー検証を区別する。ブラウザ標準の検証文言はブラウザ/言語設定に依存する。

## タスク追加・編集

| 項目 | UIの制約・動作 | APIの検証・制約 |
| --- | --- | --- |
| タイトル | trim後が空なら追加/保存ボタンを無効化。maxLength=100。trimして送信 | 作成はNotBlankとSize(max=100)。更新はSize(min=1,max=100)のみでNotBlankなし |
| 説明 | maxLength=2000。trimし、空文字なら未設定として送信 | Size(max=2000)。更新ではnull/省略も説明をnullへ更新 |
| 期限 | input type=date。表示形式はブラウザ依存、API値はYYYY-MM-DD。編集時は過去日付を日本語エラーで拒否。独自の8桁自動整形なし | 作成/更新ともFutureOrPresent。日付型で受信。nullの更新では既存期限が残り、期限クリアは未対応 |
| 優先度 | high/medium/lowを高/中/低として選択。初期値は中 | Patternでhigh/medium/lowを検証。作成時nullはmedium、更新時nullは変更なし |
| 追加先 | 表示順の先頭カラムのみ追加ボタンあり | listIdは作成時必須。所有ユーザーを検証。作成statusはtodo固定 |

編集時の独自エラーは「期限に過去の日付は指定できません」。編集/削除失敗は「データの保存に失敗しました。時間をおいて再度お試しください」をフォーム内に表示する。追加モーダルはAPI失敗用の独自エラー表示を実装していない。

## S-03 ユーザー登録

| 項目 | UIの制約・動作 | APIの検証 |
| --- | --- | --- |
| ニックネーム | required、maxLength=50 | NotBlank、Size(max=50) |
| メール | required、type=email。UIに256文字のmaxlength指定なし | NotBlank、Email。DTOのSize検証なし。DB列はVARCHAR(256)、UNIQUE |
| パスワード | required、minLength=8、maxLength=64。英字と数字があるか独自チェック | NotBlank、Size(8〜64)、英字・数字を含むPattern |
| 確認用 | 空欄と不一致を独自チェック。APIへは送信しない | 対象外 |

独自文言：確認用空欄「確認用パスワードを入力してください」、不一致「パスワードが一致しません」、構成違反「パスワードは英字と数字を含めてください」。登録APIの409は「このメールアドレスは既に登録されています」、その他の失敗は「登録に失敗しました。しばらく経ってから再度お試しください」。

## S-04 ログイン

メールはrequired/type=email、パスワードはrequired。APIは両方NotBlank、メールにはEmailを指定。通信障害を含め、画面側の失敗文言は「メールアドレスまたはパスワードが正しくありません」に統一されている。

## S-01 カラム追加・ニックネーム編集

- カラム名はtrim後が空なら追加ボタン無効、maxLength=30。APIはNotBlankとSize(max=30)。追加失敗の独自エラー表示はない。
- ニックネーム編集はtrim後に1〜50文字。空欄は「ニックネームを入力してください」、50文字超は「50文字以内で入力してください」。UIはmaxLength=50、APIはNotBlankとSize(max=50)。
- カラム削除は入力検証とは別に、初期列と未アーカイブタスクの残存をAPIが検証し、409のmessageをカラム内に表示する。

## S-05 完了検索

タイトル欄/説明欄はいずれもmaxLength=50。独自の50文字超エラーは表示しない。APIの検索パラメーターには長さ検証がない。両欄空なら全件表示。検索はボタン押下時に実行する。

各欄内・両欄間ともOR部分一致。小文字化するがNFKC正規化なしで全角半角は区別する。単語区切りはJavaのtrimとsplit("\\s+")が対象とする空白であり、全角スペース等は分割保証なし。

## APIエラーと表示

Bean Validation失敗はHTTP 400、JSONのmessageは「バリデーションエラー」、errorsにフィールド別文言を返す。DTOの制約に独自日本語messageは指定しておらず、errorsの文言は検証ライブラリ/ロケール依存。フロントはこのerrorsを各欄へ展開していない。形式不正の日付等のJSON変換失敗は別のエラー経路となる。

[エラーメッセージ一覧](error-messages.md)を参照。S-06は [未実装の将来要件](../requirements_phase5.md) である。
