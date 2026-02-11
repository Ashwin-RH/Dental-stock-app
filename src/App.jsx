import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import PinLogin from "./components/PinLogin";

const AUTO_LOCK_TIME = 600 * 1000; // 10 seconds for testing

export default function App() {
  const [activeAccount, setActiveAccount] = useState(
    localStorage.getItem("activeAccount")
  );

  const selectedAccount = localStorage.getItem("selectedAccount");

  // ⏱ Auto-lock after inactivity
  useEffect(() => {
    if (!activeAccount) return;

    const timer = setTimeout(() => {
      localStorage.removeItem("activeAccount");
      localStorage.removeItem("selectedAccount"); // 👈 important
      setActiveAccount(null);
    }, AUTO_LOCK_TIME);

    return () => clearTimeout(timer);
  }, [activeAccount]);

  // 🟢 First-time login or app unlocked
  if (!selectedAccount || !activeAccount) {
    return (
      <>
        <Toaster position="top-center" />
        <PinLogin
          onSuccess={(accountId) => {
            localStorage.setItem("selectedAccount", accountId);
            localStorage.setItem("activeAccount", accountId);
            setActiveAccount(accountId);
          }}
        />
      </>
    );
  }

  // 🔓 App unlocked
  return (
    <div>
      <Toaster position="top-center" />
      <Home />
    </div>
  );
}
