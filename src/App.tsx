import "./App.css";
import BlockList from "./components/BlockList";
import Preview from "./components/Preview";
import useDocStore from "./store/useDocStore";
import { generatePDF } from "./utils/generatePDF";
import { generateHTML } from "./utils/generateHtml";
import { TbFileTypeHtml } from "react-icons/tb";
import { PiFilePdfBold } from "react-icons/pi";

import { useTranslation } from "react-i18next";
import ThemePicker from "./components/ui/ThemePicker";
import { IoSettingsOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import Setting from "./components/Setting";

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const openPreview = () => {
    setIsPreviewOpen(true);
    setTimeout(() => {
      setIsOpening(true);
    }, 10);
  };

  const closePreview = () => {
    setIsClosing(true);
    setIsOpening(false);

    setTimeout(() => {
      setIsPreviewOpen(false);
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    if (!isPreviewOpen) {
      setIsOpening(false);
      setIsClosing(false);
    }
  }, [isPreviewOpen]);

  const exportHTML = () => {
    const { blocks, meta } = useDocStore.getState();
    const html = generateHTML(blocks, meta.theme, meta.showSeprator);

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();

    URL.revokeObjectURL(url);
  };

  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="sticky top-0 z-100 bg-zinc-950 flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl">{t("navbar.title")}</span>

          <button
            onClick={() => setIsSettingOpen(true)}
            className="px-3 py-1 cursor-pointer text-xs font-semibold rounded border border-gray-700 bg-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            <IoSettingsOutline size={22} />
          </button>

          {isSettingOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl p-6 relative">
                <button
                  onClick={() => setIsSettingOpen(false)}
                  className="absolute top-3 left-3 text-zinc-400 hover:text-white"
                >
                  ✕
                </button>

                <Setting />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => generatePDF("preview-hidden")}
            className="text-sm bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <PiFilePdfBold size={22} />
          </button>

          <button
            onClick={exportHTML}
            className="text-sm bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <TbFileTypeHtml size={22} />
          </button>
        </div>
      </header>

      <div className="hidden md:flex flex-row-reverse flex-1">
        <div className="w-[60%] flex flex-col overflow-y-auto border-r border-zinc-800 p-4 gap-4">
          <BlockList />
        </div>

        <div className="w-[40%] flex flex-col bg-zinc-900">
          <div className="sticky top-0 px-6 py-3 border-b border-zinc-800 bg-zinc-900 z-10 flex items-center justify-between">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">
              {t("sidebar.preview")}
            </span>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 uppercase tracking-widest">
                {t("sidebar.selectTheme")}
              </span>
              <ThemePicker />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <Preview />
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-1 overflow-hidden">
        <div className="w-full flex flex-col overflow-y-auto p-4 gap-4 pb-24">
          <BlockList />
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-4 py-3 flex items-center justify-between z-50">
        <span className="text-xs text-zinc-500 uppercase tracking-widest">
          {t("sidebar.selectTheme")}
        </span>

        <div className="flex items-center gap-3">
          <ThemePicker />

          <button
            onClick={openPreview}
            className="px-3 py-1.5 text-xs rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors"
          >
            {t("sidebar.preview")}
          </button>
        </div>
      </div>

      {isPreviewOpen && (
        <div
          className={`md:hidden fixed inset-0 z-100 ${
            isClosing ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          onClick={closePreview}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            className={`absolute bottom-0 left-0 right-0 h-[90vh] bg-zinc-900 rounded-t-3xl flex flex-col transition-transform duration-300 ${
              isClosing || !isOpening ? "translate-y-full" : "translate-y-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800 rounded-t-3xl">
              <div className="flex justify-center py-2">
                <div className="w-12 h-1.5 rounded-full bg-zinc-600" />
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("sidebar.preview")}
                </span>

                <button
                  onClick={closePreview}
                  className="text-zinc-400 hover:text-white transition-colors p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              <Preview />
            </div>
          </div>
        </div>
      )}

      <div className="fixed -left-24999.75 top-0 w-200">
        <div id="preview-hidden">
          <Preview />
        </div>
      </div>
    </div>
  );
}

export default App;
