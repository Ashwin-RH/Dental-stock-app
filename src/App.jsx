import AppLock from "./components/AppLock";
import {Toaster} from "react-hot-toast";
import Home from "./pages/Home";

export default function App() {
  return (
    <div>
      <Toaster position="top-center" />
      {/* <AppLock> */}
      <Home />
      {/* </AppLock> */}
    </div>
  );
}
