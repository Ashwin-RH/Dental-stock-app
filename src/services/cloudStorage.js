import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const loadAccountData = async (accountId) => {
  if (!accountId) return null; // ✅ GUARD

  const ref = doc(db, "accounts", accountId);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data() : null;
};

export const saveAccountData = async (accountId, data) => {
  if (!accountId) return; // ✅ GUARD

  const ref = doc(db, "accounts", accountId);
  await setDoc(ref, data, { merge: true });
};
