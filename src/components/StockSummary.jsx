export default function StockSummary({ stock, totalByBrand, totalStock }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stock.map(b => (
        <div
          key={b.brand}
          className="
            p-4 bg-gray-900
            rounded-lg
            border border-gray-700/60
            cursor-pointer
            transform translate-z-0
            transition-transform duration-300
            hover:scale-[1.01]
            hover:shadow-2xl hover:shadow-blue-600/30
          "
        >
          <div className="text-lg leading-tight font-zalando tracking-wider font-semibold text-gray-200">
            {b.brand}
          </div>

          <div className="mt-2 font-zalando text-gray-500/80">
            Total Units:{" "}
            <span className="text-gray-400 font-semibold">
              {totalByBrand(b.brand)}
            </span>
          </div>
        </div>
      ))}

      <div
        className="
          p-4 bg-gray-900
          rounded-lg
          border border-gray-700/60
          cursor-pointer
          transform translate-z-0
          transition-transform duration-300
          hover:scale-[1.01]
          hover:shadow-2xl hover:shadow-blue-600/30
        "
      >
        <div className="text-gray-500 text-sm">Overall</div>
        <div className="text-lg font-zalando font-semibold text-orange-400">
          Total Stock
        </div>
        <div className="mt-2 text-gray-600">
          <span className="text-gray-400 font-semibold">{totalStock}</span> units
        </div>
      </div>
    </div>
  );
}
