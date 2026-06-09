import type { Block } from "../types/basetypes";
import useDocStore from "../store/useDocStore";
import { useRef } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

interface Props {
  block: Block;
}

export default function TableBlock({ block }: Props) {
  const {
    updateTableCell,
    addTableRow,
    addTableCol,
    removeTableRow,
    removeTableCol,
    removeBlock,
  } = useDocStore();

  const tableData = block.tableData ?? [];
  const colCount = tableData[0]?.length ?? 0;

  const cellRefs = useRef<(HTMLTextAreaElement | null)[][]>([]);

  const focusCell = (row: number, col: number) => {
    cellRefs.current[row]?.[col]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    row: number,
    col: number,
  ) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const nextCol = col + 1;
      const nextRow = row + 1;
      if (nextCol < colCount) {
        focusCell(row, nextCol);
      } else if (nextRow < tableData.length) {
        focusCell(nextRow, 0);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (row + 1 < tableData.length) {
        focusCell(row + 1, col);
      }
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex flex-col gap-3 m-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 border border-zinc-700 rounded-lg px-2 py-1">
          جدول {tableData.length} × {colCount}
        </span>
        <button
          onClick={() => removeBlock(block.id)}
          className="text-xs text-zinc-500 flex gap-2 items-center hover:text-red-400 border border-zinc-700 hover:border-red-500 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
        >
          <FaRegTrashAlt size={13} />
          حذف بلاک
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-800">
              <th className="w-8 border-b border-r border-zinc-700" />
              {Array.from({ length: colCount }, (_, ci) => (
                <th
                  key={ci}
                  className="border-b border-r border-zinc-700 px-2 py-1 text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs text-zinc-500 font-normal">
                      {ci + 1}
                    </span>
                    {colCount > 1 && (
                      <button
                        onClick={() => removeTableCol(block.id, ci)}
                        className="text-zinc-600 hover:text-red-400 transition-colors cursor-pointer text-xs leading-none"
                        title="حذف ستون"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="border-b border-zinc-700 w-8" />
            </tr>
          </thead>

          <tbody>
            {tableData.map((row, ri) => {
              if (!cellRefs.current[ri]) cellRefs.current[ri] = [];
              return (
                <tr key={ri} className="group">
                  <td className="border-r border-zinc-700 bg-zinc-800 text-center w-8">
                    <div className="flex flex-col items-center gap-0.5 px-1 py-1">
                      <span className="text-xs text-zinc-500">{ri + 1}</span>
                      {tableData.length > 1 && (
                        <button
                          onClick={() => removeTableRow(block.id, ri)}
                          className="text-zinc-600 hover:text-red-400 transition-colors cursor-pointer text-xs leading-none"
                          title="حذف ردیف"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </td>

                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="border-r border-b border-zinc-700 p-0"
                    >
                      <textarea
                        ref={(el) => {
                          cellRefs.current[ri][ci] = el;
                        }}
                        value={cell.content}
                        onChange={(e) =>
                          updateTableCell(block.id, ri, ci, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, ri, ci)}
                        rows={1}
                        className="w-full min-w-25 bg-transparent text-zinc-200 text-sm px-3 py-2 resize-none focus:outline-none focus:bg-zinc-800/60 transition-colors placeholder-zinc-700"
                        placeholder="..."
                        style={{ height: "auto", minHeight: "36px" }}
                        onInput={(e) => {
                          const t = e.currentTarget;
                          t.style.height = "auto";
                          t.style.height = t.scrollHeight + "px";
                        }}
                      />
                    </td>
                  ))}

                  <td className="border-b border-zinc-700 w-8" />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => addTableRow(block.id)}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-blue-400 border border-zinc-700 hover:border-blue-500 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
        >
          <span>+</span>
          افزودن ردیف
        </button>
        <button
          onClick={() => addTableCol(block.id)}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-blue-400 border border-zinc-700 hover:border-blue-500 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
        >
          <span>+</span>
          افزودن ستون
        </button>
      </div>
    </div>
  );
}
