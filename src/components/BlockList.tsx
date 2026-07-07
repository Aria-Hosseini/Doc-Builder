import { useState } from "react";
import useDocStore from "../store/useDocStore";
import BlockEditor from "./BlockEditor";
import TableBlock from "./TableBlock";
import TreeBlock from "./TreeBlock";
import TablePicker from "./TablePicker";
import { FiGrid, FiMoreHorizontal } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { RxFileText } from "react-icons/rx";
import { TbBinaryTree } from "react-icons/tb";
import QuoteBlock from "./tools/QuoteBlock";
import MoreToolsModal from "./modals/ToolsModal";
import ImageBlock from "./tools/ImageBlock";

export default function BlockList() {
  const {
    blocks,
    addBlock,
    addTableBlock,
    addTreeBlock,
    addQuoteBlock,
    addImageBlock,
  } = useDocStore();
  const [showPicker, setShowPicker] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);
  const { t } = useTranslation();

  const handleTableSelect = (rows: number, cols: number) => {
    addTableBlock(rows, cols);
    setShowPicker(false);
  };

  return (
    <div className="flex flex-col">
      {blocks.map((block) => {
        if (block.type === "table")
          return <TableBlock key={block.id} block={block} />;
        if (block.type === "tree")
          return <TreeBlock key={block.id} block={block} />;
        if (block.type === "quote")
          return <QuoteBlock key={block.id} block={block} />;
        if (block.type === "image")
          return <ImageBlock key={block.id} block={block} />;
        return <BlockEditor key={block.id} block={block} />;
      })}

      <div className="flex flex-col sm:flex-row-reverse gap-3 px-5 pb-5">
        <button
          onClick={addBlock}
          className="flex-1 flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-blue-400 border border-dashed border-zinc-700 hover:border-blue-500 rounded-xl py-3 transition-colors cursor-pointer"
        >
          <RxFileText size={18} />
          {t("block_list.add_block")}
        </button>
        <button
          onClick={() => setShowPicker(true)}
          className="flex-1 flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-blue-400 border border-dashed border-zinc-700 hover:border-blue-500 rounded-xl py-3 transition-colors cursor-pointer"
        >
          <FiGrid size={15} />
          {t("block_list.add_table")}
        </button>
        <button
          onClick={addTreeBlock}
          className="flex-1 flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-blue-400 border border-dashed border-zinc-700 hover:border-blue-500 rounded-xl py-3 transition-colors cursor-pointer"
        >
          <TbBinaryTree size={16} />
          {t("block_list.add_tree")}
        </button>
        <button
          onClick={() => setShowMoreTools(true)}
          className="flex-1 flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-blue-400 border border-dashed border-zinc-700 hover:border-blue-500 rounded-xl py-3 transition-colors cursor-pointer"
        >
          <FiMoreHorizontal size={18} />
          {t("block_list.more_tools")}
        </button>

        {showMoreTools && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowMoreTools(false);
              }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl p-8 m-2 relative"
            >
              <button
                onClick={() => setShowMoreTools(false)}
                className="absolute top-3 left-3 text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>

              <MoreToolsModal
                onClose={() => setShowMoreTools(false)}
                onAddQuote={addQuoteBlock}
                onAddImage={addImageBlock}
              />
            </div>
          </div>
        )}
      </div>

      {showPicker && (
        <TablePicker
          onSelect={handleTableSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
