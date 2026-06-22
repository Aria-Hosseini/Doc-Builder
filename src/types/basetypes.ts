export type BlockType = "text" | "table";

export interface TableCell {
  content: string;
}

export type Theme = "dark" | "light" | "cream" | "green" | "yellow";

export interface Block {
  id: string;
  type: BlockType;
  description: string;
  code: string;
  lang: string;
  isRtL: boolean;
  tableData?: TableCell[][];
}

export interface DocMeta {
  author: string;
  createdAt: string;
  title: string;
  theme: Theme;
}

export interface Docstate {
  meta: DocMeta;
  blocks: Block[];
  addBlock: () => void;
  addTableBlock: (rows: number, cols: number) => void;
  updateBlock: (
    id: Block["id"],
    field: keyof Block,
    value: string | boolean | TableCell[][],
  ) => void;
  updateTableCell: (
    id: Block["id"],
    row: number,
    col: number,
    content: string,
  ) => void;
  addTableRow: (id: Block["id"]) => void;
  addTableCol: (id: Block["id"]) => void;
  removeTableRow: (id: Block["id"], rowIndex: number) => void;
  removeTableCol: (id: Block["id"], colIndex: number) => void;
  removeBlock: (id: Block["id"]) => void;
  reorderBlocks: (from: number, to: number) => void;
  updateMeta: (field: keyof DocMeta, value: string) => void;
}
