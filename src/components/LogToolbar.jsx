import { Download, Printer, Calendar, Package } from "lucide-react";

export default function LogToolbar({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  exportLogsAsCSV,
  printLogs,
  getSnapshots,
  exportSnapshot,
  logs = [],
  totalLogs = []
}) {
  const disabled = totalLogs.length === 0;
  const snapshots = getSnapshots();
  const visible = snapshots.slice(0, 4); // show first 4
  const hidden = snapshots.slice(4);     // rest go into dropdown

  function SnapshotChip({ snapshotKey, onExport }) {
    return (
      <button
        onClick={() => onExport(snapshotKey)}
        className="px-3 py-1 text-xs sm:text-sm font-medium rounded-full
          bg-blue-500/10 border border-blue-500/30
          text-blue-300 hover:bg-blue-500/20 transition whitespace-nowrap"
      >
        <Package className="w-4 h-4 text-yellow-400/80 mr-1 inline" /> {snapshotKey.replace("sam-stock-snapshot-", "")}
      </button>
    );
  }

  return (
    <div className="mb-6 space-y-4">

      {/* Date Filter */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end bg-gray-900/40 border border-gray-700 rounded-xl p-4">
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-xs text-gray-400 mb-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-gray-900/60 placeholder:text-gray-400 border border-blue-500/20 rounded-xl px-4 py-2
              text-blue-100 outline-none transition-all duration-300
              focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40 w-full sm:w-auto"
            style={{ colorScheme: "dark" }}
          />
        </div>

        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-xs text-gray-400 mb-1">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-gray-900/60 border border-blue-500/20 rounded-xl px-4 py-2
              text-blue-100 outline-none transition-all duration-300
              focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40 w-full sm:w-auto"
            style={{ colorScheme: "dark" }}
          />
        </div>

        <span className="text-xs text-gray-500 italic w-full sm:w-auto">
          Filters apply to exports & print
        </span>
      </div>

      {/* Empty range message */}
      {logs.length === 0 && totalLogs.length > 0 && (
        <p className="text-xs text-amber-400 italic px-1">
          No transactions in selected date range
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 sm:gap-4 items-center">

        {/* Export CSV */}
        <button
          disabled={disabled}
          onClick={exportLogsAsCSV}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all w-full sm:w-auto justify-center
            ${disabled
              ? "opacity-40 cursor-not-allowed border-gray-700"
              : "bg-gray-800/50 border-blue-600/40 hover:shadow-xl hover:shadow-blue-900/40 cursor-pointer"
            }`}
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-200">Export CSV</span>
        </button>

        {/* Print */}
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border
                     bg-gray-800/50 border-green-600/40 hover:shadow-xl hover:shadow-green-900/40
                     cursor-pointer w-full sm:w-auto justify-center"
        >
          <Printer className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-200">Print</span>
        </button>

        {/* Snapshots */}
        <div className="flex flex-wrap gap-2 ml-auto w-full sm:w-auto">
          {visible.map(key => (
            <SnapshotChip key={key} snapshotKey={key} onExport={exportSnapshot} />
          ))}

          {hidden.length > 0 && (
            <details className="relative" onClick={(e) => e.currentTarget.removeAttribute("open")}>
              <summary className="cursor-pointer text-xs text-red-400">
                +{hidden.length} more
              </summary>

              <div className="absolute right-0 bottom-full mb-2 w-48
                             bg-gray-900 border border-gray-700
                             rounded-xl p-2 space-y-1 z-20"
              >
                {hidden.map(key => (
                  <SnapshotChip key={key} snapshotKey={key} onExport={exportSnapshot} />
                ))}
              </div>
            </details>
          )}
        </div>

      </div>
    </div>
  );
}
