import { useState } from "react";

interface Props {
  onSelect: (rows: number, cols: number) => void;
  onClose: () => void;
}

const MAX = 8;

export default function TablePicker({ onSelect, onClose }: Props) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(
    null,
  );

  const hovRow = hovered?.row ?? 0;
  const hovCol = hovered?.col ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-2xl shadow-black/60 flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs text-zinc-400 text-center select-none">
          {hovered ? `${hovRow} × ${hovCol}` : "ابعاد جدول را انتخاب کنید"}
        </p>

        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${MAX}, 1fr)` }}
        >
          {Array.from({ length: MAX }, (_, r) =>
            Array.from({ length: MAX }, (_, c) => {
              const active = hovered && r < hovRow && c < hovCol;
              return (
                <div
                  key={`${r}-${c}`}
                  onMouseEnter={() => setHovered({ row: r + 1, col: c + 1 })}
                  onClick={() => {
                    if (hovered) onSelect(hovRow, hovCol);
                  }}
                  className={`w-6 h-6 rounded border cursor-pointer transition-all duration-75 ${
                    active
                      ? "bg-blue-500 border-blue-400"
                      : "bg-zinc-800 border-zinc-700 hover:border-zinc-500"
                  }`}
                />
              );
            }),
          )}
        </div>

        <button
          onClick={onClose}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors text-center cursor-pointer"
        >
          انصراف
        </button>
      </div>
    </div>
  );
}
