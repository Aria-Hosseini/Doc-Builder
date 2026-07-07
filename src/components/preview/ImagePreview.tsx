import type { Block } from "../../types/basetypes";

interface Props {
  block: Extract<Block, { type: "image" }>;
}

export default function ImagePreview({ block }: Props) {
  if (!block.src) return null;

  return (
    <div
      className={
        block.align === "center"
          ? "flex justify-center"
          : block.align === "right"
          ? "flex justify-end"
          : "flex justify-start"
      }
    >
      <img
        src={block.src}
        alt={block.alt}
        style={{
          width: `${block.width}px`,
          maxWidth: "100%",
        }}
        className="rounded-xl border border-zinc-700 shadow-md"
      />
    </div>
  );
}