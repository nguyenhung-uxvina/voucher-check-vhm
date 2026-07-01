# Voucher App — Kiểm tra & Tra cứu Voucher VHM

Công cụ 1 file (`index.html`) cho khách hàng: **wizard kiểm tra điều kiện Voucher** + **tra cứu Q&A (câu 20–34)**.
Có **cổng truy cập mềm**: khách phải nhập **số điện thoại + mã căn** trước khi vào; thông tin được ghi vào Google Sheet.

> ⚠️ Đây là app tĩnh chạy hoàn toàn trong trình duyệt. Cổng truy cập mang tính **xác nhận/thu thập thông tin**, không phải bảo mật tuyệt đối (người rành kỹ thuật vẫn có thể xem mã nguồn). Nếu cần kiểm soát truy cập thật (đối chiếu CSDL khách hàng, chống bypass) thì phải làm backend.

---

## Bước 1 — Tạo nơi lưu thông tin truy cập (Google Sheet + Apps Script)

1. Tạo một **Google Sheet** mới. Dòng đầu (tùy chọn) đặt tiêu đề cột:
   `Received | Số điện thoại | Mã căn | Client time | User agent | Referrer | Dự án | Sự kiện | Chi tiết`
   > Cột **Sự kiện** ghi phễu đo lường: `truy cập` → `kết quả` → `yêu cầu tư vấn` (lead). Cột **Chi tiết** ghi kết quả wizard tương ứng.
2. Trong Sheet: **Extensions → Apps Script**. Xóa code mẫu, dán toàn bộ nội dung file **`apps-script.gs`**.
3. Bấm **Deploy → New deployment**. Chọn loại **Web app**:
   - **Execute as:** Me
   - **Who has access:** **Anyone**
4. **Authorize** khi được hỏi (chọn tài khoản Google của bạn → Advanced → Allow).
5. Copy **Web app URL** (kết thúc bằng `/exec`).
6. Mở **`index.html`**, tìm dòng:
   ```js
   var LOG_ENDPOINT = "";
   ```
   Dán URL vào giữa hai dấu ngoặc kép:
   ```js
   var LOG_ENDPOINT = "https://script.google.com/macros/s/AKfy.../exec";
   ```

> Để trống `LOG_ENDPOINT` thì cổng vẫn hoạt động nhưng **không ghi log** (chỉ in ra console). Hữu ích khi test.

**Kiểm tra nhanh:** mở URL `/exec` trên trình duyệt — thấy dòng *"Voucher access logger is running."* là đạt.

---

## Bước 2 — Đưa app lên mạng (chọn 1 trong 3, đều miễn phí)

Chỉ cần đăng file **`index.html`** (không cần `apps-script.gs` / `README.md`).

### Cách A — Netlify Drop (nhanh nhất, không cần tài khoản kỹ thuật)
1. Vào **https://app.netlify.com/drop**
2. Kéo–thả **cả thư mục `voucher-app`** (hoặc riêng `index.html`) vào ô.
3. Netlify tạo ngay một URL công khai (vd `https://ten-ngau-nhien.netlify.app`) — chia sẻ link đó.
4. Muốn đổi tên miền đẹp hơn: Site settings → Change site name.

### Cách B — Cloudflare Pages
1. Vào **https://pages.cloudflare.com** → Create a project → **Direct Upload**.
2. Upload `index.html`. Nhận URL `*.pages.dev`.

### Cách C — GitHub Pages
1. Tạo repo mới, thêm file `index.html`.
2. Repo → **Settings → Pages** → Source: `main` / root → Save.
3. Vài phút sau có URL `https://<user>.github.io/<repo>/`.

---

## Xem ai đã truy cập
Mở Google Sheet — mỗi lượt vào là một dòng: thời gian, số điện thoại, mã căn.

> Cổng ghi nhớ trên **từng thiết bị/trình duyệt** (localStorage): khách đã nhập một lần thì lần sau vào thẳng, không hỏi lại (và không tạo dòng log trùng). Muốn xóa để nhập lại: xóa dữ liệu trang trong trình duyệt, hoặc mở tab ẩn danh.

## Tùy chỉnh thường gặp
- **Quy tắc số điện thoại:** hàm `validPhone` trong `index.html` đang nhận SĐT di động VN 10 số bắt đầu bằng `0` (chấp nhận cả `+84`).
- **Bắt buộc định dạng mã căn:** sửa hàm `validMacan` (hiện chỉ yêu cầu ≥ 2 ký tự).
- **Tắt ghi nhớ thiết bị:** xóa đoạn `localStorage.getItem(STORAGE_KEY)` (khối "Returning device").
