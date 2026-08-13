# Gmail受信時にLINEグループへメッセージ転送する

このリポジトリ／ドキュメントは、Google Apps Script（GAS）を使って Gmail を受信し、LINE Messaging API を使って LINE のグループチャットに転送するための手順をまとめたものです。

---

## 1. 準備

1. Google アカウントを作成する（既存のアカウントがあれば新規作成は不要）。
2. GAS（Google Apps Script）でプロジェクトを作成する。  
   - [Google Cloud](https://console.cloud.google.com/welcome?hl=ja)へアクセスし、「プロジェクトの選択」から「新しいプロジェクト」を選択する。
     <img width="931" height="287" alt="image" src="https://github.com/user-attachments/assets/f3cc1f40-1e42-4c68-8ab2-2c20c8b7e990" />
     <img width="931" height="700" alt="image" src="https://github.com/user-attachments/assets/174c86f7-da73-4faa-97c1-9d3e7f166263" />
   - 「プロジェクト名」を入力する。「親リソース」はデフォルト（組織なし）のままで良い。
     <img width="931" height="700" alt="image" src="https://github.com/user-attachments/assets/d8ad8a5e-40e6-4b91-8d9b-179494ddda4f" />
3. 作成したプロジェクトで Gmail API を有効化する。  
   - (2)で作成したプロジェクトを選択する（「プロジェクトの選択」から作成したプロジェクトを選択する）。
     <img width="931" height="700" alt="image" src="https://github.com/user-attachments/assets/6c05a19e-afbb-4fde-b934-44dbce6a19e9" />
   - 「API とサービス」から「ライブラリ」を選択する。
     <img width="931" height="248" alt="image" src="https://github.com/user-attachments/assets/e122770e-7981-450b-9a29-3281c80a72e9" />
     <img width="931" height="848" alt="image" src="https://github.com/user-attachments/assets/2f1e1cb2-f79e-42aa-9a42-ca80da24a3ed" />
   - 検索窓で「gmail api」を検索する。
     <img width="931" height="578" alt="image" src="https://github.com/user-attachments/assets/74a77513-89bd-45f0-a3d6-6819b1a546a5" />
   - 「Gmail API」を選択する。
     <img width="931" height="848" alt="image" src="https://github.com/user-attachments/assets/c1e07e85-77ad-428a-a428-0087789d5b3a" />
   - 「有効にする」を選択し、有効化する。
     <img width="931" height="848" alt="image" src="https://github.com/user-attachments/assets/b8812a0f-7db2-46f0-aa30-f66ac1d2bd6f" />
4. LINE 公式アカウントを作成する。  
   - [クイックスタート（1. LINE公式アカウントを作成する）](https://developers.line.biz/ja/docs/messaging-api/getting-started/#create-oa)を参考に公式アカウントを作成する。
5. LINE Messaging API を使用するためのアクセストークンを作成する。  
   - [LINE Official Account Manager](https://account.line.biz/login?redirectUri=https%3A%2F%2Faccount.line.biz%2Foauth2%2Fcallback%3Fclient_id%3D10%26code_challenge%3DAniP_YsWYC5em6FF7zZvB4YQ08pwrX17cMNz1uNWZ8c%26code_challenge_method%3DS256%26redirect_uri%3Dhttps%253A%252F%252Fmanager.line.biz%252Fapi%252Foauth2%252FbizId%252Fcallback%26response_type%3Dcode%26state%3D6lrew9vFYY3mdlNctzU9uuYWsSMOrIHM)にログインしてアカウントを作成する。
     例）「gmail2ine用アカウント」という名前でアカウントを作成した場合の画面
     <img width="1056" height="741" alt="image" src="https://github.com/user-attachments/assets/2d84e1ee-65bc-4180-8c43-844e88a423b5" />
   - [クイックスタート（2. LINE公式アカウントでMessaging APIを有効にする）](https://developers.line.biz/ja/docs/messaging-api/getting-started/#using-oa-manager)を参考にアクセストークンを取得する。
      - 「設定」→「Messaging API」→「Messaging APIを利用する」の順に選択する。
        <img width="1310" height="300" alt="image" src="https://github.com/user-attachments/assets/6091f3dc-844e-4ca9-ba4d-e743b3b92b72" />
        <img width="1310" height="560" alt="image" src="https://github.com/user-attachments/assets/79edea6b-5bef-4f67-8898-6f8b2ae83759" />
      - 新規プロバイダー名を入力し、「同意する」を選択する。プライバシーポリシーと利用規約のURLの入力を求められますが、任意のためなければそのまま「OK」を選択する。
        <img width="1310" height="827" alt="image" src="https://github.com/user-attachments/assets/539bebc5-de32-4f80-a479-9bd146f99f38" />
      - 「以下の内容でMessaging APIを利用しますか？」と聞かれるため、「OK」を選択する。
        <img width="615" height="397" alt="image" src="https://github.com/user-attachments/assets/979e917d-77a8-4ce4-80e2-4a7bd11005c1" />
      - 表示された画面の「LINE Developersコンソール」を選択する。
        <img width="1310" height="686" alt="image" src="https://github.com/user-attachments/assets/e6428ec3-e5e6-4a44-aeaf-d057c859a417" />
      - 作成したプロバイダーを選択し、以下の画面が表示されればOK。
        <img width="1310" height="734" alt="image" src="https://github.com/user-attachments/assets/f4a81e59-7f49-4624-b3e3-98d477aea6c6" />
      - 「gmail2lineアカウント」を選択する。
        <img width="1064" height="640" alt="image" src="https://github.com/user-attachments/assets/88b28501-ba0f-4b87-a94b-4ed92c477ac2" />
      - 「Messaging API設定」を選択する。
        <img width="779" height="794" alt="image" src="https://github.com/user-attachments/assets/9ea73a9d-2e66-438a-ad49-0b757c47049b" />
      - 画面下端までスクロールして、「発行」を選択する。
        <img width="1064" height="640" alt="image" src="https://github.com/user-attachments/assets/b8328f13-f57f-4063-8394-489c246d6b7c" />
      - 表示された文字列全体がアクセストークンであるため、コピーして控えておく。

---

## 2. GAS（Google Apps Script）で Gmail を受信して LINE へ転送する

1. Google Chrome や Microsoft Edge などのブラウザで Google Drive を開く。
   <img width="1310" height="544" alt="image" src="https://github.com/user-attachments/assets/7a50b0d5-6fd7-4781-81a0-df937612958e" />
2. Drive上でスプレッドシートを作成する。
   <img width="1310" height="476" alt="image" src="https://github.com/user-attachments/assets/7faaf70f-b6b1-4b96-bec9-51c04f55f02f" />
   <img width="1310" height="572" alt="image" src="https://github.com/user-attachments/assets/d51e3c11-8d8d-41a1-bee8-fec741f3b075" />  
3. スプレッドシートを開き、ファイル名とシート名を変更する（ここではシート名を「サンプルシート」とする）。
   <img width="1310" height="513" alt="image" src="https://github.com/user-attachments/assets/79861391-4701-4e21-a99f-a8f7ed475975" />
4. セル A1 に「メールID」、B1 に「受信日時」、C1 に「メール本文」と入力する。
   <img width="1314" height="513" alt="image" src="https://github.com/user-attachments/assets/04371138-3f0c-47c9-b0e0-d1071d6bdaf2" />
5. メニューの「拡張機能」から「Apps Script」を選択する。
   <img width="1310" height="513" alt="image" src="https://github.com/user-attachments/assets/6f9b0cb5-89be-4e1d-92a7-e093b523a0ba" />
6. 「エディタ」から `コード.gs` を選択し、GAS で[Gmailを受信してLINEへ転送するサンプルコード](https://github.com/sfutami34/gmail2line/blob/main/sample.gs)をコピペする。
   
9. `accessToken` にアクセストークンを入力する。  
10. `sheetId` にスプレッドシートの ID を入力する。ID は以下のようなスプレッドシート URL の xxxxxxxxxx で示した箇所となります。  
   `https://docs.google.com/spreadsheets/d/xxxxxxxxxx/edit?`
11. 実行タイマーを設定する。サイドバーの時計マーク「トリガー」を選択する。  
12. 画面右下の「トリガーの追加」を選択し、以下の設定でトリガーを追加する（「保存」ボタンを押下する）。  
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
