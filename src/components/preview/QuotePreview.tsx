import type { Block } from "../../types/basetypes";
import useDocStore from "../../store/useDocStore";
import { fontClassMap } from "../../utils/fonts/fonts";

interface Props {
  block: Extract<Block, { type: "quote" }>;
}

export default function QuotePreview({ block }: Props) {
  const { meta } = useDocStore();

  return (
    <blockquote
      dir={block.isRtl ? "rtl" : "ltr"}
      className={`
        ${fontClassMap[meta.font]}
        border-r-4
        border-blue-500
        bg-zinc-800/50
        whitespace-pre-wrap
        rounded-lg
        px-4
        py-3
        leading-8
        ${block.isRtl ? "text-right" : "text-left"}
      `}
      style={{
        fontSize: block.fontsize,
      }}
    >
      {block.text}
    </blockquote>
  );
}