# policy.lock.md — Nguồn chân lý Chính sách Voucher VHM

> **Vai trò trong harness:** đây là *authority*. Nội dung chính sách trong `index.html`
> (mảng `kb`, `groups`, tab "Cách dùng") PHẢI khớp file này. Inferential Gate (Bước 2,
> `harness/eval-policy.mjs`) so sánh ngữ nghĩa HTML ⇄ file này bằng LLM-as-judge.
>
> **Provenance:** trích trung thực từ `index.html` tại commit `e292e88` (2026-07). Đây là
> ảnh chụp nội dung ĐANG hiển thị, **chưa** được đối chiếu với công bố chính thức của CĐT.
> **Việc của con người (Core):** kỹ sư/tư vấn định danh phải rà file này với chính sách gốc
> VHM và ký xác nhận. Khi file này lệch chính sách gốc → sửa file này TRƯỚC, rồi mới sửa HTML.

## 1. Giá trị Voucher theo nhóm dự án
- **Nhóm 1 — 10%** giá trị BĐS: VHM Ocean Park 2-3 (thấp tầng, trừ Vịnh Xanh); VHM Vũ Yên
  (thấp tầng); Dương Kinh; TMDV & shop chân đế NĐX (Cổ Loa, OCP1, OCP2-3, Smart City);
  VW Phú Quốc; GW Phú Quốc; Quảng Trị; Bắc Luân.
- **Nhóm 2 — 8%** giá trị BĐS: VHM Cần Giờ (thấp tầng); VHM Quận 9 (thấp tầng & TMDV);
  VHM Đan Phượng (thấp tầng); Hậu Nghĩa.
- Dự án ngoài 2 nhóm trên: **không** thuộc diện tặng Voucher.
- Giá trị tính theo **giá HĐMB/HĐCN khách lẻ đầu tiên**, **không gồm VAT & KPBT**. Khách lẻ
  chuyển nhượng vẫn tính theo giá HĐMB/HĐCN, không theo giá chuyển nhượng. Căn giãn xây: chỉ
  tính theo **Giá trị Đất và Thương mại**.

## 2. Điều kiện được tặng (mốc số liệu — bất biến POLICY-NUM)
- Ký HĐMB/HĐCN **trước 20/06/2026** VÀ đóng tối thiểu **20%** trước 20/06/2026.
- Không vi phạm nghĩa vụ tài chính (chậm do lỗi KH → mất điều kiện; do lỗi bên khác →
  trình duyệt theo trường hợp khách quan).
- Diện ký quỹ / chưa giải chấp: vẫn được NẾU ký đúng hạn CĐT thông báo VÀ đóng ≥20% tại
  thời điểm ký (Voucher phát sau 15/7 nhưng vẫn dùng trước 31/12/2026).
- Voucher phát mốc **15/7**; mỗi BĐS được **1 Voucher**.

## 3. Quy định sử dụng
- Dùng thanh toán mua BĐS Vinhomes mở bán **01/01/2026 → 31/12/2026** (trừ chung cư, slot
  đỗ xe, NOXH).
- Áp tối đa **≤ 30%** giá trị HĐMB/HĐCN của 1 BĐS mua mới. Mỗi BĐS mua mới dùng 1 Voucher;
  phần dư dùng tiếp cho BĐS khác.
- Xử lý dư/thừa: căn **mua mới** (từ 20/6) → hoàn **tiền mặt** hoặc trừ đợt sau; áp vào căn
  **đã mua** (backdate) → hoàn **VPoint**, không hoàn tiền.
- Đối tượng dùng **đích danh**: bản thân / vợ-chồng, tứ thân phụ mẫu, con cái, anh chị em
  ruột của 2 vợ chồng.
- BĐS mua mới thanh toán bằng Voucher: hạn chế chuyển nhượng **3 tháng**.
- Backdate (mua 01/01–20/06/2026, nhiều căn): áp VC vào căn đã mua chặn ≤30%, dư hoàn VPoint,
  căn đã áp không nhận VC nữa; VC căn khác vẫn dùng mua căn mới.

