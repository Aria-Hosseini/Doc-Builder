import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Docstate, TableCell, TreeNode } from "../types/basetypes";

const makeEmptyTable = (rows: number, cols: number): TableCell[][] =>
  Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ content: "" })),
  );

function insertNode(
  nodes: TreeNode[],
  parentId: string | null,
  newNode: TreeNode,
): TreeNode[] {
  if (parentId === null) return [...nodes, newNode];
  return nodes.map((node) => {
    if (node.id === parentId) {
      return { ...node, children: [...(node.children ?? []), newNode] };
    }
    if (node.children) {
      return {
        ...node,
        children: insertNode(node.children, parentId, newNode),
      };
    }
    return node;
  });
}

function removeNode(nodes: TreeNode[], nodeId: string): TreeNode[] {
  return nodes
    .filter((n) => n.id !== nodeId)
    .map((n) => ({
      ...n,
      children: n.children ? removeNode(n.children, nodeId) : undefined,
    }));
}

function updateNode(
  nodes: TreeNode[],
  nodeId: string,
  title: string,
): TreeNode[] {
  return nodes.map((n) => {
    if (n.id === nodeId) return { ...n, title };
    if (n.children)
      return { ...n, children: updateNode(n.children, nodeId, title) };
    return n;
  });
}

const useDocStore = create<Docstate>()(
  persist(
    (set) => ({
      meta: {
        title: "My Doc",
        author: "",
        createdAt: new Date().toISOString(),
        theme: "dark",
        showSeprator: true,
        font: "iransans",
      },
      blocks: [
        {
          id: crypto.randomUUID(),
          type: "text",
          description: "",
          code: "",
          lang: "typescript",
          isRtL: true,
          fontsize: "14px",
        },
      ],

      addBlock: () =>
        set((state) => ({
          blocks: [
            ...state.blocks,
            {
              id: crypto.randomUUID(),
              type: "text",
              description: "",
              code: "",
              lang: "typescript",
              isRtL: false,
              fontsize: "14px",
            },
          ],
        })),

      addTableBlock: (rows, cols) =>
        set((state) => ({
          blocks: [
            ...state.blocks,
            {
              id: crypto.randomUUID(),
              type: "table",
              description: "",
              code: "",
              lang: "",
              isRtL: false,
              tableData: makeEmptyTable(rows, cols),
            },
          ],
        })),

      updateBlock: (id, field, value) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== id) return b;

            if (b.type === "tree") return b;

            if (field === "fontsize" && b.type !== "text") {
              return b;
            }

            return {
              ...b,
              [field]: value,
            };
          }),
        })),

      updateTableCell: (id, row, col, content) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== id || b.type !== "table") return b;
            const newData = b.tableData.map((r, ri) =>
              r.map((c, ci) => (ri === row && ci === col ? { content } : c)),
            );
            return { ...b, tableData: newData };
          }),
        })),

      addTableRow: (id) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== id || b.type !== "table") return b;
            const cols = b.tableData[0]?.length ?? 1;
            return {
              ...b,
              tableData: [
                ...b.tableData,
                Array.from({ length: cols }, () => ({ content: "" })),
              ],
            };
          }),
        })),

      addTableCol: (id) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== id || b.type !== "table") return b;
            return {
              ...b,
              tableData: b.tableData.map((row) => [...row, { content: "" }]),
            };
          }),
        })),

      removeTableRow: (id, rowIndex) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== id || b.type !== "table") return b;
            if (b.tableData.length <= 1) return b;
            return {
              ...b,
              tableData: b.tableData.filter((_, i) => i !== rowIndex),
            };
          }),
        })),

      removeTableCol: (id, colIndex) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== id || b.type !== "table") return b;
            if ((b.tableData[0]?.length ?? 0) <= 1) return b;
            return {
              ...b,
              tableData: b.tableData.map((row) =>
                row.filter((_, i) => i !== colIndex),
              ),
            };
          }),
        })),

      addTreeBlock: () =>
        set((state) => ({
          blocks: [
            ...state.blocks,
            {
              id: crypto.randomUUID(),
              type: "tree",
              description: "",
              treeData: [],
            },
          ],
        })),

      addQuoteBlock: () =>
        set((state) => ({
          blocks: [
            ...state.blocks,
            {
              id: crypto.randomUUID(),
              type: "quote",
              text: "",
              isRtl: false,
              fontsize: "14px",
            },
          ],
        })),

      addImageBlock: () =>
        set((state) => ({
          blocks: [
            ...state.blocks,
            {
              id: crypto.randomUUID(),
              type: "image",
              src: "",
              alt: "",
              width: 500,
              align: "center",
            },
          ],
        })),

      addTreeNode: (blockId, parentId, title) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== blockId || b.type !== "tree") return b;
            const newNode: TreeNode = { id: crypto.randomUUID(), title };
            return {
              ...b,
              treeData: insertNode(b.treeData, parentId, newNode),
            };
          }),
        })),

      updateTreeNode: (blockId, nodeId, title) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== blockId || b.type !== "tree") return b;
            return { ...b, treeData: updateNode(b.treeData, nodeId, title) };
          }),
        })),

      removeTreeNode: (blockId, nodeId) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== blockId || b.type !== "tree") return b;
            return { ...b, treeData: removeNode(b.treeData, nodeId) };
          }),
        })),

      updateQuote: (id, field, value) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== id || b.type !== "quote") return b;

            return {
              ...b,
              [field]: value,
            };
          }),
        })),

      updateImageBlock: (id, field, value) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== id || b.type !== "image") return b;

            return {
              ...b,
              [field]: value,
            };
          }),
        })),

      removeBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((b) => b.id !== id),
        })),

      reorderBlocks: (from, to) =>
        set((state) => {
          const blocks = [...state.blocks];
          const [moved] = blocks.splice(from, 1);
          blocks.splice(to, 0, moved);
          return { blocks };
        }),

      updateMeta: (field, value) =>
        set((state) => ({
          meta: { ...state.meta, [field]: value },
        })),
    }),
    {
      name: "doc-builder",
      version: 4,
      migrate: (persistedState) => {
        return persistedState;
      },
    },
  ),
);

export default useDocStore;
