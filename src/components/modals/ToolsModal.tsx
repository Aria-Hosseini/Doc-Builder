import { PiQuotes } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { FiImage } from "react-icons/fi";

interface Props {
  onClose: () => void;
  onAddQuote: () => void;
  onAddImage: () => void;
}

export default function MoreToolsModal({ onClose, onAddQuote, onAddImage }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold">{t("block_list.more_tools")}</h2>

      <button
        onClick={() => {
          onAddQuote();
          onClose();
        }}
        className="w-full flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-blue-400 border border-dashed border-zinc-700 hover:border-blue-500 rounded-xl py-3 transition-colors cursor-pointer"
      >
        <PiQuotes size={18} />
        {t("block_list.add_quote")}
      </button>

      <button
        onClick={() => {
          onAddImage();
          onClose();
        }}
        className="w-full flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-blue-400 border border-dashed border-zinc-700 hover:border-blue-500 rounded-xl py-3 transition-colors cursor-pointer"
      >
        <FiImage size={18} />
        {t("block_list.add_image")}
      </button>
    </div>
  );
}