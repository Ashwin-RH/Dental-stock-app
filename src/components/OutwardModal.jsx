import { X } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const BRANDS = ["Aizir", "SHTC", "SHTW"];
const SHADES = ["-", "A1", "A2", "A3", "A3.5", "B1", "B2", "B3", "C1", "C2", "C3","D2","D3","D4"];
const SIZES = ["10mm", "12mm", "14mm", "16mm", "18mm", "20mm","22mm","25mm"];

export default function OutwardModal({ onClose, onSubmit, stock }) {
  const [form, setForm] = useState({
    brand: "Aizir",
    shade: "A1",
    size: "10mm",
    clinic: "",
    doctor: "",
    caseId: "",
    quantity: ""
  });

  const isSizeOnly =
  stock.find(b => b.brand === form.brand)?.type === "SIZE_ONLY";


  const getAvailableQty = () => {
  const brandObj = stock.find(b => b.brand === form.brand);
  if (!brandObj) return 0;

  if (brandObj.type === "SIZE_ONLY") {
    return brandObj.stock?.[form.size] ?? 0;
  }

  return brandObj.stock?.[form.size]?.[form.shade] ?? 0;
};


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = () => {
  
  const availableQty = getAvailableQty();
  const qty = Number(form.quantity);

if (!qty || qty <= 0) {
  toast.error("Enter a valid quantity");
  return;
}

if (qty > availableQty) {
  toast.error(`Not enough stock. Available: ${availableQty}`);
  return;
}

onSubmit({ ...form, quantity: qty });
onClose();

};


useEffect(() => {
  setForm(f => {
    const brandObj = stock.find(b => b.brand === f.brand);
    const isSizeOnly = brandObj?.type === "SIZE_ONLY";

    return {
      ...f,
      shade: isSizeOnly ? "-" : f.shade === "-" ? "A1" : f.shade
    };
  });
}, [form.brand, stock]);




  // ESC listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="bg-gradient-to-t border-2 border-gray-600 from-[#0f172a] via-[#1e1a78] to-[#0f172a] w-80 p-6 rounded-lg shadow-lg"
      >
        <h3 className="flex items-center justify-between text-lg font-semibold mb-4 text-gray-200">
          Dispatch Stock (Outward)
          <X
            className="text-gray-100 bg-red-500 border border-gray-700 hover:scale-[1.02] rounded-lg w-7 h-7 cursor-pointer"
            onClick={onClose}
          />
        </h3>

        {/* Brand */}
        <div className="mb-3">
          <label className="block text-sm text-gray-300 font-medium mb-1">Brand</label>
          <select
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full border border-blue-600 text-gray-200 rounded px-3 py-1 focus:outline-none cursor-pointer"
          >
            {BRANDS.map(b => <option key={b} className="text-gray-800 bg-gray-200">{b}</option>)}
          </select>
        </div>

        {/* Shade */}
        <div className="mb-3">
          <label className="block text-sm text-gray-300 font-medium mb-1">Shade</label>
          <select
            name="shade"
            value={form.shade}
            onChange={handleChange}
            disabled={isSizeOnly}
            className={`w-full border border-blue-600 text-gray-200 rounded px-3 py-1 focus:outline-none cursor-pointer
              ${isSizeOnly ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {SHADES.map(s => (
              <option key={s} className="text-gray-800 bg-gray-200">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <label className="block text-sm text-gray-300 font-medium mb-1">Size</label>
        <select
          name="size"
          value={form.size}
          onChange={handleChange}
          className="w-full border border-blue-600 text-gray-200 rounded px-3 py-1 mb-3 focus:outline-none cursor-pointer"
        >
          {SIZES.map(s => <option key={s} className="text-gray-800 bg-gray-200">{s}</option>)}
        </select>

        {/* Clinic */}
        <input
          name="clinic"
          placeholder="Lab Name"
          value={form.clinic}
          onChange={handleChange}
          className="w-full border border-blue-600 text-gray-200 rounded px-3 py-1 mb-3 focus:outline-none"
        />

        {/* Quantity */}
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="w-full border border-blue-600 text-gray-200 rounded px-3 py-1 mb-1 focus:outline-none"
        />
        <p className="text-sm border border-gray-700/70 shadow-xl shadow-blue-600/10 rounded-lg mx-15 text-center text-orange-300 mb-2">
          Available: {getAvailableQty()}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-gray-700 text-gray-200 rounded border border-gray-600 hover:bg-gray-600 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={getAvailableQty() === 0}
            className={`px-4 py-1 rounded border
              ${getAvailableQty() === 0
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700 border-red-700"}`}
          >
            Dispatch
          </button>
        </div>
      </form>
    </div>
  );
}
