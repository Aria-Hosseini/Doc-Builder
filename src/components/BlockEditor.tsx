import type { Block } from "../types/basetypes";
import useDocStore from "../store/useDocStore";
import { useState } from "react";
import ToggleSwitch from "./ui/ToggleSwitch";
import syntaxes from "../data/sytaxes.json";
import { FaRegTrashAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { fontClassMap } from "../utils/fonts/fonts";

interface Props {
  block: Extract<Block, { type: "text" }>;
}

export default function BlockEditor({ block }: Props) {
  const { updateBlock, removeBlock, meta } = useDocStore();
  const [hasCode, setHasCode] = useState(!!block.code);
  const langs = syntaxes.languages;
  const { t } = useTranslation();

  const isRtl = block.isRtL !== undefined ? block.isRtL : true;

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex flex-col gap-3 m-5">
      <div dir="rtl" className="flex justify-between items-center">
        <button
          onClick={() => updateBlock(block.id, "isRtL", !isRtl)}
          className="text-xs text-zinc-400 hover:text-blue-400 cursor-pointer border border-zinc-700 hover:border-blue-500 rounded-lg px-3 py-1.5 transition-colors"
        >
          {isRtl ? t("editor.ltr_buttom") : t("editor.rtl_buttom")}
        </button>

        <select
          value={block.fontsize}
          className="w-fit bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          onChange={(e) => updateBlock(block.id, "fontsize", e.target.value)}
        >
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="20px">20</option>
          <option value="24px">24</option>
          <option value="28px">28</option>
          <option value="32px">32</option>
        </select>
      </div>

      <textarea
        value={block.description}
        onChange={(e) => updateBlock(block.id, "description", e.target.value)}
        placeholder={t("editor.block_placeholder")}
        rows={3}
        dir={isRtl ? "rtl" : "ltr"}
        className={`${fontClassMap[meta.font]} w-full bg-zinc-800 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors ${
          isRtl ? "text-right" : "text-left"
        }`}
        style={{
          fontSize: block.fontsize,
        }}
      />

      <ToggleSwitch
        label={t("editor.has_code")}
        onChange={() =>
          setHasCode((prev) => {
            const newHasCode = !prev;
            if (!newHasCode) updateBlock(block.id, "code", "");
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
            placeholder={t("editor.code_placeholder")}
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
          {t("editor.delete_block")}
        </button>
      </div>
    </div>
  );
}
