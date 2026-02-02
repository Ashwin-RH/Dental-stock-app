import { X } from "lucide-react";
import { useState, useEffect } from "react";

const BRANDS = ["Aizir", "SHTC", "SHTW"];
const SHADES = ["A1", "A2", "A3", "A3.5", "B1", "B2", "B3", "C1", "C2", "C3","D2","D3","D4"];
const SIZES = ["10mm", "12mm", "14mm", "16mm", "18mm", "20mm","22mm","25mm"];

export default function InwardModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    brand: "Aizir",
    shade: "A1",
    size: "10mm",
    supplier: "",
    batch: "",
    expiry: "",
    quantity: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.quantity || form.quantity <= 0) {
      alert("Enter a valid quantity");
      return;
    }
    onSubmit(form);
    onClose();
  };

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [onClose]);
  

  return (
    <div className="fixed inset-0 bg-black/40 focus:outline-none flex items-center justify-center z-50">
      <form
  onSubmit={(e) => {
    e.preventDefault();
    handleSubmit();
  }}
  className="bg-gradient-to-t border-2 border-gray-600 from-[#0f172a] via-[#1e1a78] to-[#0f172a] w-80 p-6 rounded-lg shadow-lg"
>

        <h3 className="flex items-center justify-between text-lg font-semibold mb-4 text-gray-200">
          Add Inward Stock
          <X className="text-gray-100 bg-red-500 border border-gray-700 hover:scale-[1.02] rounded-lg w-7 h-7 cursor-pointer" onClick={onClose} />
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
            {BRANDS.map((b) => (
              <option className="text-gray-800 bg-gray-200"  key={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Shade */}
        <div className="mb-3">
          <label className="block text-sm text-gray-300 font-medium mb-1">Shade</label>
          <select
            name="shade"
            value={form.shade}
            onChange={handleChange}
            className="w-full border border-blue-600 text-gray-200 rounded px-3 py-1 focus:outline-none cursor-pointer"
          >
            {SHADES.map((s) => (
              <option className="text-gray-800 bg-gray-200" key={s}>{s}</option>
            ))}
          </select>
        </div>

        <label className="block text-sm text-gray-300 font-medium mb-1">Size</label>
        <select
          name="size"
          value={form.size}
          onChange={handleChange}
          className="w-full border border-blue-600 text-gray-200 rounded px-3 py-1 mb-3 focus:outline-none cursor-pointer"
        >
          {SIZES.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {/* Supplier */}
        <input
          name="supplier"
          placeholder="Supplier Name"
          value={form.supplier}
          onChange={handleChange}
          className="w-full border border-blue-600 text-gray-200 rounded px-3 py-1 mb-3 focus:outline-none"
        />

        {/* Batch */}
        <input
          name="batch"
          placeholder="Batch Number"
          value={form.batch}
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
          className="w-full border border-blue-600 text-gray-200 rounded px-3 py-1 mb-4 focus:outline-none"
        />

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
            className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer border border-green-700"
          >
            Save
          </button>

        </div>
      </form>
    </div>
  );
}