## 4. Bộ Q&A tình huống (câu 20–34) — bản khóa
Mỗi câu: **num · tag** (yes/no/cond/cases/info) · câu hỏi → trả lời chuẩn.

- **20 · cond** — KH1 nhận VC (15/7) rồi chuyển nhượng cho KH2: VC thuộc KH1 (chủ sở hữu tại
  thời điểm nhận); **không** chuyển nhượng VC cho KH2.
- **21 · cases** — KH A mua trước 20/06, ≥20%, đã chuyển cho KH B trước khi phát VC: TH1 KH B đã
  ký HĐMB/HĐCN + được CĐT XNCN trước khi phát → KH B nhận; TH2 chưa ký/chưa XNCN → KH A nhận.
- **22 · cases** — Căn đã có sổ, chuyển nhượng trước khi nhận VC: TH1 sổ đã sang tên KH B → KH B
  nhận; TH2 chưa sang tên → KH A nhận. Nhận VC do dữ liệu chưa cập nhật mà không đủ điều kiện thì
  KH và người thân không được dùng.
- **23 · no** — Vay NH, đủ 20% trước 20/06, 15/7 NH chậm giải ngân do lỗi KH, đóng lãi chậm: vẫn
  coi là vi phạm nghĩa vụ tài chính → không đạt; lỗi bên khác → trình duyệt theo trường hợp.
- **24 · no** — Ký HĐMB trước 20/06 nhưng chính sách chỉ đóng 15%, chưa đến hạn đợt sau: **không**
  áp dụng — phải đủ 20% + ký trước 20/06.
- **25 · yes** — Đủ 20% trước 20/6 nhưng chưa ký kịp trước 15/7 do ký quỹ/chưa giải chấp: vẫn được
  nếu (i) ký đúng hạn CĐT và (ii) đóng ≥20% khi ký; phát sau 15/7 nhưng dùng trước 31/12/26.
- **26 · no** — Căn ký quỹ mới thu 10%: **không** — phải đủ 20% trước 20/06 + ký đúng hạn.
- **27 · yes** — Người nước ngoài ký HĐ thuê dài hạn (HĐT): được, xác định như HĐMB.
- **28 · no** — Được tặng VC rồi hủy chính HĐMB căn được tặng: **có thu hồi** VC theo HĐMB.
- **29 · info** — Căn ký sau 20/6: VC quy đổi; sau khi áp VC mà thừa → hoàn **tiền mặt** hoặc trừ đợt sau.
- **30 · info** — Mua qua nhận chuyển nhượng TTĐC (không mua trực tiếp CĐT): VC áp cho khách hàng
  cuối khi vào HĐMB/HĐCN; vi phạm hạn đóng/ký khi chuyển nhượng → thu hồi căn, phạt cọc.
- **31 · yes** — VPoint (VinClub): dùng như phương thức thanh toán giảm giá trị phải trả → được dùng
  cho KPBT và Giá trị xây dựng còn chưa thanh toán theo quy định VinClub.
- **32 · cond** — KH cá nhân dùng VC mua BĐS đứng tên DN: chỉ được nếu DN 1 chủ sở hữu chính là cá
  nhân được tặng VC (TNHH MTV, DNTN 1 thành viên).
- **33 · no** — Dùng VC mua căn ngay từ giai đoạn cọc: **không** — phải cọc đúng chính sách + ký TTĐC
  rồi mới áp VC.
- **34 · no** — Căn đã dùng VC (tặng từ căn trước) khi hủy/thanh lý: phạt theo HĐMB, tối đa **30%**
  tổng giá trị BĐS, không phụ thuộc thanh toán bằng VC hay tiền mặt/vay.

## 5. Disclaimer bắt buộc (cưỡng chế bởi COMPLIANCE-01/02)
Trang là công cụ **tham khảo không chính thức**, **KHÔNG liên kết** Vinhomes/Vingroup, do đơn vị
tư vấn tổng hợp, không thay thế thông báo chính thức của CĐT. Thông tin chính thức căn cứ công bố
CĐT và điều khoản HĐMB.
