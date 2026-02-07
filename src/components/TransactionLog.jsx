import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
function DeleteButton({ onDelete }) {
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (!confirm) return;
    const t = setTimeout(() => setConfirm(false), 3000);
    return () => clearTimeout(t);
  }, [confirm]);

  const handleClick = () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    onDelete();
    setConfirm(false);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleClick}
        className={`
          p-1 rounded transform-gpu active:scale-95
          transition-all duration-300 cursor-pointer flex items-center justify-center
          ${confirm
            ? "bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white"
            : "text-red-500 hover:text-red-200 hover:bg-red-600/40"}
        `}
        title={confirm ? "Click again to confirm delete" : "Delete transaction"}
      >
        {confirm && (
        <span className="text-red-300 text-xs font-semibold select-none">
          Click again to delete
        </span>
      )}
        <Trash2 className="w-4 h-4 cursor-pointer" />
      </button>

      {/* Inline confirm text */}
      
    </div>
  );
}

export default function TransactionLog({ logs, deleteTransaction }) {
  return (
    <div id="logsTable" className="mt-6">
      <h3 className="text-lg text-gray-200 font-semibold mb-2 tracking-wide">
        Transaction History
      </h3>

      <div className="overflow-x-auto border no-scrollbar border-gray-700 rounded-xl shadow-lg backdrop-blur bg-gray-900/40 mb-8">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-800 text-gray-300 z-10">
            <tr>
              <th className="py-2 px-3 text-left border border-gray-700/50">#</th>
              <th className="py-2 px-3 text-left border border-gray-700/50">Type</th>
              <th className="py-2 px-3 text-left border border-gray-700/50">Brand</th>
              <th className="py-2 px-3 text-left border border-gray-700/50">Shade</th>
              <th className="py-2 px-3 text-left border border-gray-700/50">Size</th>
              <th className="py-2 px-3 text-left border border-gray-700/50">Qty</th>
              <th className="py-2 px-3 text-left border border-gray-700/50">Lab / Clinic</th>
              <th className="py-2 px-3 text-left border border-gray-700/50">Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((l, i) => (
              <tr
                key={i}
                className="border-t border-gray-800 hover:bg-gray-800/60 transition-colors"
              >
                <td className="py-2 px-3 border border-gray-700/20 text-gray-400">{logs.length - i}</td>

                <td className="py-2 px-3 border border-gray-700/20">
                  <span
                    className={`
                      px-2 py-0.5 sm:px-2 sm:py-0.5 rounded-lg 
                      text-[10px] sm:text-xs font-semibold tracking-wide
                      whitespace-nowrap
                      ${l.type === "IN"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400"
                        : "bg-red-500/20 text-red-400 border border-red-400"}
                    `}
                  >
                    <span className="sm:hidden">{l.type === "IN" ? "⬇" : "⬆"}</span>
                    <span className="hidden sm:inline">{l.type === "IN" ? "⬇ IN" : "⬆ OUT"}</span>
                  </span>
                </td>

                <td className="py-2 px-3 border border-gray-700/20 text-gray-200">{l.brand}</td>
                <td className="py-2 px-3 border border-gray-700/20 text-gray-200">{l.shade || "-"}</td>
                <td className="py-2 px-3 border border-gray-700/20 text-gray-200">{l.size}</td>

                <td className={`py-2 px-3 text-center font-saira font-semibold ${l.type === "IN" ? "text-emerald-400 font-bold" : "text-red-400"}`}>
                  {l.type === "IN" ? "+" : "-"}{l.qty}
                </td>

                <td className="py-2 px-3 border border-gray-700/20 text-gray-200">{l.clinic || "-"}</td>

                <td className="py-2 px-3 border border-gray-700/20 text-xs text-gray-400">
                  <div className="flex items-center justify-between gap-2">
                    <span className="whitespace-nowrap tabular-nums">{l.time}</span>

                    {/* Delete button with confirm */}
                    <DeleteButton onDelete={() => deleteTransaction(i)} />
                  </div>
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td colSpan="8" className="py-6 text-center border border-gray-700/20 text-gray-500 italic">
                  No transactions recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
