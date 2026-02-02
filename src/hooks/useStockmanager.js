import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const SHADES = ["A1","A2","A3","A3.5","B1","B2","B3","C1","C2","C3"];
const SIZES = ["8mm","10mm","12mm","14mm","16mm","18mm","20mm"];
const SHTW_SIZES = ["10mm","12mm","14mm","16mm","18mm","20mm","22mm","25mm"];


const STORAGE_KEY = "sam-stock-recorder-v1";



const emptySize = () =>
  Object.fromEntries(SHADES.map(s => [s, 0]));

const emptyStock = () =>
  Object.fromEntries(SIZES.map(sz => [sz, emptySize()]));

const emptySizeOnlyStock = () =>
  Object.fromEntries(SHTW_SIZES.map(sz => [sz, 0]));


const initialStock = [
  {
    brand: "Aizir",
    stock: emptyStock(),
    minStock: emptyStock()
  },
  {
    brand: "SHTC",
    stock: emptyStock(),
    minStock: emptyStock()
  },
  {
  brand: "SHTW",
  type: "SIZE_ONLY",
  stock: emptySizeOnlyStock(),
  minStock: emptySizeOnlyStock()
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

 // ✅ Refresh stock state function
  const refreshStock = (data) => {
    if (data) {
      setStock(data.stock || initialStock);
      setLogs(data.logs || []);
      setLastUpdated(data.lastUpdated || null);
    } else {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      setStock(saved?.stock || initialStock);
      setLogs(saved?.logs || []);
      setLastUpdated(saved?.lastUpdated || null);
    }
  };


useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);

      // 🔥 REMOVE Superfect HERE (ONCE)
      const cleanedStock = (parsed.stock || initialStock)
        .filter(b => b.brand !== "Superfect");

      const cleanedData = {
        ...parsed,
        stock: cleanedStock
      };

      // 🔥 WRITE CLEAN DATA BACK
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cleanedData, null, 2)
      );

      // 🔥 HYDRATE STATE WITH CLEAN DATA
      setStock(cleanedStock);
      setLogs(parsed.logs || []);
      setLastUpdated(parsed.lastUpdated || null);

    } catch (e) {
      console.error("Failed to load saved stock data", e);
      setStock(initialStock);
    }
  }

  setHydrated(true);
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

  if (brandObj.type === "SIZE_ONLY") {
    return Object.values(brandObj.stock).reduce((a, b) => a + b, 0);
  }

  return Object.values(brandObj.stock).reduce(
    (sum, sizeObj) =>
      sum + Object.values(sizeObj).reduce((a, b) => a + b, 0),
    0
  );
};



const totalStock = stock.reduce((sum, b) => {
  if (b.type === "SIZE_ONLY") {
    return sum + Object.values(b.stock).reduce((a, c) => a + c, 0);
  }

  return (
    sum +
    Object.values(b.stock).reduce(
      (s, sizeObj) =>
        s + Object.values(sizeObj).reduce((a, b) => a + b, 0),
      0
    )
  );
}, 0);


const lowStockCount = stock.reduce((count, b) => {
  if (b.type === "SIZE_ONLY") {
    Object.entries(b.stock).forEach(([size, qty]) => {
      if (qty <= b.minStock[size]) count++;
    });
    return count;
  }

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
    prev.map(b => {
      if (b.brand !== brand) return b;

      // 🔹 SHTW
      if (b.type === "SIZE_ONLY") {
        return {
          ...b,
          stock: {
            ...b.stock,
            [size]: b.stock[size] + qty
          }
        };
      }

      // 🔹 Normal brands
      return {
        ...b,
        stock: {
          ...b.stock,
          [size]: {
            ...b.stock[size],
            [shade]: (b.stock[size][shade] || 0) + qty
          }
        }
      };
    })
  );

  setLogs(l => [
    { type: "IN", brand, size, shade: shade || "-", qty, time: new Date().toLocaleString() },
    ...l
  ].slice(0, 500));

  updateTime();
};


  /* ---------- OUTWARD ---------- */

  const addOutward = ({ brand, size, shade, quantity }) => {
  const qty = Number(quantity);

  setStock(prev =>
    prev.map(b => {
      if (b.brand !== brand) return b;

      if (b.type === "SIZE_ONLY") {
        return {
          ...b,
          stock: {
            ...b.stock,
            [size]: Math.max(0, b.stock[size] - qty)
          }
        };
      }

      return {
        ...b,
        stock: {
          ...b.stock,
          [size]: {
            ...b.stock[size],
            [shade]: Math.max(0, (b.stock[size][shade] || 0) - qty)
          }
        }
      };
    })
  );

  setLogs(l => [
    { type: "OUT", brand, size, shade: shade || "-", qty, time: new Date().toLocaleString() },
    ...l
  ].slice(0, 500));

  updateTime();
};

/* ---------- DELETE TRANSACTION ---------- */
const deleteTransaction = (index) => {
  const txn = logs[index];
  if (!txn) return;

  setStock(prev =>
    prev.map(b => {
      if (b.brand !== txn.brand) return b;

      // 🔹 SHTW (SIZE_ONLY)
      if (b.type === "SIZE_ONLY") {
        const current = b.stock[txn.size] || 0;
        const reverted = txn.type === "IN"
          ? Math.max(0, current - txn.qty)
          : current + txn.qty;

        return {
          ...b,
          stock: {
            ...b.stock,
            [txn.size]: reverted
          }
        };
      }

      // 🔹 Normal brands
      const current = b.stock[txn.size][txn.shade] || 0;
      const reverted = txn.type === "IN"
        ? Math.max(0, current - txn.qty)
        : current + txn.qty;

      return {
        ...b,
        stock: {
          ...b.stock,
          [txn.size]: {
            ...b.stock[txn.size],
            [txn.shade]: reverted
          }
        }
      };
    })
  );

  // Remove the log
  setLogs(prev => prev.filter((_, i) => i !== index));
  updateTime();

  //show toast
   toast.success(`Transaction deleted: ${txn.type} ${txn.qty} ${txn.brand} ${txn.size}${txn.shade !== "-" ? `-${txn.shade}` : ""}`);
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
    deleteTransaction,
    getSnapshots,
    refreshStock
  };
}
