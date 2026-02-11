import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

export default function PinLogin({ onSuccess }) {
  const [pin, setPin] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (pin.length !== 4) {
      toast.error("Enter 4-digit PIN");
      return;
    }

    const accountsSnap = await getDocs(collection(db, "accounts"));
    let matchedAccount = null;

    accountsSnap.forEach(docSnap => {
      if (docSnap.data().pin === pin) {
        matchedAccount = docSnap.id;
      }
    });

    if (!matchedAccount) {
      toast.error("Wrong PIN");
      return;
    }

    localStorage.setItem("selectedAccount", matchedAccount);
    localStorage.setItem("activeAccount", matchedAccount);

    toast.success("Login successful");
    onSuccess(matchedAccount);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      {/* Responsive title */}
      <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-10 text-center select-none">
        SAN Meridian
      </h1>

      <div className="bg-white/10 backdrop-blur-md border border-gray-700 rounded-2xl p-8 w-full max-w-sm shadow-lg flex flex-col items-center">
        <h2 className="text-white text-xl sm:text-2xl font-semibold mb-6 tracking-wide text-center select-none">
          Enter Your PIN
        </h2>

        <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
          <input
            type="password"
            placeholder="●●●●"
            value={pin}
            maxLength={4}
            onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
            className="w-full text-center text-xl sm:text-2xl tracking-widest px-3 py-2 rounded-xl bg-gray-800/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-500"
          />

          <button
            type="submit"
            className="w-full mt-5 py-3 rounded-xl bg-blue-800/40 hover:bg-gray-200 transition text-white hover:text-gray-800 font-medium text-lg shadow-md tracking-widest cursor-pointer"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
