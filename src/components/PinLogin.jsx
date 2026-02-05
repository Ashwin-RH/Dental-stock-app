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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="bg-white/10 backdrop-blur-md border border-gray-700 rounded-2xl mx-4 p-8 w-80 shadow-lg flex flex-col items-center">
        <h2 className="text-white text-xl font-semibold mb-6 tracking-wide">
          Enter Your PIN
        </h2>

        <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
          <input
            type="password"
            placeholder="●●●●"
            value={pin}
            maxLength={4}
            onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
            className="w-full text-center text-xl tracking-widest px-3 py-2 rounded-xl bg-gray-800/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 duration-500 transition"
          />

          <button
            type="submit"
            className="w-full mt-5 py-2 font-zalando tracking-widest cursor-pointer rounded-xl bg-blue-800/30 hover:bg-gray-200 active:bg-blue-700 transition text-white hover:text-gray-800 font-medium text-lg shadow-md"
          >
            Unlock
          </button>
        </form>

        
      </div>
    </div>
  );
}
