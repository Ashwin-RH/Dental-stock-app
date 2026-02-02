import { ArrowDown, ArrowUp, FunnelPlus, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";

function UndoButton({ undoLastTransaction, logs }) {
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
    undoLastTransaction();
    setConfirm(false);
  };

  return (
    <div className="relative group inline-block">
      <button
        onClick={handleClick}
        disabled={logs.length === 0}
        className={`
          border px-4 py-2 rounded-lg transform-gpu active:scale-95
          transition-all duration-300 cursor-pointer flex items-center justify-center
          ${confirm
            ? "border-red-500 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
            : "border-gray-600 bg-gray-800/50 text-blue-400 hover:text-blue-300 hover:scale-105"}
          ${logs.length === 0 && "opacity-40 cursor-not-allowed"}
        `}
      >
        {confirm ? "Confirm?" : <Undo2 className="w-5 h-5" />}
      </button>

      <span
        className={`
          pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2
          rounded-md bg-black px-2 py-1 text-xs text-white whitespace-nowrap
          transition-opacity duration-200
          ${confirm ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
      >
        {confirm ? "Click again to undo" : "Undo last transaction"}
      </span>
    </div>
  );
}


export default function StockControls({
  setShowInward,
  setShowOutward,
  brandFilter,
  shadeFilter,
  setBrandFilter,
  setShadeFilter,
  setSearch,
  undoLastTransaction,
  logs
}) {

  


  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center justify-center">
      <button
  className="group flex gap-2 border border-gray-600 bg-gray-800/50
             text-sm text-blue-400 px-4 py-2 rounded-lg
             hover:bg-green-500 hover:text-white
             cursor-pointer duration-500 transition-all transform-gpu outline-none"
  onClick={() => setShowInward(true)}
>
  Inward
  <ArrowDown className="w-5 h-5 text-green-400 group-hover:text-gray-100 duration-500" />
</button>

<button
  className="group flex gap-2 border border-gray-600 bg-gray-800/50
             text-sm text-blue-400 px-4 py-2 rounded-lg
             hover:bg-red-500 hover:text-white
             cursor-pointer duration-500 transition-all transform-gpu outline-none"
  onClick={() => setShowOutward(true)}
>
  Outward
  <ArrowUp className="w-5 h-5 text-red-400 group-hover:text-gray-200 duration-500" />
</button>


      <UndoButton
  undoLastTransaction={undoLastTransaction}
  logs={logs}
/>



      {/* Filters */}
<select
  value={brandFilter}
  onChange={e => setBrandFilter(e.target.value)}
  className="cursor-pointer border border-gray-600 bg-gray-800/50 text-blue-400 rounded-lg px-3 py-1.5 focus:outline-none"
>
  <option className="bg-white text-black" value="ALL">All Brands</option>
  <option className="bg-white text-black" value="Aizir">Aizir</option>
  <option className="bg-white text-black" value="SHTC">SHTC</option>
  <option className="bg-white text-black" value="SHTW">SHTW</option>
</select>


<select
  value={shadeFilter}
  onChange={e => setShadeFilter(e.target.value)}
  className="cursor-pointer border border-gray-600 bg-gray-800/50 text-blue-400 rounded-lg px-3 py-1.5 focus:outline-none"
>
  <option className="bg-white text-black" value="ALL">All Shades</option>
  <option className="bg-white text-black">A1</option>
  <option className="bg-white text-black">A2</option>
  <option className="bg-white text-black">A3</option>
  <option className="bg-white text-black">A3.5</option>
  <option className="bg-white text-black">B1</option>
  <option className="bg-white text-black">B2</option>
  <option className="bg-white text-black">B3</option>
  <option className="bg-white text-black">C1</option>
  <option className="bg-white text-black">C2</option>
  <option className="bg-white text-black">C3</option>
  <option className="bg-white text-black">D2</option>
  <option className="bg-white text-black">D3</option>
  <option className="bg-white text-black">D4</option>
</select>


    <div className="relative w-fit">
  <input
    type="text"
    placeholder="Search Brand..."
    onChange={e => setSearch(e.target.value)}
    className="border border-blue-500/40 placeholder:text-gray-400 bg-transparent
               focus:outline-none text-gray-200 focus:ring focus:ring-blue-500/30
               duration-500 rounded-lg pl-3 pr-9 py-1"
  />

  <FunnelPlus
    className="absolute right-2 top-1/2 -translate-y-1/2
               text-blue-400 w-4 h-4 pointer-events-none"
  />
</div>


    </div>
  );
}
