import type { Block, TreeNode } from "../../types/basetypes";
import { fontClassMap } from "../../utils/fonts/fonts";
import useDocStore from "../../store/useDocStore";


function RenderNode({ node, depth = 0 }: { node: TreeNode; depth?: number }) {

  const {meta} = useDocStore();
  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <span className={`text-zinc-300 text-sm ${fontClassMap[meta.font]}`}>📁 {node.title}</span>
      {node.children?.map((child) => (
        <RenderNode key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function TreePreview({
  block,
}: {
  block: Extract<Block, { type: "tree" }>;
}) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg border border-zinc-700 bg-zinc-900">
      {block.treeData.map((node) => (
        <RenderNode key={node.id} node={node} />
      ))}
    </div>
  );
}
