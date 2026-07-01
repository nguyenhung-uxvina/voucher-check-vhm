#!/usr/bin/env node
/**
 * COMPUTATIONAL SENSOR — verify.mjs
 * =================================
 * Rào tất định (deterministic Gate) cho voucher-app.
 * Quét index.html bằng regex/string thuần — KHÔNG cần trình duyệt, KHÔNG dependency.
 *
 * Triết lý: "Cơ chế, không phải prompt." Mọi bất biến compliance / lead-logging
 * được cưỡng chế ở đây bằng exit code, không dựa vào việc agent "nhớ tuân thủ".
 *
 * Mỗi lỗi agent gây ra trong tương lai => thêm 1 assertion vào mảng CHECKS bên dưới
 * (Improvement Engine — Hashimoto). Đừng nhắc bằng chat; hãy bất tử hóa bằng test.
 *
 * Dùng:   node harness/verify.mjs
 * Exit:   0 = PASS (có thể còn WARN)   |   1 = có ERR => chặn deploy
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HTML = readFileSync(join(ROOT, "index.html"), "utf8");

// Đếm số lần khớp 1 regex toàn cục
const count = (re) => (HTML.match(re) || []).length;

/**
 * Mỗi check: { id, level: "ERR"|"WARN", desc, pass: boolean, hint }
 * ERR  => build đỏ, exit 1 (bất biến tới hạn: pháp lý, PII, lead pipeline).
 * WARN => nhắc chạy Inferential Gate (eval-policy.mjs, Bước 2) — không chặn.
 */
const CHECKS = [
  {
    id: "COMPLIANCE-01",
    level: "ERR",
    desc: 'Disclaimer "không (có) liên kết" phải xuất hiện >= 3 lần (gate note, privacy panel, footer).',
    pass: count(/kh(ô|Ô)ng\s+(c(ó|Ó)\s+)?li(ê|Ê)n\s+k(ế|Ế)t/gi) >= 3,
    hint: "Ai đó đã xóa/đổi 1 trong 3 bản disclaimer không-liên-kết Vinhomes/Vingroup. Khôi phục.",
  },
  {
    id: "COMPLIANCE-02",
    level: "ERR",
    desc: 'Cụm "tham khảo không chính thức" phải còn (bản chất trang là tra cứu tham khảo).',
    pass: /tham kh(ả|Ả)o kh(ô|Ô)ng ch(í|Í)nh th(ứ|Ứ)c/i.test(HTML),
    hint: "Mất tuyên bố 'tham khảo không chính thức' — rủi ro mạo nhận trang chính thức.",
  },
  {
    id: "LEAD-01",
    level: "ERR",
    desc: "window.VHM.ENDPOINT phải là URL Apps Script /exec hợp lệ, không rỗng.",
    pass: /ENDPOINT:\s*"https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec"/.test(HTML),
    hint: "ENDPOINT bị rỗng/đổi/hỏng => lead ngừng chảy về Google Sheet trong im lặng.",
  },
  {
    id: "LEAD-02",
    level: "ERR",
    desc: "log() phải dùng navigator.sendBeacon (cơ chế gửi lead tin cậy khi rời trang).",
    pass: /navigator\.sendBeacon/.test(HTML),
    hint: "Mất sendBeacon => lead gửi lúc unload dễ rớt.",
  },
  {
    id: "LEAD-03",
    level: "ERR",
    desc: 'Funnel events bắt buộc còn: log("truy cập") và \'yêu cầu tư vấn\'.',
    pass: /log\(\s*["']truy c(ậ|Ậ)p/.test(HTML) && /["']y(ê|Ê)u c(ầ|Ầ)u t(ư|Ư) v(ấ|Ấ)n["']/.test(HTML),
    hint: "Thiếu event => phễu đo lường (vào gate / xin tư vấn) bị thủng.",
  },
  {
    id: "PII-01",
    level: "ERR",
    desc: "Cổng chỉ được thu đúng 3 field PII: g-phone, g-macan, g-project.",
    pass: count(/<input id="g-/g) === 3,
    hint: "Số field PII ở gate != 3. Thêm field mới PHẢI cập nhật privacy panel + policy.lock.md trước.",
  },
  {
    id: "PII-02",
    level: "ERR",
    desc: "Privacy panel phải liệt kê đúng loại dữ liệu thu thập (số điện thoại, mã căn, tên dự án).",
    pass: /s(ố|Ố) đi(ệ|Ệ)n tho(ạ|Ạ)i, m(ã|Ã) c(ă|Ă)n, t(ê|Ê)n d(ự|Ự) (á|Á)n/i.test(HTML),
    hint: "Panel bảo mật không còn khớp danh mục PII đang thu — rủi ro minh bạch/PII.",
  },
  // ---- WARN: drift số liệu chính sách => buộc chạy Inferential Gate (Bước 2) ----
  {
    id: "POLICY-NUM",
    level: "WARN",
    desc: "Các mốc số liệu chính sách còn đủ mặt (20% · 10% · 8% · 30% · 31/12).",
    pass: ["20%", "10%", "8%", "30%", "31/12"].every((s) => HTML.includes(s)),
    hint: "Một mốc số liệu biến mất/đổi. Chạy `node harness/eval-policy.mjs` (Bước 2) để trọng tài LLM xét đúng chính sách vs policy.lock.md.",
  },
];

// ---- chạy ----
let errs = 0,
  warns = 0;
console.log("── voucher-app · Computational Sensor ──");
for (const c of CHECKS) {
  if (c.pass) {
    console.log(`  ✓ ${c.id.padEnd(13)} ${c.desc}`);
  } else if (c.level === "ERR") {
    errs++;
    console.error(`  ✗ ${c.id.padEnd(13)} [ERR] ${c.desc}\n      → ${c.hint}`);
  } else {
    warns++;
    console.warn(`  ! ${c.id.padEnd(13)} [WARN] ${c.desc}\n      → ${c.hint}`);
  }
}
console.log(`── ${CHECKS.length} checks · ${errs} ERR · ${warns} WARN ──`);

if (errs > 0) {
  console.error(`\nHARNESS FAIL: ${errs} bất biến tới hạn bị vi phạm. Sửa trước khi commit/deploy.`);
  process.exit(1);
}
if (warns > 0) {
  console.warn("\nHARNESS PASS (có WARN): nếu đã chạm nội dung chính sách, chạy eval-policy.mjs.");
}
console.log("\nHARNESS PASS.");
process.exit(0);
