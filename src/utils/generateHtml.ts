import type { Block } from "../types/basetypes";

export const generateHTML = (blocks: Block[]) => {
  const blocksHTML = blocks
    .map(
      (block, index) => `
    <div class="block">
      <div class="block-header">
        <span class="block-number">#${index + 1}</span>
        <div class="divider"></div>
      </div>

      ${
        block.type === "table" && block.tableData
          ? `
        <div class="table-wrapper">
          <table>
            <tbody>
              ${block.tableData
                .map(
                  (row, ri) => `
                <tr class="${ri === 0 ? "header-row" : ""}">
                  ${row
                    .map((cell) =>
                      ri === 0
                        ? `<th>${escapeHTML(cell.content)}</th>`
                        : `<td>${escapeHTML(cell.content)}</td>`,
                    )
                    .join("")}
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
          : ""
      }

      ${
        block.type !== "table" && block.description
          ? `
        <p dir="${block.isRtL ? "rtl" : "ltr"}" class="description">${block.description}</p>
      `
          : ""
      }

      ${
        block.type !== "table" && block.code
          ? `
        <div class="code-wrapper">
          <div class="code-header">
            <span class="lang">${block.lang}</span>
            <div class="dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
          </div>
          <pre><code dir="ltr">${escapeHTML(block.code)}</code></pre>
        </div>
      `
          : ""
      }
    </div>
  `,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fa">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Doc Builder Export</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: #09090b;
      color: #e4e4e7;
      font-family: sans-serif;
      padding: 2rem;
    }

    .block {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 2rem;
    }

    .block-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .block-number {
      font-size: 0.75rem;
      color: #71717a;
      background: #27272a;
      border: 1px solid #3f3f46;
      border-radius: 999px;
      padding: 2px 8px;
    }

    .divider {
      flex: 1;
      height: 1px;
      background: #27272a;
    }

    .description {
      font-size: 0.875rem;
      color: #d4d4d8;
      line-height: 1.6;
      padding: 0 4px;
    }

    /* ── Table ── */
    .table-wrapper {
      overflow-x: auto;
      border: 1px solid #3f3f46;
      border-radius: 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      color: #d4d4d8;
    }

    tr.header-row {
      background: #27272a;
    }

    tr:not(.header-row):nth-child(even) {
      background: rgba(39, 39, 42, 0.4);
    }

    th, td {
      border: 1px solid #3f3f46;
      padding: 10px 16px;
      text-align: left;
    }

    th {
      font-weight: 600;
      color: #e4e4e7;
    }

    /* ── Code ── */
    .code-wrapper {
      border: 1px solid #3f3f46;
      border-radius: 12px;
      overflow: hidden;
    }

    .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #27272a;
      padding: 8px 16px;
      border-bottom: 1px solid #3f3f46;
    }

    .lang {
      font-size: 0.75rem;
      color: #a1a1aa;
      font-family: monospace;
    }

    .dots { display: flex; gap: 6px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot.red    { background: rgba(239, 68, 68, 0.83); }
    .dot.yellow { background: rgba(234, 178, 8, 0.89); }
    .dot.green  { background: rgba(34, 197, 94, 0.85); }

    pre {
      background: #09090b;
      padding: 16px;
      overflow-x: auto;
    }

    code {
      font-family: monospace;
      font-size: 0.8rem;
      color: #05DF65;
      white-space: pre;
    }
  </style>
</head>
<body>
  ${blocksHTML}
</body>
</html>`;
};

const escapeHTML = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
