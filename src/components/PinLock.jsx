import { useState } from "react";
// import { hashPin } from "../utils/pinHash";
import { loadAccountData } from "../services/cloudStorage";
import toast from "react-hot-toast";

export default function PinLock({ accountId, onUnlock }) {
  const [pin, setPin] = useState("");

  const submitPin = async () => {
  if (pin.length !== 4) {
    toast.error("Enter 4-digit PIN");
    return;
  }

  const data = await loadAccountData(accountId);

  if (data?.pin === pin) {
    localStorage.setItem("activeAccount", accountId);
    onUnlock(accountId);
  } else {
    toast.error("Wrong PIN");
    setPin("");
  }
};



  return (
    <div className="pin-screen">
      <h2>Enter PIN</h2>

      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={pin}
        onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
      />

      <button onClick={submitPin}>Unlock</button>
    </div>
  );
}
