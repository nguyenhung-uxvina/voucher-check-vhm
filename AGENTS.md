# AGENTS.md — Voucher-App Harness

> Bản đồ cho AI agent (Claude Code / Codex...) sửa repo này. Ngắn gọn, không bách khoa.
> Nguyên tắc: **Cơ chế, không phải prompt.** Bất biến bên dưới được cưỡng chế bằng
> `harness/verify.mjs` (exit code), không dựa vào việc anh "nhớ". Đọc trước mọi lần sửa.

## Repo là gì
Web tĩnh 1 file `index.html` (vanilla JS, không build) cho khách VHM tự kiểm tra điều
kiện Voucher + tra cứu Q&A. Backend duy nhất: `apps-script.gs` (Google Apps Script
`doPost` ghi lead vào Google Sheet). Deploy: GitHub Pages (domain `voucher.vinhomes.ai`).

## Bất biến tới hạn (VI PHẠM = build đỏ, KHÔNG deploy)
| ID | Bất biến | Vì sao |
|----|----------|--------|
| COMPLIANCE-01 | Disclaimer "không (có) liên kết Vinhomes/Vingroup" ≥ 3 chỗ (gate note, privacy panel, footer) | Pháp lý — cấm mạo nhận trang chính thức |
| COMPLIANCE-02 | Cụm "tham khảo không chính thức" phải còn | Pháp lý |
| LEAD-01 | `window.VHM.ENDPOINT` = URL Apps Script `/exec` hợp lệ, không rỗng | Mất lead trong im lặng = mất doanh thu |
| LEAD-02 | `log()` giữ `navigator.sendBeacon` | Gửi lead tin cậy khi rời trang |
| LEAD-03 | Funnel events `"truy cập"` + `"yêu cầu tư vấn"` còn nguyên | Phễu đo lường |
| PII-01 | Cổng chỉ thu đúng 3 field: `g-phone`, `g-macan`, `g-project` | Tối thiểu hóa PII |
| PII-02 | Privacy panel liệt kê đúng loại dữ liệu đang thu | Minh bạch PII |
| POLICY-NUM | Mốc số liệu 20% · 10% · 8% · 30% · 31/12 còn đủ (WARN) | Drift chính sách |

## Quy trình BẮT BUỘC trước khi kết thúc phiên / commit
```bash
node harness/verify.mjs        # phải PASS (exit 0). ERR => sửa, đừng commit.
```
Nếu anh **chạm mảng `kb`, `groups`, hoặc bất kỳ số liệu/nội dung chính sách nào**:
- Đối chiếu với `policy.lock.md` (nguồn chân lý). HTML phải khớp file đó.
- chạy thêm `node harness/eval-policy.mjs` — trọng tài LLM (Claude) xét đúng luật vs `policy.lock.md`. Cần `ANTHROPIC_API_KEY`; fail-closed nếu thiếu (đặt `HARNESS_SKIP_INFERENTIAL=1` để cố ý bỏ qua ở local).
- Con người (kỹ sư định danh) ký kết luận pháp lý cuối, không giao cho LLM.

## Improvement Engine — luật vàng
Mỗi lần agent làm hỏng một thứ mới → **KHÔNG nhắc bằng chat**. Thêm 1 assertion vào
mảng `CHECKS` trong `harness/verify.mjs` để lỗi đó bất khả lặp lại. Harness lớn dần
từng dòng theo lỗi quan sát được.

## Đừng làm
- Đừng đổi `ENDPOINT` khi refactor CSS/JS không liên quan.
- Đừng thêm field thu PII mới mà chưa cập nhật privacy panel + `policy.lock.md` + `verify.mjs`.
- Đừng viết lại câu trả lời Q&A theo trí nhớ — chỉ sửa theo `policy.lock.md`.
- Đừng commit thẳng `main` (dùng feature branch).

## Hạn chế đã biết (ngoài phạm vi harness này)
`ENDPOINT` lộ công khai trong HTML, Apps Script không xác thực → ai cũng POST spam
Sheet được. Đây là hạn chế kiến trúc static+Apps Script, harness KHÔNG che được.
Cần giải riêng (honeypot / shared-secret / chấp nhận rủi ro).
