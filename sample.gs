var target_addr = "atg119@city.atsugi.kanagawa.jp";
var get_interval = 30; //●分前～現在の新着メールを取得 #--トリガーの時間間隔をこれに合わせる
var msgMaxCount = 20; // 直前の受信20件のみ処理  
//　LINEアクセストークン
var accessToken = "LINE Messaging APIへのアクセストークンを入力";
var sheetId = "スプレッドシートのIDを入力する";
var sheet_mail_list = "サンプルシート";

function main() {
  //取得間隔
  var now_time= Math.floor(new Date().getTime() / 1000) ;//現在時刻を変換
  var time_term = now_time - ((60 * get_interval) + 3); //秒にして+3秒しておく

  //検索条件指定
  const strTerms = '(after:'+ time_term + ')';

  //取得
  var myThreads = GmailApp.search(strTerms);
  var myMsgs = GmailApp.getMessagesForThreads(myThreads);
  var msgCount = myMsgs.length;
  if(msgCount > msgMaxCount){
      msgCount = msgMaxCount;
  }
  for(var i = 0; i < msgCount;i++){
    var str_from = myMsgs[i].slice(-1)[0].getFrom();
    var str_subject = myMsgs[i].slice(-1)[0].getSubject();
    var str_message = myMsgs[i].slice(-1)[0].getPlainBody();
    var str_id = myMsgs[i].slice(-1)[0].getId();
    
    // シートに同じメールがある場合は処理終わり
    if(isExistMailInSheet(str_id)){
      continue;
    }

    if(str_from.indexOf(target_addr) >= 0)
    {
      // LINEへ転送する場合の処理
      var valMsg = "";
      var date = (myMsgs[i].slice(-1)[0].getDate().getMonth()+1).toString() + "/" + myMsgs[i].slice(-1)[0].getDate().getDate().toString();
      var hour = myMsgs[i].slice(-1)[0].getDate().getHours().toString();
      var minute = myMsgs[i].slice(-1)[0].getDate().getMinutes().toString();
      if( minute.length < 2){
        minute = "0" + minute;  
      }

      valMsg = "[日時] " + date + " " + hour + ":" + minute
        + "\n\n[件名]\n" + str_subject
        + "\n\n[内容]\n" + str_message;
      const response = LINEMessagingApiPush(valMsg); 
      writeMailInSheet(myMsgs[i].slice(-1)[0]);
    }
  }
}

// シートにメールが存在するか
function isExistMailInSheet(mailId){
  const sqlTarget = SpreadSheetsSQL.open(sheetId, sheet_mail_list);
  const data = sqlTarget.select(["メールID"]).filter('メールID = ' + mailId).result();

  if(data.length >= 1){
    return true;
  }
  
  return false;
}

// シートにデータの書き込み
function writeMailInSheet(mail){
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet(); 
  const sheet = spreadSheet.getSheetByName(sheet_mail_list); 
  sheet.insertRowAfter(1); //空行の差し込み

  sheet.getRange("A2").setValue(mail.getId()); //メールID
  sheet.getRange("B2").setValue(mail.getDate()); //受信日時
  sheet.getRange("C2").setValue(mail.getPlainBody()); //メール本文
}

//LINE通知
function LINEMessagingApiPush(text) {
  const url = "https://api.line.me/v2/bot/message/broadcast";
  const headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + accessToken,
  };

  const postData = {
    "messages" : [
      {
        'type':'text',
        'text':text,
      }
    ]
  };

  const options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
  };

  return UrlFetchApp.fetch(url, options);
}
