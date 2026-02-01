import React from "react";

const SHADES = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
const SIZES = ["8mm", "10mm", "12mm", "14mm", "16mm", "18mm", "20mm"];

export default function StockTable({ stock }) {
  return (
    <div className="overflow-auto max-h-[75vh] rounded-xl border border-gray-800 shadow-lg bg-white">
      <table className="w-full border-collapse text-sm">
        
        {/* Header */}
        <thead className="sticky top-0 z-20 bg-gray-200">
          <tr>
            <th className="sticky text-center left-0 z-30 bg-gray-200 px-3 py-2 border border-gray-500/40 font-semibold">
              Size (mm)
            </th>
            {SHADES.map(shade => (
              <th
                key={shade}
                className="px-3 py-2 border border-gray-500/40 font-semibold text-gray-700"
              >
                {shade}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {stock.map(brand => (
            <React.Fragment key={brand.brand}>
              
              {/* Brand Row */}
              <tr className="sticky top-[37px] z-10 bg-gray-300">
  <td colSpan={SHADES.length + 1} className="py-1.5 text-center">
    <span
      className="
        inline-block
        px-15 py-1
        rounded-lg
        border border-gray-400
        bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a]
        text-indigo-100
        font-bold
        tracking-wider
        shadow-xl shadow-gray-600/30
      "
    >
      {brand.brand}
    </span>
  </td>
</tr>


              {/* Size Rows */}
              {SIZES.map(size => (
                <tr
                  key={size}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="sticky text-center left-0 bg-white px-3 py-2 border border-gray-500/30 text-gray-700 font-semibold tracking-wider">
                    {size}
                  </td>

                  {SHADES.map(shade => {
                    const qty = brand.stock?.[size]?.[shade] || 0;
                    const min = brand.minStock?.[size]?.[shade] || 0;

                    let cls =
                      "bg-emerald-200 text-emerald-800 font-semibold";
                    if (qty === 0)
                      cls = "bg-red-200 text-red-900 font-bold";
                    else if (qty <= min)
                      cls = "bg-amber-200 text-amber-900 font-semibold";

                    return (
                      <td
                        key={shade}
                        className={`${cls} px-3 py-2 font-saira font-bold tracking-wider border border-gray-500/20 text-center`}
                      >
                        {qty}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
