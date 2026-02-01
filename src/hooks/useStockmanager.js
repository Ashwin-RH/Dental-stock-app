import { useState, useEffect } from "react";

const SHADES = ["A1","A2","A3","B1","B2","B3","C1","C2","C3"];
const SIZES = ["8mm","10mm","12mm","14mm","16mm","18mm","20mm"];

const STORAGE_KEY = "sam-stock-recorder-v1";


const emptySize = () =>
  Object.fromEntries(SHADES.map(s => [s, 0]));

const emptyStock = () =>
  Object.fromEntries(SIZES.map(sz => [sz, emptySize()]));

const initialStock = [
  {
    brand: "Aizir",
    stock: emptyStock(),
    minStock: emptyStock()
  },
  {
    brand: "Superfect",
    stock: emptyStock(),
    minStock: emptyStock()
  }
];

export function useStockManager() {
  const [hydrated, setHydrated] = useState(false);
  const [stock, setStock] = useState(initialStock);
  const [logs, setLogs] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

   const getMonthKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const getSnapshots = () => {
  return Object.keys(localStorage)
    .filter(k => k.startsWith("sam-stock-snapshot-"))
    .sort()
    .reverse();
};

useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      setStock(parsed.stock || initialStock);
      setLogs(parsed.logs || []);
      setLastUpdated(parsed.lastUpdated || null);
    } catch (e) {
      console.error("Failed to load saved stock data");
    }
  }

  setHydrated(true); // ✅ IMPORTANT
}, []);


useEffect(() => {
  if (!lastUpdated) return; // wait until real data exists

  const monthKey = getMonthKey();
  const snapshotKey = `sam-stock-snapshot-${monthKey}`;

  if (!localStorage.getItem(snapshotKey)) {
    const snapshot = {
      month: monthKey,
      createdAt: new Date().toLocaleString(),
      stock,
      logs,
      lastUpdated,
    };

    localStorage.setItem(snapshotKey, JSON.stringify(snapshot));
    console.log(`📦 Snapshot created for ${monthKey}`);
  }
}, [lastUpdated]); // ✅ runs only once per month




useEffect(() => {
  if (!hydrated) return; // ⛔ prevent overwrite on first render

  const data = {
    stock,
    logs,
    lastUpdated,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data, null, 2));
}, [stock, logs, lastUpdated, hydrated]);



  const updateTime = () =>
    setLastUpdated(new Date().toLocaleString());

  /* ---------- HELPERS ---------- */

  const totalByBrand = (brand) => {
  const brandObj = stock.find(b => b.brand === brand);
  if (!brandObj) return 0;

  return Object.values(brandObj.stock).reduce(
    (sum, sizeObj) =>
      sum + Object.values(sizeObj).reduce((a, b) => a + b, 0),
    0
  );
};


  const totalStock = stock.reduce(
    (sum, b) =>
      sum +
      Object.values(b.stock).reduce(
        (s, sizeObj) =>
          s + Object.values(sizeObj).reduce((a, b) => a + b, 0),
        0
      ),
    0
  );

  const lowStockCount = stock.reduce((count, b) => {
    Object.entries(b.stock).forEach(([size, shades]) => {
      Object.entries(shades).forEach(([shade, qty]) => {
        if (qty <= b.minStock[size][shade]) count++;
      });
    });
    return count;
  }, 0);

  /* ---------- INWARD ---------- */

  const addInward = ({ brand, size, shade, quantity }) => {
    const qty = Number(quantity);

    setStock(prev =>
      prev.map(b =>
        b.brand !== brand
          ? b
          : {
              ...b,
              stock: {
                ...b.stock,
                [size]: {
                  ...b.stock[size],
                  [shade]: b.stock[size][shade] + qty
                }
              }
            }
      )
    );

    setLogs(l => [
  {
    type: "IN",
    brand,
    size,
    shade,
    qty,
    time: new Date().toLocaleString()
  },
  ...l
].slice(0, 500)); // keep only last 500 logs


    updateTime();
  };

  /* ---------- OUTWARD ---------- */

  const addOutward = ({ brand, size, shade, quantity }) => {
    const qty = Number(quantity);

    setStock(prev =>
      prev.map(b =>
        b.brand !== brand
          ? b
          : {
              ...b,
              stock: {
                ...b.stock,
                [size]: {
                  ...b.stock[size],
                  [shade]: Math.max(0, b.stock[size][shade] - qty)
                }
              }
            }
      )
    );

    setLogs(l => [
  {
    type: "OUT",
    brand,
    size,
    shade,
    qty,
    time: new Date().toLocaleString()
  },
  ...l
].slice(0, 500));


    updateTime();
  };

   /* ---------- UNDO ---------- */

  const undoLastTransaction = () => {
    if (logs.length === 0) return;
    const last = logs[0];

    setStock(prev =>
      prev.map(b => {
        if (b.brand !== last.brand) return b;

        const current = b.stock[last.size][last.shade];
        const reverted =
          last.type === "IN"
            ? Math.max(0, current - last.qty)
            : current + last.qty;

        return {
          ...b,
          stock: {
            ...b.stock,
            [last.size]: {
              ...b.stock[last.size],
              [last.shade]: reverted
            }
          }
        };
      })
    );

    setLogs(prev => prev.slice(1));
    updateTime();
  };

  return {
    stock,
    logs,
    lastUpdated,
    totalByBrand,
    totalStock,
    lowStockCount,
    addInward,
    addOutward,
    undoLastTransaction,
    getSnapshots
  };
}
