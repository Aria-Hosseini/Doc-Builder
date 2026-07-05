import { forwardRef } from "react";
import useDocStore from "../store/useDocStore";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { themes } from "../data/themes";
import { LuFilePenLine } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import TreePreview from "./TreePreview";
import { fontClassMap } from "../utils/fonts/fonts";

const Preview = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();

  const { blocks, meta } = useDocStore();
  const theme = themes[meta.theme];

  const hasContent = blocks.some((block) => {
    if (block.type === "table") {
      return block.tableData.some((row) =>
        row.some((cell) => cell.content.trim() !== ""),
      );
    }
    if (block.type === "tree") {
      return block.treeData.length > 0;
    }
    return block.description.trim() !== "" || block.code.trim() !== "";
  });

  if (!hasContent) {
    return (
      <div
        id="preview"
        ref={ref}
        className="flex flex-col items-center justify-center min-h-100 gap-3 p-6"
      >
        <span className="text-5xl">
          <LuFilePenLine size={40} className="text-zinc-500" />
        </span>

        <p className="text-zinc-500 text-sm select-none">
          {t("preview.empty_title")}
        </p>
        <p className="text-zinc-500 text-[11px] select-none text-center leading-6">
          {t("preview.empty_description")}
        </p>
      </div>
    );
  }

  return (
    <div
      id="preview"
      ref={ref}
      className="flex flex-col gap-6 p-6 bg-zinc-900"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        border: theme.border,
      }}
    >
      {blocks.map((block, index) => (
        <div key={block.id} className="flex flex-col gap-3">
          {meta.showSeprator && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded-full px-2 py-0.5">
                #{index + 1}
              </span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>
          )}

          {block.type === "table" && (
            <div className="overflow-x-auto rounded-lg border border-zinc-700">
              <table
                dir={block.isRtL ? "rtl" : "ltr"}
                className="w-full border-collapse text-sm text-zinc-300"
              >
                <tbody>
                  {block.tableData.map((row, ri) => (
                    <tr
                      key={ri}
                      className={
                        ri === 0
                          ? "bg-zinc-800 font-medium"
                          : "bg-zinc-900 even:bg-zinc-800/40"
                      }
                    >
                      {row.map((cell, ci) => {
                        const Tag = ri === 0 ? "th" : "td";
                        return (
                          <Tag
                            key={ci}
                            className={`${fontClassMap[meta.font]} border border-zinc-700 px-4 py-2 ${
                              block.isRtL ? "text-right" : "text-left"
                            }`}
                          >
                            {cell.content || (
                              <span className="text-zinc-600 text-xs italic">
                                —
                              </span>
                            )}
                          </Tag>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {block.type === "tree" && <TreePreview block={block} />}

          {block.type === "text" && (
            <>
              {block.description && (
                <p
                  dir={block.isRtL ? "rtl" : "ltr"}
                  className={`${fontClassMap[meta.font]} text-zinc-300 text-sm leading-relaxed px-1 whitespace-pre-wrap ${
                    block.isRtL ? "text-right" : "text-left"
                  }`}
                  style={{ color: theme.text }}
                >
                  {block.description}
                </p>
              )}
              {block.code && (
                <div className="rounded-xl overflow-hidden border border-zinc-700">
                  <div className="flex items-center justify-between bg-zinc-800 px-4 py-2 border-b border-zinc-700">
                    <span className="text-xs text-zinc-400 font-mono">
                      {block.lang}
                    </span>
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/60" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <span className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                  </div>
                  <SyntaxHighlighter
                    language={block.lang}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: "0.8rem",
                      background: "#09090b",
                    }}
                  >
                    {block.code}
                  </SyntaxHighlighter>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
});

export default Preview;
