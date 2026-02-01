import { useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";

const SESSION_KEY = "sam-stock-unlocked";

export default function AppLock({ children }) {
  const [pin, setPin] = useState("");
  const [locked, setLocked] = useState(true);
  const savedPin = localStorage.getItem("sam-stock-pin");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setLocked(false);
    }
  }, []);

  const unlock = () => {
    if (pin === savedPin) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setLocked(false);
    } else {
      alert("❌ Wrong PIN");
    }
  };

  if (!savedPin) {
    return (
      <div className="h-screen flex items-center justify-center">
        <form
          onSubmit={e => {
            e.preventDefault();
            localStorage.setItem("sam-stock-pin", pin);
            sessionStorage.setItem(SESSION_KEY, "true");
            setLocked(false);
          }}
          className="flex flex-col gap-3"
        >
          <h2 className="font-bold text-lg">🔐 Set PIN</h2>
          <input
            maxLength={4}
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
            className="border p-2 text-center"
          />
          <button className="bg-black text-white py-2 rounded">
            Save PIN
          </button>
        </form>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <LockKeyhole />
        <input
          maxLength={4}
          value={pin}
          onChange={e => setPin(e.target.value)}
          className="border p-2 text-center mt-3"
        />
        <button
          onClick={unlock}
          className="mt-3 bg-black text-white px-4 py-2 rounded"
        >
          Unlock
        </button>
      </div>
    );
  }

  return children;
}
