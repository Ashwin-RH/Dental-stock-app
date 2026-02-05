import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import PinLogin from "./components/PinLogin";
import PinLock from "./components/PinLock";

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


  // 🟢 1. First-time login (no account chosen)
  if (!selectedAccount) {
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

  // 🔒 2. Account selected but locked
  if (!activeAccount) {
    return (
      <>
        <Toaster position="top-center" />
        <PinLock
          accountId={selectedAccount}
          onUnlock={() => {
            localStorage.setItem("activeAccount", selectedAccount);
            setActiveAccount(selectedAccount);
          }}
        />
      </>
    );
  }

  // 🔓 3. App unlocked
  return (
    <div>
      <Toaster position="top-center" />
      <Home />
    </div>
  );
}
