import type { Block } from "../types/basetypes";
import useDocStore from "../store/useDocStore";
import { useState } from "react";
import ToggleSwitch from "./ui/ToggleSwitch";
import syntaxes from "../data/sytaxes.json";
import { FaRegTrashAlt } from "react-icons/fa";

interface props {
  block: Block;
}

export default function BlockEditor({ block }: props) {
  const { updateBlock, removeBlock } = useDocStore();
  const [hasCode, setHasCode] = useState(!!block.code);
  const langs = syntaxes.languages;

  const isRtl = block.isRtL !== undefined ? block.isRtL : true;

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex flex-col gap-3 m-5">
      <div dir="rtl" className="flex justify-between items-center">
        <button
          onClick={() => updateBlock(block.id, "isRtL", !isRtl as any)}
          className="text-xs text-zinc-400 hover:text-blue-400 cursor-pointer border border-zinc-700 hover:border-blue-500 rounded-lg px-3 py-1.5 transition-colors"
        >
          {isRtl ? "← چپ‌چین کن" : "→ راست‌چین کن"}
        </button>
      </div>

      <textarea
        value={block.description}
        onChange={(e) => updateBlock(block.id, "description", e.target.value)}
        placeholder="توضیحات بلاک..."
        rows={3}
        dir={isRtl ? "rtl" : "ltr"}
        className={`w-full bg-zinc-800 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors ${
          isRtl ? "text-right" : "text-left"
        }`}
      />

      <ToggleSwitch
        label="دارای کد است"
        onChange={() =>
          setHasCode((prev) => {
            const newHasCode = !prev;
            if (!newHasCode) {
              updateBlock(block.id, "code", "");
            }
            return newHasCode;
          })
        }
        checked={hasCode}
      />

      {hasCode && (
        <div className="space-y-3">
          <select
            value={block.lang || "typescript"}
            onChange={(e) => updateBlock(block.id, "lang", e.target.value)}
            className="w-fit bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            {langs.map((i, index) => (
              <option key={index} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>

          <textarea
            value={block.code || ""}
            onChange={(e) => updateBlock(block.id, "code", e.target.value)}
            placeholder="کد بلاک..."
            rows={8}
            className="w-full bg-zinc-950 text-green-400 placeholder-zinc-600 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:border-blue-500 transition-colors"
            dir="ltr"
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => removeBlock(block.id)}
          className="text-xs text-balance text-zinc-500 flex flex-row-reverse gap-3 items-center hover:text-red-400 border border-zinc-700 hover:border-red-500 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
        >
          <FaRegTrashAlt size={14} />
          حذف بلاک
        </button>
      </div>
    </div>
  );
}
