import { useState } from "react";
import type { Block } from "../types/basetypes";
import useDocStore from "../store/useDocStore";
import TreeNode from "./TreeNode";
import { FaRegTrashAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";

interface Props {
  block: Extract<Block, { type: "tree" }>;
}

export default function TreeBlock({ block }: Props) {
  const { addTreeNode, removeBlock } = useDocStore();
  const [inputVal, setInputVal] = useState("");
  const { t } = useTranslation();

  const handleAddRoot = () => {
    if (!inputVal.trim()) return;
    addTreeNode(block.id, null, inputVal.trim());
    setInputVal("");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex flex-col gap-3 m-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 border border-zinc-700 rounded-lg px-2 py-1">
          {t("tree_editor.title")}
        </span>
        <button
          onClick={() => removeBlock(block.id)}
          className="text-xs text-zinc-500 flex gap-2 items-center hover:text-red-400 border border-zinc-700 hover:border-red-500 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
        >
          {t("tree_editor.delete_block")}
          <FaRegTrashAlt size={13} />
        </button>
      </div>

      <div className="flex flex-col gap-1 min-h-10">
        {block.treeData.length === 0 ? (
          <p className="text-zinc-600 text-xs px-1">{t("tree_editor.empty")}</p>
        ) : (
          block.treeData.map((node) => (
            <TreeNode key={node.id} blockId={block.id} node={node} />
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          placeholder={t("tree_editor.add_placeholder")}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddRoot()}
          className="flex-1 bg-zinc-800 text-zinc-200 placeholder-zinc-600 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          onClick={handleAddRoot}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-blue-400 border border-zinc-700 hover:border-blue-500 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
        >
          <FiPlus size={15} /> {t("tree_editor.add_node")}
        </button>
      </div>
    </div>
  );
}
