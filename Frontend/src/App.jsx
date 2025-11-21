import { Routes, Route, Link } from "react-router-dom";
import Chain from "./pages/Chain";
import Payment from "./pages/Payment";
import Auth from "./pages/Auth";
import NavBar from "./Components/NavBar";
import { AppProvider } from "./Context/ChainContext";
import Home from "./pages/Home";
import DetailTrans from "./pages/DetailTrans";
import Search from "./pages/Search";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
      <AppProvider>

    <div>
      <NavBar/>
        <ToastContainer />
      {/* Routes */}
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home />} />
        <Route path="/detailTran/:id" element={<DetailTrans />} />
        <Route path="/search" element={<Search />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/chain" element={<Chain />} />
      </Routes>
    </div>
      </AppProvider>
  );
}

export default App;
