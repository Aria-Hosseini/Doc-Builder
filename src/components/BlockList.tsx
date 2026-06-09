import { useState } from "react";
import useDocStore from "../store/useDocStore";
import BlockEditor from "./BlockEditor";
import TableBlock from "./TableBlock";
import TablePicker from "./TablePicker";
import { FiGrid } from "react-icons/fi";

export default function BlockList() {
  const { blocks, addBlock, addTableBlock } = useDocStore();
  const [showPicker, setShowPicker] = useState(false);

  const handleTableSelect = (rows: number, cols: number) => {
    addTableBlock(rows, cols);
    setShowPicker(false);
  };

  return (
    <div className="flex flex-col">
      {blocks.map((block) =>
        block.type === "table" ? (
          <TableBlock key={block.id} block={block} />
        ) : (
          <BlockEditor key={block.id} block={block} />
        ),
      )}

      <div className="flex gap-3 px-5 pb-5">
        <button
          onClick={addBlock}
          className="flex-1 text-sm text-zinc-400 hover:text-blue-400 border border-dashed border-zinc-700 hover:border-blue-500 rounded-xl py-3 transition-colors cursor-pointer"
        >
          + افزودن بلاک متنی
        </button>

        <button
          onClick={() => setShowPicker(true)}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-blue-400 border border-dashed border-zinc-700 hover:border-blue-500 rounded-xl px-5 py-3 transition-colors cursor-pointer"
        >
          <FiGrid size={15} />
          افزودن جدول
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
