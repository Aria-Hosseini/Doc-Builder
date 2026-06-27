export type Theme = "dark" | "light" | "cream" | "green" | "yellow";

export interface TableCell {
  content: string;
}

export interface TreeNode {
  id: string;
  title: string;
  children?: TreeNode[];
}

export type Block =
  | {
      id: string;
      type: "text";
      description: string;
      code: string;
      lang: string;
      isRtL: boolean;
    }
  | {
      id: string;
      type: "table";
      description: string;
      code: string;
      lang: string;
      isRtL: boolean;
      tableData: TableCell[][];
    }
  | {
      id: string;
      type: "tree";
      description: string;
      treeData: TreeNode[];
    };

export interface DocMeta {
  author: string;
  createdAt: string;
  title: string;
  theme: Theme;
  showSeprator: boolean;
}

export interface Docstate {
  meta: DocMeta;
  blocks: Block[];

  addBlock: () => void;
  updateBlock: (
    id: string,
    field: "description" | "code" | "lang" | "isRtL",
    value: string | boolean,
  ) => void;

  addTableBlock: (rows: number, cols: number) => void;
  updateTableCell: (
    id: string,
    row: number,
    col: number,
    content: string,
  ) => void;
  addTableRow: (id: string) => void;
  addTableCol: (id: string) => void;
  removeTableRow: (id: string, rowIndex: number) => void;
  removeTableCol: (id: string, colIndex: number) => void;

  addTreeBlock: () => void;
  addTreeNode: (
    blockId: string,
    parentId: string | null,
    title: string,
  ) => void;
  updateTreeNode: (blockId: string, nodeId: string, title: string) => void;
  removeTreeNode: (blockId: string, nodeId: string) => void;

  removeBlock: (id: string) => void;
  reorderBlocks: (from: number, to: number) => void;
  updateMeta: (field: keyof DocMeta, value: string | boolean) => void;
}
