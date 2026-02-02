import { useEffect, useState } from "react";
import { useStockManager } from "../hooks/useStockmanager";
import LogToolbar from "../components/LogToolbar";
import StockTable from "../components/StockTable";
import StockSummary from "../components/StockSummary";
import StockControls from "../components/StockControls";
import TransactionLog from "../components/TransactionLog";
import InwardModal from "../components/InwardModal";
import OutwardModal from "../components/OutwardModal";
import { Download, FunnelPlus, LockKeyhole, OctagonAlert, Printer, Search, Undo2 } from 'lucide-react';
import toast from "react-hot-toast";

export default function Home() {
  const {
    stock,
    logs,
    lastUpdated,
    totalByBrand,
    totalStock,
    lowStockCount,
    addInward,
    addOutward,
    undoLastTransaction,
    getSnapshots,
    refreshStock
  } = useStockManager();

  const [showInward, setShowInward] = useState(false);
  const [showOutward, setShowOutward] = useState(false);
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [shadeFilter, setShadeFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");






  /* ---------- FILTERED STOCK ---------- */
  const filteredStock = stock
    .filter(b => brandFilter === "ALL" || b.brand === brandFilter)
    .filter(b => b.brand.toLowerCase().includes(search.toLowerCase()));

  /* ---------- FILTERED LOGS (DATE + ADVANCED) ---------- */
  const filteredLogs = logs.filter(l => {
    const logTime = new Date(l.time);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const brandMatch = brandFilter === "ALL" || l.brand === brandFilter;
    const shadeMatch = shadeFilter === "ALL" || l.shade === shadeFilter;

    return (
      brandMatch &&
      shadeMatch &&
      (!from || logTime >= from) &&
      (!to || logTime <= to)
    );
  });

  const exportSnapshot = (key) => {
  const data = localStorage.getItem(key);
  if (!data) return toast.error("Snapshot not found");

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${key}.json`;
  a.click();

  URL.revokeObjectURL(url);
};


  /* ---------- EXPORT LOGS AS CSV ---------- */
  const exportLogsAsCSV = () => {
    if (logs.length === 0) return alert("No transactions to export");

    const header = ["Type", "Brand", "Shade", "Qty", "Size", "Time"];
    const csvRows = [header.join(",")];

    filteredLogs.forEach(l => {
      const row = [l.type, l.brand, l.shade, l.qty, l.size, l.time];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transaction_logs.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const printLogs = () => {
  console.log("PRINT BUTTON CLICKED");
  window.print();
};


  return (
    
  <div className="p-6 bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a] mx-auto">
    {/* Header */}
    <h2 className="font-bitcount text-3xl text-center uppercase tracking-widest font-semibold mb-6 text-gray-300">
      SAM Meridian
    </h2>

   <StockSummary stock={stock} totalByBrand={totalByBrand} totalStock={totalStock} />

    {/* Low Stock Alert */}
    {lowStockCount > 0 && (
      <div className="mb-4 p-3 bg-gradient-to-r from-gray-700/20 to-gray-800/20 border border-blue-400/20 text-orange-700 rounded-lg hover:shadow-2xl hover:shadow-gray-900/20 flex items-center gap-2">
        <OctagonAlert className="text-orange-400" /> <span className="font-saira text-orange-200">{lowStockCount}<span className="font-zalando"> Shades Low in Stock</span> </span>
      </div>
    )}

    {/* Controls */}
  <StockControls
  setShowInward={setShowInward}
  setShowOutward={setShowOutward}
  brandFilter={brandFilter}
  shadeFilter={shadeFilter}
  setBrandFilter={setBrandFilter}
  setShadeFilter={setShadeFilter}
  setSearch={setSearch}
  undoLastTransaction={undoLastTransaction}
  logs={logs}
/>

{/* Active Filters */}
<div className="flex flex-wrap gap-2 mb-3">
  {(brandFilter !== "ALL" || shadeFilter !== "ALL") && (
  <span
    onClick={() => {
      setBrandFilter("ALL");
      setShadeFilter("ALL");
      setSearch("");
    }}
    className="px-2 py-1 bg-gray-700/40 text-gray-300 rounded cursor-pointer hover:bg-gray-700/60"
  >
    Clear filters ✕
  </span>
)}


  {shadeFilter !== "ALL" && (
    <span
      onClick={() => setShadeFilter("ALL")}
      className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded cursor-pointer hover:bg-purple-600/30 transition"
    >
      Shade: {shadeFilter} ✕
    </span>
  )}
</div>

{/* Stock Table */}
<div id="print-area">
  <div className="print:block hidden mb-4">
    <h1 className="text-xl font-bold text-center">
      SAM Meridian – Stock & Transaction Report
    </h1>
    <p className="text-sm text-center">
      Generated on: {new Date().toLocaleString()}
    </p>
  </div>

  <div className="overflow-x-auto mb-3">
    <StockTable stock={filteredStock} />
  </div>

  {/* Last Updated */}
  {lastUpdated && (
    <div className="text-sm text-gray-400 mb-4 text-right">
      Last updated: {lastUpdated}
    </div>
  )}

  {/* Transaction Logs */}
  <TransactionLog className="transaction-log" logs={filteredLogs} />
</div>



{/* Log Toolbar */}
<LogToolbar
  logs={filteredLogs}     
  totalLogs={logs}         
  fromDate={fromDate}
  toDate={toDate}
  setFromDate={setFromDate}
  setToDate={setToDate}
  exportLogsAsCSV={exportLogsAsCSV}
  printLogs={printLogs}
  getSnapshots={getSnapshots}
  exportSnapshot={exportSnapshot}
/>


    {/* Modals */}
    {showInward && (
      <InwardModal
        onClose={() => setShowInward(false)}
        onSubmit={addInward}
      />
    )}
    {showOutward && (
      <OutwardModal
        stock={stock}
        onClose={() => setShowOutward(false)}
        onSubmit={addOutward}
      />
    )}
  </div>
);
}
