import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Docstate, TableCell } from "../types/basetypes";

const makeEmptyTable = (rows: number, cols: number): TableCell[][] =>
  Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ content: "" })),
  );

const useDocStore = create<Docstate>()(
  persist(
    (set) => ({
      meta: {
        title: "My Doc",
        author: "",
        createdAt: new Date().toISOString(),
        theme: "dark",
      },
      blocks: [
        {
          id: crypto.randomUUID(),
          type: "text",
          description: "",
          code: "",
          lang: "typescript",
          isRtL: true,
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
              isRtL: true,
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
          blocks: state.blocks.map((b) =>
            b.id === id ? { ...b, [field]: value } : b,
          ),
        })),

      updateTableCell: (id, row, col, content) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== id || !b.tableData) return b;
            const newData = b.tableData.map((r, ri) =>
              r.map((c, ci) => (ri === row && ci === col ? { content } : c)),
            );
            return { ...b, tableData: newData };
          }),
        })),

      addTableRow: (id) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== id || !b.tableData) return b;
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
            if (b.id !== id || !b.tableData) return b;
            return {
              ...b,
              tableData: b.tableData.map((row) => [...row, { content: "" }]),
            };
          }),
        })),

      removeTableRow: (id, rowIndex) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== id || !b.tableData) return b;
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
            if (b.id !== id || !b.tableData) return b;
            if ((b.tableData[0]?.length ?? 0) <= 1) return b;
            return {
              ...b,
              tableData: b.tableData.map((row) =>
                row.filter((_, i) => i !== colIndex),
              ),
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
          meta: {
            ...state.meta,
            [field]: value,
          },
        })),
    }),
    { name: "doc-builder" },
  ),
);

export default useDocStore;
