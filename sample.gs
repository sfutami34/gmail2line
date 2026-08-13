// ============================================
// Gmail2LINE 設定値
// ============================================
// 対象となるメール送信者のアドレス
var target_addr = "xxx@xxx.xx";

// 何分前から現在までの新着メールを取得するか（トリガーの時間間隔に合わせる）
var get_interval = 30;

// 一度に処理するメールの最大件数
var msgMaxCount = 20;

// LINE Messaging APIのアクセストークン
var accessToken = "LINE Messaging APIへのアクセストークンを入力";

// データを保存するGoogleスプレッドシートのID
var sheetId = "スプレッドシートのIDを入力する";

// メール情報を記録するシート名
var sheet_mail_list = "サンプルシート";


/**
 * メイン処理
 * 入力: なし
 * 出力: なし
 * 処理内容:
 *   1. 指定された時間範囲内の新着メールをGmailから検索
 *   2. メール件数が上限を超えていれば制限
 *   3. 各メールについて以下を実行:
 *      - シートに記録済みか確認（重複排除）
 *      - 送信者が対象アドレスか確認
 *      - LINEへメール内容を転送
 *      - シートにメール情報を記録
 */
function main() {
  // 現在時刻をUnixタイムスタンプ(秒)に変換
  var now_time = Math.floor(new Date().getTime() / 1000);
  
  // 指定分前の時刻を計算（+3秒のバッファ付き）
  var time_term = now_time - ((60 * get_interval) + 3);

  // Gmail検索クエリ：指定時刻以降のメールを対象
  const strTerms = '(after:' + time_term + ')';

  // 検索条件に合致するメールスレッドを取得
  var myThreads = GmailApp.search(strTerms);
  
  // スレッドから全メッセージを取得（2次元配列）
  var myMsgs = GmailApp.getMessagesForThreads(myThreads);
  
  // 取得メール件数（上限を超えた場合は制限）
  var msgCount = myMsgs.length;
  if (msgCount > msgMaxCount) {
    msgCount = msgMaxCount;
  }

  // 各メールを処理
  for (var i = 0; i < msgCount; i++) {
    // 各スレッドの最新メッセージ（slice(-1)[0]）を取得
    var str_from = myMsgs[i].slice(-1)[0].getFrom();
    var str_subject = myMsgs[i].slice(-1)[0].getSubject();
    var str_message = myMsgs[i].slice(-1)[0].getPlainBody();
    var str_id = myMsgs[i].slice(-1)[0].getId();
    
    // シートに同じメールが既に記録されているか確認
    if (isExistMailInSheet(str_id)) {
      // 既に処理済みのメールはスキップ
      continue;
    }

    // 送信者が対象アドレスに含まれているか確認
    if (str_from.indexOf(target_addr) >= 0) {
      // LINEへ転送するメッセージを組立
      var valMsg = "";
      
      // メール受信日時をMM/DD形式で取得
      var date = (myMsgs[i].slice(-1)[0].getDate().getMonth() + 1).toString() 
        + "/" + myMsgs[i].slice(-1)[0].getDate().getDate().toString();
      
      // 受信時刻を取得
      var hour = myMsgs[i].slice(-1)[0].getDate().getHours().toString();
      var minute = myMsgs[i].slice(-1)[0].getDate().getMinutes().toString();
      
      // 分が1桁の場合は先頭に0を付加（例：05、09）
      if (minute.length < 2) {
        minute = "0" + minute;
      }

      // LINE送信用メッセージを整形（日時、件名、本文）
      valMsg = "[日時] " + date + " " + hour + ":" + minute
        + "\n\n[件名]\n" + str_subject
        + "\n\n[内容]\n" + str_message;
      
      // LINE Messaging APIへメッセージを送信
      const response = LINEMessagingApiPush(valMsg);
      
      // 処理済みメール情報をシートに記録
      writeMailInSheet(myMsgs[i].slice(-1)[0]);
    }
  }
}


/**
 * シートにメールが存在するかどうかを確認
 * 入力: mailId (string) - 確認するメールのID
 * 出力: boolean - true: 存在する / false: 存在しない
 * 処理内容:
 *   1. SpreadSheetsSQLを使用してシートを開く
 *   2. メールIDで検索
 *   3. 検索結果が1件以上あれば存在と判定
 */
function isExistMailInSheet(mailId) {
  // SpreadSheetsSQLでシートをクエリ対象として開く
  const sqlTarget = SpreadSheetsSQL.open(sheetId, sheet_mail_list);
  
  // 「メールID」列からメールIDを検索
  const data = sqlTarget.select(["メールID"]).filter('メールID = ' + mailId).result();

  // 1件以上の結果が見つかれば既存と判定
  if (data.length >= 1) {
    return true;
  }
  
  // 見つからなければ未処理と判定
  return false;
}


/**
 * メール情報をスプレッドシートに新規行として書き込む
 * 入力: mail (GmailMessage) - Google Apps Scriptの GmailMessage オブジェクト
 * 出力: なし
 * 処理内容:
 *   1. アクティブなスプレッドシートを取得
 *   2. 指定シートの2行目に新規行を挿入
 *   3. メールID、受信日時、メール本文を各セルに記入
 */
function writeMailInSheet(mail) {
  // アクティブなスプレッドシートを取得
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // 指定名のシートを取得
  const sheet = spreadSheet.getSheetByName(sheet_mail_list);
  
  // 2行目の後に新規行を挿入（既存行をシフト）
  sheet.insertRowAfter(1);

  // A2セル：メールの一意識別子（ID）を記入
  sheet.getRange("A2").setValue(mail.getId());
  
  // B2セル：メール受信日時を記入
  sheet.getRange("B2").setValue(mail.getDate());
  
  // C2セル：メール本文（プレーンテキスト）を記入
  sheet.getRange("C2").setValue(mail.getPlainBody());
}


/**
 * LINE Messaging APIを使用してテキストメッセージをブロードキャスト送信
 * 入力: text (string) - LINE送信するテキストメッセージ
 * 出力: HTTPResponse - LINE APIからのレスポンスオブジェクト
 * 処理内容:
 *   1. LINE APIのエンドポイント（ブロードキャストAPI）を指定
 *   2. 認証ヘッダーとコンテンツタイプを設定
 *   3. テキスト型メッセージのペイロードを作成
 *   4. POST要求としてLINE APIに送信
 */
function LINEMessagingApiPush(text) {
  // LINE Messaging API ブロードキャストエンドポイント
  const url = "https://api.line.me/v2/bot/message/broadcast";
  
  // リクエストヘッダーを設定
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + accessToken,  // アクセストークンで認証
  };

  // LINE APIに送信するペイロード（JSON）
  const postData = {
    "messages": [
      {
        'type': 'text',  // メッセージタイプ
        'text': text,     // 送信するテキスト内容
      }
    ]
  };

  // HTTP POSTリクエストのオプションを設定
  const options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData)  // ペイロードをJSON文字列に変換
  };

  // LINE APIへリクエストを送信
  return UrlFetchApp.fetch(url, options);
}
