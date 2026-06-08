// types/basetypes.ts
export interface Block {
  id: string;
  description: string;
  code: string;
  lang: string;
  isRtL: boolean;
}

export interface DocMeta {
  author: string;
  createdAt: string;
  title: string;
}

export interface Docstate {
  meta: DocMeta;
  blocks: Block[];
  addBlock: () => void;
  updateBlock: (id: Block["id"], field: keyof Block, value: string) => void;
  removeBlock: (id: Block["id"]) => void;
  reorderBlocks: (from: number, to: number) => void;
}
