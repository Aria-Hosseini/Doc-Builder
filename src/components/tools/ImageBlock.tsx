import type { Block } from "../../types/basetypes";
import useDocStore from "../../store/useDocStore";
import { FaRegTrashAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { FiUpload } from "react-icons/fi";

interface Props {
  block: Extract<Block, { type: "image" }>;
}

export default function ImageBlock({ block }: Props) {
  const { updateImageBlock, removeBlock } = useDocStore();
  const { t } = useTranslation();

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex flex-col gap-4 m-5">
      <label
        htmlFor={`image-${block.id}`}
        className="flex items-center justify-center gap-2 border border-dashed border-zinc-700 rounded-lg py-3 px-4 cursor-pointer hover:border-blue-500 hover:text-blue-400 transition-colors text-zinc-400"
      >
        <FiUpload />
       {t("image_block.attach")}
      </label>

      <input
        id={`image-${block.id}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const reader = new FileReader();

          reader.onload = () => {
            updateImageBlock(block.id, "src", reader.result as string);
          };

          reader.readAsDataURL(file);
        }}
      />

      <input
        type="text"
        value={block.alt}
        onChange={(e) => updateImageBlock(block.id, "alt", e.target.value)}
        placeholder={t("image_block.alt")}
        className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg px-3 py-2"
      />

      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-400">{t("image_block.width")}</span>

        <input
          type="range"
          min={150}
          max={530}
          value={block.width}
          onChange={(e) =>
            updateImageBlock(block.id, "width", Number(e.target.value))
          }
          className="flex-1"
        />

        <span className="text-xs text-zinc-400">{block.width}px</span>
      </div>

      <select
        value={block.align}
        onChange={(e) => updateImageBlock(block.id, "align", e.target.value)}
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
      >
        <option value="left">{t("image_block.left")}</option>
        <option value="center">{t("image_block.center")}</option>
        <option value="right">{t("image_block.right")}</option>
      </select>

      {block.src && (
        <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950 p-3">
          <img
            src={block.src}
            alt={block.alt}
            style={{
              width: `${block.width}px`,
            }}
            className={
              block.align === "center"
                ? "mx-auto"
                : block.align === "right"
                  ? "ml-auto"
                  : "mr-auto"
            }
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => removeBlock(block.id)}
          className="text-xs text-zinc-500 flex flex-row-reverse gap-3 items-center hover:text-red-400 border border-zinc-700 hover:border-red-500 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
        >
          <FaRegTrashAlt size={14} />
          {t("editor.delete_block")}
        </button>
      </div>
    </div>
  );
}
