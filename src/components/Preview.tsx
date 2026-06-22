import { forwardRef } from "react";
import useDocStore from "../store/useDocStore";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { themes } from "../data/themes";

const Preview = forwardRef<HTMLDivElement>((_, ref) => {
  const { blocks, meta } = useDocStore();
  const theme = themes[meta.theme];

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
      {blocks.map((block, index) => {
        const isRtl = block.isRtL !== undefined ? block.isRtL : true;

        return (
          <div key={block.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded-full px-2 py-0.5">
                #{index + 1}
              </span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            {block.type === "table" && block.tableData && (
              <div className="overflow-x-auto rounded-lg border border-zinc-700">
                <table className="w-full border-collapse text-sm text-zinc-300">
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
                              className="border border-zinc-700 px-4 py-2 text-left"
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

            {block.type !== "table" && (
              <>
                {block.description && (
                  <p
                    dir={isRtl ? "rtl" : "ltr"}
                    className={`text-zinc-300 text-sm leading-relaxed px-1 whitespace-pre-wrap ${
                      isRtl ? "text-right" : "text-left"
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
        );
      })}
    </div>
  );
});

export default Preview;
