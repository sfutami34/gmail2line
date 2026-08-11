# Gmail → LINE 転送（GAS）

このリポジトリ／ドキュメントは、Google Apps Script（GAS）を使って Gmail を受信し、LINE に転送するための手順をまとめた README です。

---

## 1. 準備

1. Google アカウントを作成する（既存のアカウントがあれば新規作成は不要）。
2. GAS（Google Apps Script）でプロジェクトを作成する。  
   - A) [Google Cloud](https://console.cloud.google.com/welcome?hl=ja)へアクセスし、「プロジェクトの選択」から「新しいプロジェクト」を選択する。  
   - B) 「プロジェクト名」を入力する。「親リソース」はデフォルト（組織なし）のままで良い。
3. 作成したプロジェクトで Gmail API を有効化する。  
   - A) (2)で作成したプロジェクトで「API とサービス」から「ライブラリ」を選択する。
     ※ 2026年8月2日時点では、画面左上の「三」マークから選択できる。  
   - B) 「Gmail API」を選択する。  
   - C) 「有効にする」を選択し、有効化する。
4. LINE 公式アカウントを作成する。  
   - [クイックスタート](https://developers.line.biz/ja/docs/messaging-api/getting-started/#create-oa)を参考に公式アカウントを作成する。
5. LINE Messaging API を使用するためのアクセストークンを作成する。  
   - A) [LINE Official Account Manager](https://account.line.biz/login?redirectUri=https%3A%2F%2Faccount.line.biz%2Foauth2%2Fcallback%3Fclient_id%3D10%26code_challenge%3DAniP_YsWYC5em6FF7zZvB4YQ08pwrX17cMNz1uNWZ8c%26code_challenge_method%3DS256%26redirect_uri%3Dhttps%253A%252F%252Fmanager.line.biz%252Fapi%252Foauth2%252FbizId%252Fcallback%26response_type%3Dcode%26state%3D6lrew9vFYY3mdlNctzU9uuYWsSMOrIHM)にログインする。  
   - B) [クイックスタート](https://developers.line.biz/ja/docs/messaging-api/getting-started/#using-oa-manager)を参考にアクセストークンを取得する。

---

## 2. GAS（Google Apps Script）で Gmail を受信して LINE へ転送する

1. Google Drive 内にスプレッドシートを作成する。  
2. スプレッドシートを開き、シート名を変更する（ここでは「サンプルシート」とする）。  
3. セル A1 に「メールID」、B1 に「受信日時」、C1 に「メール本文」と入力する。  
4. メニューの「拡張機能」から「Apps Script」を選択する。  
5. 「エディタ」から `コード.gs` を選択し、GAS で[Gmailを受信してLINEへ転送するサンプルコード](https://github.com/sfutami34/gmail2line/blob/main/sample.gs)をコピペする。  
6. `accessToken` にアクセストークンを入力する。  
7. `sheetId` にスプレッドシートの ID を入力する。ID は以下のようなスプレッドシート URL の xxxxxxxxxx で示した箇所となります。  
   `https://docs.google.com/spreadsheets/d/xxxxxxxxxx/edit?`
8. 実行タイマーを設定する。サイドバーの時計マーク「トリガー」を選択する。  
9. 画面右下の「トリガーの追加」を選択し、以下の設定でトリガーを追加する（「保存」ボタンを押下する）。  
   - 実行する関数を選択：`main`  
   - 実行するデプロイを選択：`Head`  
   - イベントのソースを選択：時間手動型  
   - 時間ベースのトリガーのタイプを選択：分ベースのタイマー  
   - 時間の感覚を選択（分）：1分おき  
   - エラー通知設定：毎日通知を受け取る

---

## 補足 / 注意事項

- Gmail API の有効化や LINE の設定は、管理者権限やアカウントの種類によって手順や表示が異なる場合があります。  
- スプレッドシートの共有設定や GAS の OAuth 許可ダイアログで適切な権限を付与してください。  
- 大量メールや短い間隔での実行は、API の利用制限やレート制限に達する可能性があります。運用に合わせて間隔を調整してください。
