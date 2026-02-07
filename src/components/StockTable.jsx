import React from "react";

const SHADES = ["A1", "A2", "A3", "A3.5", "B1", "B2", "B3", "C1", "C2", "C3","D2","D3","D4"];
const SIZES = ["10mm", "12mm", "14mm", "16mm", "18mm", "20mm","22mm","25mm"];


export default function StockTable({ stock }) {
  return (
    <div className="overflow-x-auto no-scrollbar max-h-screen rounded-xl border border-gray-800 shadow-lg bg-white">
      <table className="w-full border-collapse text-xs sm:text-sm">
        {/* Header */}
        <thead className="sticky top-0 z-20 bg-gray-200">
          <tr>
            <th className="sticky text-center left-0 z-30 bg-gray-200 px-2 sm:px-3 py-1 sm:py-2 border border-gray-500/40 font-semibold">
              Size (mm)
            </th>
            {SHADES.map(shade => (
              <th
                key={shade}
                className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-500/40 font-semibold text-gray-700"
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
        <td colSpan={SHADES.length + 1} className="py-1 text-center">
          <span className="inline-block px-3 py-1 rounded-lg border border-gray-400
            bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a]
            text-indigo-100 font-bold tracking-wider shadow-xl text-xs sm:text-base">
            {brand.brand}
          </span>
        </td>
      </tr>

      {/* Size Rows */}
      {SIZES.map(size => (
        <tr key={size}>
          {/* Size cell */}
          <td className="sticky left-0 bg-white px-2 py-1 border border-gray-400 font-semibold text-center">
            {size}
          </td>

          {/* Stock cells */}
          {brand.brand === "SHTW" ? (
            <td
              colSpan={SHADES.length}
              className={`${
                (() => {
                  const qty = brand.stock?.[size] || 0;
                  const min = brand.minStock?.[size] || 0;

                  if (qty === 0) return "bg-red-200 text-red-900";
                  if (qty <= min) return "bg-amber-200 text-amber-900";
                  return "bg-emerald-200 text-emerald-800";
                })()
              } px-2 py-1 text-center font-saira border border-gray-400 font-bold`}
            >
              {brand.stock?.[size] || "-"}
            </td>
          ) : (
            SHADES.map(shade => {
              const qty = brand.stock?.[size]?.[shade] || 0;
              const min = brand.minStock?.[size]?.[shade] || 0;

              let cls = "bg-emerald-200 text-emerald-800";
              if (qty === 0) cls = "bg-red-200 text-red-900";
              else if (qty < min) cls = "bg-amber-200 text-amber-900";

              return (
                <td
                  key={shade}
                  className={`${cls} px-2 py-1 font-saira text-center border border-gray-500/40 font-bold`}
                >
                  {qty === 0 ? "-" : qty}
                </td>
              );
            })
          )}
        </tr>
      ))}
    </React.Fragment>
  ))}
</tbody>

      </table>
    </div>
  );
}
