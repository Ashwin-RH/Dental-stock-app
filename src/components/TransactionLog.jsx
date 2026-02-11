import { useState, useEffect } from "react";
import { Trash2, ArrowUp, FunnelPlus } from "lucide-react";

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
    </div>
  );
}

export default function TransactionLog({ logs, deleteTransaction }) {
  const logsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState([]); // IN / OUT
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Scroll-to-top button
  const [showTopButton, setShowTopButton] = useState(false);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById("logsTableContainer");
      if (!container) return;
      setShowTopButton(container.scrollTop > 300);
    };
    const container = document.getElementById("logsTableContainer");
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setFilterType([]);
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // Filtered logs
  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      l.brand.toLowerCase().includes(search.toLowerCase()) ||
      (l.clinic || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.shade || "").toLowerCase().includes(search.toLowerCase());

    const matchType = filterType.length > 0 ? filterType.includes(l.type) : true;

    const logDate = new Date(l.time);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchDate = (!start || logDate >= start) && (!end || logDate <= end);

    return matchSearch && matchType && matchDate;
  });

  // Pagination
  const indexOfLast = currentPage * logsPerPage;
  const indexOfFirst = indexOfLast - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const scrollToTop = () => {
    const container = document.getElementById("logsTableContainer");
    container?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="logsTable" className="mt-6">
      <h3 className="text-lg text-gray-200 font-semibold mb-2 tracking-wide">
        Transaction History
      </h3>
<div className="flex flex-wrap items-center justify-center gap-3 mb-4">
  {/* Search Input */}
  <div className="relative w-full sm:w-80 md:w-96 flex">
    <input
      type="text"
      placeholder="Search by brand, clinic, shade..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full border border-blue-500/40 placeholder:text-gray-400 bg-gray-900/20
                 focus:outline-none text-gray-200 focus:ring focus:ring-blue-500/30
                 duration-500 rounded-lg pl-3 pr-10 py-2 sm:py-1"
    />
    <FunnelPlus
      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5 pointer-events-none"
    />
  </div>

  {/* Type Filter */}
  <div className="flex flex-wrap gap-2 px-2 w-full sm:w-auto justify-center">
    {["IN", "OUT"].map((type) => (
      <button
        key={type}
        onClick={() => {
          if (filterType.includes(type)) {
            setFilterType(filterType.filter((t) => t !== type));
          } else {
            setFilterType([...filterType, type]);
          }
        }}
        className={`
          px-3 py-1.5 text-sm font-semibold transition-all duration-300 cursor-pointer
          ${type === "IN"
            ? filterType.includes("IN")
              ? "bg-green-700 text-white border border-gray-700 shadow-xl shadow-gray-900/40 rounded-lg"
              : "bg-gray-800/50 text-emerald-400 border border-emerald-400 hover:bg-emerald-500/20 hover:text-white rounded-md"
            : filterType.includes("OUT")
            ? "bg-red-800 text-white border border-gray-800 shadow-xl shadow-gray-900/40 rounded-lg"
            : "bg-gray-800/50 text-red-400 border border-red-400 hover:bg-red-500/20 hover:text-white rounded-md"
          }
        `}
      >
        {type}
      </button>
    ))}
  </div>

  {/* Date Filters */}
  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
    <input
      type="date"
      value={startDate}
      onChange={(e) => {
        setStartDate(e.target.value);
      }}
      className="bg-gray-800/60 placeholder:text-gray-400 border border-blue-500/40 rounded-lg px-4 py-1.5
        text-blue-100 outline-none transition-all duration-300
        focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40 w-full sm:w-auto"
      style={{ colorScheme: "dark" }}
    />
    <input
      type="date"
      value={endDate}
      onChange={(e) => {
        setEndDate(e.target.value);
      }}
      className="bg-gray-800/60 border border-blue-500/40 rounded-lg px-4 py-1.5
        text-blue-100 outline-none transition-all duration-300
        focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40 w-full sm:w-auto"
      style={{ colorScheme: "dark" }}
    />
  </div>

  {/* Clear Filters */}
  <button
    onClick={clearFilters}
    className="w-full sm:w-auto px-3 py-1.5 bg-gray-900/20 hover:bg-red-800/35 cursor-pointer border border-blue-600 hover:border-red-700 text-white rounded-lg transition-all"
  >
    Clear Filters
  </button>
</div>

  


      {/* Scrollable Table */}
      <div
        id="logsTableContainer"
        className="overflow-x-auto border no-scrollbar border-gray-700 rounded-xl shadow-lg backdrop-blur bg-gray-900/40 mb-2 max-h-[450px] relative"
      >
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
            {currentLogs.map((l, i) => (
              <tr
                key={i}
                className="border-t border-gray-800 hover:bg-gray-800/60 transition-colors"
              >
                <td className="py-2 px-3 border border-gray-700/20 text-gray-400">
                  {filteredLogs.length - (indexOfFirst + i)}
                </td>
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
                    <DeleteButton onDelete={() => deleteTransaction(indexOfFirst + i)} />
                  </div>
                </td>
              </tr>
            ))}
            {currentLogs.length === 0 && (
              <tr>
                <td colSpan="8" className="py-6 text-center border border-gray-700/20 text-gray-500 italic">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Scroll-to-top button */}
        {/* {showTopButton && (
          <button
            onClick={scrollToTop}
            className="absolute bottom-2 right-2 p-2 rounded-full bg-gray-700/70 text-white hover:bg-gray-600 transition-all"
            title="Scroll to top"
          >
            <ArrowUp className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4" />
          </button>
        )} */}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-2 mb-4 sticky bottom-3 bg-gray-900/70 backdrop-blur-[1px] border border-gray-700/70 py-2 rounded-lg z-20">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 rounded border border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>
        <span className="px-3 py-1 text-gray-200">{currentPage} / {totalPages || 1}</span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 rounded border border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
