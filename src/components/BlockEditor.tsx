import type { Block } from "../types/basetypes"
import useDocStore from '../store/useDocStore';
import { useState } from "react";
import ToggleSwitch from "./ui/ToggleSwitch";

import { useTranslation } from 'react-i18next';

interface props {
    block: Block
}

export default function BlockEditor({ block }: props) {

    const { updateBlock, removeBlock } = useDocStore();
    const [hasCode, setHasCode] = useState(false);

    const { t } = useTranslation();

    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex flex-col gap-3 m-5">

            <textarea
                value={block.description}
                onChange={(e) => updateBlock(block.id, 'description', e.target.value)}
                placeholder={t('editor.block_placeholder')}
                rows={3}
                dir="rtl"
                className="w-full bg-zinc-800 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors"
            />

            <ToggleSwitch label={t('editor.has_code')} onChange={()=> setHasCode(prev => !prev)} checked={hasCode}/>

            {hasCode && (
                <div className="space-y-3">
                    <select
                        value={block.lang}
                        onChange={(e) => updateBlock(block.id, 'lang', e.target.value)}
                        className="w-fit bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="jsx">JSX</option>
                        <option value="python">Python</option>
                        <option value="css">CSS</option>
                    </select>

                    <textarea
                        value={block.code}
                        onChange={(e) => updateBlock(block.id, 'code', e.target.value)}
                        placeholder={t('editor.code_placeholder')}
                        rows={8}
                        className="w-full bg-zinc-950 text-green-400 placeholder-zinc-600 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
            )}



            <div className="flex justify-end">
                <button
                    onClick={() => removeBlock(block.id)}
                    className="text-xs text-zinc-500 hover:text-red-400 border border-zinc-700 hover:border-red-500 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                >
                    {t('editor.delete_block')}
                </button>
            </div>

        </div>
    )
}