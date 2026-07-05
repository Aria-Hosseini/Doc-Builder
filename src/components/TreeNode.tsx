import { useEffect, useState } from "react";
import type { TreeNode as TTreeNode } from "../types/basetypes";
import useDocStore from "../store/useDocStore";
import { fontClassMap } from "../utils/fonts/fonts";
import {
  FiFolder,
  FiFolderPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiPlus,
} from "react-icons/fi";

export interface Props {
  blockId: string;
  node: TTreeNode;
  depth?: number;
  onOpen: (node: TTreeNode) => void;
}

export default function TreeNode({ blockId, node, depth = 0, onOpen }: Props) {
  const { addTreeNode, updateTreeNode, removeTreeNode , meta } = useDocStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
    };

    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleAdd = () => {
    if (!inputVal.trim()) return;
    addTreeNode(blockId, node.id, inputVal.trim());
    setInputVal("");
    setIsAdding(false);
  };

  const handleRename = () => {
    if (!inputVal.trim()) return;
    updateTreeNode(blockId, node.id, inputVal.trim());
    setIsEditing(false);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();

        if (isMobile) {
          onOpen(node);
        }
      }}
      style={{ paddingLeft: depth * 16 }}
    >
      <div className="flex items-center gap-2 group py-1 hover:bg-zinc-800 hover:px-1 hover:rounded-md">
        <FiFolder size={14} className="text-yellow-400 shrink-0" />

        {isEditing ? (
          <>
            <input
              autoFocus
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className={`${fontClassMap[meta.font]} flex-1 bg-zinc-800 text-zinc-200 border border-blue-500 rounded-md px-2 py-0.5 text-sm focus:outline-none`}
            />
            <button
              onClick={handleRename}
              className="text-green-400 hover:text-green-300 transition-colors cursor-pointer"
            >
              <FiCheck size={17} />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <FiX size={17} />
            </button>
          </>
        ) : (
          <>
            <span className={`${fontClassMap[meta.font]} flex-1 text-sm text-zinc-300`}>{node.title}</span>

            <div className={`${fontClassMap[meta.font]} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
              <button
                onClick={() => {
                  setInputVal(node.title);
                  setIsEditing(true);
                  setIsAdding(false);
                }}
                className="text-zinc-500 hover:text-blue-400 transition-colors cursor-pointer"
                title="Rename"
              >
                <FiEdit2 size={17} />
              </button>
              <button
                onClick={() => {
                  setIsAdding(!isAdding);
                  setIsEditing(false);
                  setInputVal("");
                }}
                className="text-zinc-500 hover:text-green-400 transition-colors cursor-pointer"
                title="Add child"
              >
                <FiFolderPlus size={17} />
              </button>
              <button
                onClick={() => removeTreeNode(blockId, node.id)}
                className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                title="Delete"
              >
                <FiTrash2 size={17} />
              </button>
            </div>
          </>
        )}
      </div>

      {isAdding && (
        <div
          style={{ paddingLeft: 16 }}
          className="flex items-center gap-2 py-1"
        >
          <FiPlus size={13} className="text-zinc-500 shrink-0" />
          <input
            autoFocus
            placeholder="Folder name..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className={`${fontClassMap[meta.font]} flex-1 bg-zinc-800 text-zinc-200 placeholder-zinc-600 border border-zinc-700 rounded-md px-2 py-0.5 text-sm focus:outline-none focus:border-blue-500 transition-colors`}
          />
          <button
            onClick={handleAdd}
            className="text-green-400 hover:text-green-300 transition-colors cursor-pointer"
          >
            <FiCheck size={14} />
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setInputVal("");
            }}
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <FiX size={14} />
          </button>
        </div>
      )}

      {node.children?.map((child) => (
        <TreeNode
          key={child.id}
          blockId={blockId}
          node={child}
          depth={depth + 1}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
