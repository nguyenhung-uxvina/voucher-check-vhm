#!/usr/bin/env node
/**
 * INFERENTIAL GATE — eval-policy.mjs
 * =================================
 * LLM-as-judge (Claude Opus 4.8) for what a linter CANNOT check:
 * "Does the policy content in index.html still match the ground truth in
 *  policy.lock.md, or did an edit introduce a legally-misleading claim?"
 *
 * Computational Sensor (verify.mjs) checks tất định facts (disclaimer present,
 * endpoint intact). This checks NGỮ NGHĨA — the meaning of the Q&A and numbers.
 * Only runs when policy content changed (see .github/workflows/harness.yml).
 *
 * Con người tại điểm đòn bẩy cao: LLM thu hẹp không gian; kỹ sư/tư vấn định danh
 * ký kết luận pháp lý cuối. This gate flags — it does not sign off.
 *
 * Env:
 *   ANTHROPIC_API_KEY        required (GitHub secret in CI)
 *   HARNESS_MODEL            optional, default claude-opus-4-8
 *   HARNESS_SKIP_INFERENTIAL =1 to intentionally skip (local dev without key)
 *
 * Dùng:  node harness/eval-policy.mjs
 * Exit:  0 = PASS  |  1 = policy violation OR cannot run (fail-closed)
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HTML = readFileSync(join(ROOT, "index.html"), "utf8");
const LOCK = readFileSync(join(ROOT, "policy.lock.md"), "utf8");

const MODEL = process.env.HARNESS_MODEL || "claude-opus-4-8";
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (process.env.HARNESS_SKIP_INFERENTIAL === "1") {
  console.warn("⏭  eval-policy SKIPPED (HARNESS_SKIP_INFERENTIAL=1). Không xét ngữ nghĩa chính sách lần này.");
  process.exit(0);
}
if (!API_KEY) {
  // Fail-closed: đây là cổng pháp lý. Không có key = không xét được = không cho qua.
  console.error("✗ ERR-CONFIG: thiếu ANTHROPIC_API_KEY. Inferential Gate không chạy được.");
  console.error("  CI: thêm secret ANTHROPIC_API_KEY.  Local: đặt biến môi trường, hoặc HARNESS_SKIP_INFERENTIAL=1 nếu cố ý bỏ qua.");
  process.exit(1);
}

// JSON Schema cho phán quyết của trọng tài — structured output, khỏi parse tay
const VERDICT_SCHEMA = {
  type: "object",
  properties: {
    pass: { type: "boolean", description: "true nếu nội dung HTML khớp policy.lock.md, không có sai lệch gây hiểu lầm pháp lý" },
    violations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          location: { type: "string", description: "Câu Q&A số mấy / tab nào / số liệu nào trong index.html" },
          severity: { type: "string", enum: ["legal", "factual", "minor"] },
          issue: { type: "string", description: "Sai lệch cụ thể so với policy.lock.md" },
        },
        required: ["location", "severity", "issue"],
        additionalProperties: false,
      },
    },
  },
  required: ["pass", "violations"],
  additionalProperties: false,
};

const SYSTEM =
  "Bạn là trọng tài rà soát tính đúng của nội dung chính sách voucher bất động sản trong một web app tĩnh. " +
  "Bạn được cho: (A) NGUỒN CHÂN LÝ (policy.lock.md) và (B) mã HTML đang hiển thị cho khách. " +
  "Nhiệm vụ: đối chiếu mọi tuyên bố chính sách trong HTML (mảng kb câu 20–34, tab Cách dùng, số liệu 20%/10%/8%/30%/31-12-26, quy tắc chuyển nhượng, disclaimer) với NGUỒN CHÂN LÝ. " +
  "Chỉ báo violation khi HTML MÂU THUẪN hoặc BỎ SÓT gây hiểu lầm so với nguồn — KHÔNG bắt lỗi cách diễn đạt khác nếu nghĩa vẫn đúng. " +
  "severity=legal nếu sai có thể gây rủi ro pháp lý cho người mua BĐS; factual nếu sai số liệu/điều kiện; minor nếu lệch nhẹ không đổi nghĩa. " +
  "Nếu tất cả khớp, trả pass=true, violations=[].";

const USER =
  "=== NGUỒN CHÂN LÝ (policy.lock.md) ===\n" + LOCK +
  "\n\n=== HTML ĐANG HIỂN THỊ (index.html) ===\n" + HTML +
  "\n\nRà soát và trả JSON theo schema.";

console.log(`── voucher-app · Inferential Gate (${MODEL}) ──`);

const resp = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({
    model: MODEL,
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    system: SYSTEM,
    output_config: { format: { type: "json_schema", schema: VERDICT_SCHEMA } },
    messages: [{ role: "user", content: USER }],
  }),
});

if (!resp.ok) {
  const body = await resp.text().catch(() => "");
  console.error(`✗ ERR-API: HTTP ${resp.status} khi gọi Anthropic API.\n${body.slice(0, 800)}`);
  process.exit(1); // fail-closed
}

const data = await resp.json();
if (data.stop_reason === "refusal") {
  console.error("✗ ERR-REFUSAL: model từ chối. Không có phán quyết → fail-closed.");
  process.exit(1);
}
const textBlock = (data.content || []).find((b) => b.type === "text");
if (!textBlock) {
  console.error("✗ ERR-PARSE: không có text block trong phản hồi → fail-closed.");
  process.exit(1);
}

let verdict;
try {
  verdict = JSON.parse(textBlock.text);
} catch {
  console.error("✗ ERR-PARSE: phản hồi không phải JSON hợp lệ → fail-closed.\n" + textBlock.text.slice(0, 800));
  process.exit(1);
}

const violations = verdict.violations || [];
if (verdict.pass && violations.length === 0) {
  console.log("  ✓ Nội dung chính sách khớp policy.lock.md. Không phát hiện sai lệch.");
  console.log("\nINFERENTIAL GATE PASS.");
  process.exit(0);
}

console.error(`  ✗ Phát hiện ${violations.length} sai lệch:`);
for (const v of violations) {
  console.error(`    [${(v.severity || "?").toUpperCase()}] ${v.location}\n        → ${v.issue}`);
}
console.error("\nINFERENTIAL GATE FAIL: nội dung chính sách lệch nguồn chân lý. Kỹ sư/tư vấn định danh phải rà & sửa trước khi deploy.");
process.exit(1);
