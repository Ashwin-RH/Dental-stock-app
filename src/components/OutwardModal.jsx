import { X } from "lucide-react";
import { useState, useEffect } from "react";

const BRANDS = ["Aizir", "Superfect"];
const SHADES = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
const SIZES = ["8mm", "10mm", "12mm", "14mm", "16mm", "18mm", "20mm"];

export default function OutwardModal({ onClose, onSubmit, stock }) {
  const [form, setForm] = useState({
    brand: "Aizir",
    shade: "A1",
    size: "8mm",
    clinic: "",
    doctor: "",
    caseId: "",
    quantity: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const availableQty =
      stock
        .find(b => b.brand === form.brand)
        ?.stock?.[form.size]?.[form.shade] ?? 0;

    if (!form.quantity || form.quantity <= 0) {
      alert("Enter a valid quantity");
      return;
    }

    if (Number(form.quantity) > availableQty) {
      alert(`Not enough stock. Available: ${availableQty}`);
      return;
    }

    onSubmit(form);
  };

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
            className="w-full border border-blue-600 text-gray-200 rounded px-3 py-1 focus:outline-none cursor-pointer"
          >
            {SHADES.map(s => <option key={s} className="text-gray-800 bg-gray-200">{s}</option>)}
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
          placeholder="Clinic / Lab Name"
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
        <p className="text-xs text-gray-300 mb-2">
          Available: {stock.find(b => b.brand === form.brand)?.stock?.[form.size]?.[form.shade] ?? 0}
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
            className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer border border-red-700"
          >
            Dispatch
          </button>
        </div>
      </form>
    </div>
  );
}
