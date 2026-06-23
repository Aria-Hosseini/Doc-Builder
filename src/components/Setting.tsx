import { useTranslation } from "react-i18next";
import useDocStore from "../store/useDocStore";

export default function Setting() {
  const { meta, updateMeta } = useDocStore();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "fa" ? "en" : "fa";
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold">{t("settings.title")}</h2>

      <div className="flex items-center justify-between">
        <span>{t("settings.language")}</span>

        <button
          onClick={toggleLanguage}
          className="px-3 py-1 rounded border border-zinc-700"
        >
          {i18n.language === "fa" ? "English" : "فارسی"}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span>نمایش جداکننده بلاک‌ها</span>

        <input
          type="checkbox"
          checked={meta.showSeprator}
          onChange={(e) => updateMeta("showSeprator", e.target.checked)}
        />
      </div>
    </div>
  );
}
