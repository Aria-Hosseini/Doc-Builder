import { forwardRef } from "react";
import useDocStore from "../store/useDocStore";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const Preview = forwardRef<HTMLDivElement>((_, ref) => {
  const { blocks } = useDocStore();

  return (
    <div id="preview" ref={ref} className="flex flex-col gap-6 p-6 bg-zinc-900">
      {blocks.map((i, index) => {
        const isRtl = i.isRtL !== undefined ? i.isRtL : true;

        return (
          <div key={i.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded-full px-2 py-0.5">
                #{index + 1}
              </span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>
            {i.description && (
              <p
                dir={isRtl ? "rtl" : "ltr"}
                className={`text-zinc-300 text-sm leading-relaxed px-1 ${
                  isRtl ? "text-right" : "text-left"
                }`}
              >
                {i.description}
              </p>
            )}
            {i.code && (
              <div className="rounded-xl overflow-hidden border border-zinc-700">
                <div className="flex items-center justify-between bg-zinc-800 px-4 py-2 border-b border-zinc-700">
                  <span className="text-xs text-zinc-400 font-mono">
                    {i.lang}
                  </span>
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/60" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <span className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                </div>
                <SyntaxHighlighter
                  language={i.lang}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: "0.8rem",
                    background: "#09090b",
                  }}
                >
                  {i.code}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default Preview;
