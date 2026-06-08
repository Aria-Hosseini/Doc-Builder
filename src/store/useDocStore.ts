import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Docstate } from "../types/basetypes";

const useDocStore = create<Docstate>()(
  persist(
    (set) => ({
      meta: {
        title: "My Doc",
        author: "",
        createdAt: new Date().toISOString(),
      },
      blocks: [
        {
          id: crypto.randomUUID(),
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
              description: "",
              code: "",
              lang: "typescript",
              isRtL: true,
            },
          ],
        })),

      updateBlock: (id, field, value) =>
        set((state) => ({
          blocks: state.blocks.map((b) =>
            b.id === id ? { ...b, [field]: value } : b,
          ),
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
    }),
    { name: "doc-builder" },
  ),
);

export default useDocStore;
