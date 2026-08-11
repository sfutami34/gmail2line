# Gmail受信時にLINEグループへメッセージ転送する

このリポジトリ／ドキュメントは、Google Apps Script（GAS）を使って Gmail を受信し、LINE Messaging API を使って LINE のグループチャットに転送するための手順をまとめたものです。

---

## 1. 準備

1. Google アカウントを作成する（既存のアカウントがあれば新規作成は不要）。
2. GAS（Google Apps Script）でプロジェクトを作成する。  
   - A) [Google Cloud](https://console.cloud.google.com/welcome?hl=ja)へアクセスし、「プロジェクトの選択」から「新しいプロジェクト」を選択する。
        <img width="931" height="287" alt="image" src="https://github.com/user-attachments/assets/f3cc1f40-1e42-4c68-8ab2-2c20c8b7e990" />
        <img width="931" height="700" alt="image" src="https://github.com/user-attachments/assets/174c86f7-da73-4faa-97c1-9d3e7f166263" />
   - B) 「プロジェクト名」を入力する。「親リソース」はデフォルト（組織なし）のままで良い。
        <img width="931" height="700" alt="image" src="https://github.com/user-attachments/assets/d8ad8a5e-40e6-4b91-8d9b-179494ddda4f" />
3. 作成したプロジェクトで Gmail API を有効化する。  
   - A) (2)で作成したプロジェクトを選択する（「プロジェクトの選択」から作成したプロジェクトを選択する）。
        <img width="931" height="700" alt="image" src="https://github.com/user-attachments/assets/6c05a19e-afbb-4fde-b934-44dbce6a19e9" />
   - B) 「API とサービス」から「ライブラリ」を選択する。
        <img width="931" height="248" alt="image" src="https://github.com/user-attachments/assets/e122770e-7981-450b-9a29-3281c80a72e9" />
        <img width="931" height="848" alt="image" src="https://github.com/user-attachments/assets/78f5f950-562c-4d45-badc-a4d0efa68e67" />
   - C) 検索窓で「gmail api」を検索する。
        <img width="931" height="578" alt="image" src="https://github.com/user-attachments/assets/74a77513-89bd-45f0-a3d6-6819b1a546a5" />
   - D) 「Gmail API」を選択する。
        <img width="931" height="848" alt="image" src="https://github.com/user-attachments/assets/c1e07e85-77ad-428a-a428-0087789d5b3a" />
   - E) 「有効にする」を選択し、有効化する。
        <img width="931" height="848" alt="image" src="https://github.com/user-attachments/assets/b8812a0f-7db2-46f0-aa30-f66ac1d2bd6f" />
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
