/**
 * Google Apps Script — access logger for the Voucher app.
 * Appends one row per access (phone, mã căn, timestamp, user-agent) to a Google Sheet.
 *
 * SETUP (see README.md for the full walk-through):
 *   1. Create a Google Sheet. In the first row add headers:
 *        A1: Received  B1: Số điện thoại  C1: Mã căn  D1: Client time  E1: User agent  F1: Referrer  G1: Dự án  H1: Sự kiện  I1: Chi tiết
 *      (Sự kiện = truy cập / kết quả / yêu cầu tư vấn — dùng cho phễu đo lường & thu lead.)
 *   2. Extensions → Apps Script. Delete any sample code, paste this file.
 *   3. Deploy → New deployment → type "Web app".
 *        Execute as: Me      Who has access: Anyone
 *   4. Copy the Web app URL (ends with /exec) and paste it into index.html → LOG_ENDPOINT.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var p = (e && e.parameter) || {};
    sheet.appendRow([
      new Date(),        // server received time
      p.phone || "",
      p.macan || "",
      p.ts || "",        // client ISO time
      p.ua || "",
      p.ref || "",
      p.project || "",   // G: Dự án
      p.event || "",     // H: Sự kiện (truy cập / kết quả / yêu cầu tư vấn)
      p.detail || ""     // I: Chi tiết
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Optional: lets you open the /exec URL in a browser to confirm it's live.
function doGet() {
  return ContentService.createTextOutput("Voucher access logger is running.");
}
