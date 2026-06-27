import { useState } from "react";
import useDocStore from "../store/useDocStore";
import BlockEditor from "./BlockEditor";
import TableBlock from "./TableBlock";
import TreeBlock from "./TreeBlock";
import TablePicker from "./TablePicker";
import { FiGrid } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { RxFileText } from "react-icons/rx";
import { TbBinaryTree } from "react-icons/tb";

export default function BlockList() {
  const { blocks, addBlock, addTableBlock, addTreeBlock } = useDocStore();
  const [showPicker, setShowPicker] = useState(false);
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
        return <BlockEditor key={block.id} block={block} />;
      })}

      <div className="flex flex-col sm:flex-row gap-3 px-5 pb-5">
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
