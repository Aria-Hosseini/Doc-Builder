import { useState } from "react";
import type { Block, TreeNode as TTreeNode } from "../types/basetypes";
import useDocStore from "../store/useDocStore";
import TreeNode from "./TreeNode";
import { FaRegTrashAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  FiCheck,
  FiEdit2,
  FiFolder,
  FiFolderPlus,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";

interface Props {
  block: Extract<Block, { type: "tree" }>;
}

export default function TreeBlock({ block }: Props) {
  const { addTreeNode, removeBlock, removeTreeNode, updateTreeNode } =
    useDocStore();
  const [inputVal, setInputVal] = useState("");
  const [inputEdit, setInputEdit] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TTreeNode | null>(null);
  const { t } = useTranslation();

  const handleAddRoot = () => {
    if (!inputVal.trim()) return;
    addTreeNode(block.id, null, inputVal.trim());
    setInputVal("");
    setOpenAdd(false);
  };

  const handleAddChild = () => {
    if (!selectedNode || !inputVal.trim()) return;

    addTreeNode(block.id, selectedNode.id, inputVal.trim());

    setInputVal("");
    setOpenAdd(false);
    setSelectedNode(null);
  };

  const handleRename = () => {
    if (!selectedNode || !inputEdit.trim()) return;

    updateTreeNode(block.id, selectedNode.id, inputEdit.trim());

    setOpenEdit(false);
    setSelectedNode(null);
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
            <TreeNode
              key={node.id}
              blockId={block.id}
              node={node}
              onOpen={setSelectedNode}
            />
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

      {selectedNode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setSelectedNode(null);
            setOpenAdd(false);
            setOpenEdit(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-105 rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl p-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <FiFolder className="text-yellow-400" size={18} />
                <span className="text-zinc-100 font-medium">
                  {selectedNode.title}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedNode(null);
                  setOpenAdd(false);
                  setOpenEdit(false);
                }}
                className="text-zinc-500 hover:text-white"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <button
                onClick={() => {
                  setOpenEdit((v) => !v);
                  setOpenAdd(false);
                  setInputEdit("");
                }}
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-4 hover:bg-zinc-800 transition ${
                  openEdit ? "border-blue-500 bg-zinc-800" : "border-zinc-700"
                }`}
              >
                <FiEdit2 size={22} className="text-blue-400" />
                <span className="text-sm text-zinc-300">Rename</span>
              </button>

              <button
                onClick={() => {
                  setOpenAdd((v) => !v);
                  setOpenEdit(false);
                  setInputVal("");
                }}
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-4 hover:bg-zinc-800 transition ${
                  openAdd ? "border-green-500 bg-zinc-800" : "border-zinc-700"
                }`}
              >
                <FiFolderPlus size={22} className="text-green-400" />
                <span className="text-sm text-zinc-300">Add Child</span>
              </button>

              <button
                onClick={() => {
                  removeTreeNode(block.id, selectedNode.id);
                  setSelectedNode(null);
                }}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border border-zinc-700 p-4 hover:border-red-500 hover:bg-zinc-800 transition"
              >
                <FiTrash2 size={22} className="text-red-400" />
                <span className="text-sm text-zinc-300">Delete</span>
              </button>
            </div>

            {/* Rename input — shown below buttons */}
            {openEdit && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  autoFocus
                  value={inputEdit}
                  onChange={(e) => setInputEdit(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename()}
                  placeholder="New name..."
                  className="flex-1 bg-zinc-800 text-zinc-200 placeholder-zinc-600 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={handleRename}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-green-600 bg-green-900/40 hover:bg-green-800/60 text-green-400 transition shrink-0"
                  aria-label="confirm rename"
                >
                  <FiCheck size={16} />
                </button>
              </div>
            )}

            {/* Add child input — shown below buttons */}
            {openAdd && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  autoFocus
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddChild()}
                  placeholder="Child node name..."
                  className="flex-1 bg-zinc-800 text-zinc-200 placeholder-zinc-600 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-500 transition-colors"
                />
                <button
                  onClick={handleAddChild}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-green-600 bg-green-900/40 hover:bg-green-800/60 text-green-400 transition shrink-0"
                  aria-label="confirm add"
                >
                  <FiCheck size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
