import "./App.css";
import BlockList from "./components/BlockList";
import Preview from "./components/Preview";
import useDocStore from "./store/useDocStore";
import { generatePDF } from "./utils/generatePDF";
import { generateHTML } from "./utils/generateHtml";
import { TbFileTypeHtml } from "react-icons/tb";
import { PiFilePdfBold } from "react-icons/pi";

import { useTranslation } from 'react-i18next';

function App() {
  const { addBlock } = useDocStore();

  const exportHTML = () => {
    const { blocks } = useDocStore.getState();
    const html = generateHTML(blocks);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'fa' ? 'en' : 'fa';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="sticky top-0 z-100 bg-zinc-950 flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl">{t('navbar.title')}</span>
          <button 
            onClick={toggleLanguage}
            className="px-3 py-1 text-xs font-semibold rounded border border-gray-700 bg-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            {i18n.language === 'fa' ? 'Eng' : 'فا'}
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => generatePDF("preview")}
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
          <button
            onClick={addBlock}
            className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            {t('navbar.add_block')}
          </button>
        </div>
      </header>

      <div className="flex flex-row-reverse w-full">
        <div className="w-[60%] flex flex-col overflow-y-auto border-l border-zinc-800 p-4 gap-4">
          <BlockList />
        </div>

        <div className="w-[40%] overflow-y-auto min-h-sceen bg-zinc-900">
          <div className="sticky top-0 px-6 py-3 border-b border-zinc-800 bg-zinc-900 z-10">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">
              {t('sidebar.preview')}
            </span>
          </div>
          <Preview />
        </div>
      </div>
    </div>
  );
}

export default App;
