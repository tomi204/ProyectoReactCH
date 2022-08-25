import "./App.css";
import Home from "./components/Home/Home";
import {
  BrowserRouter as Router,
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import Navbar from "./components/Header/Navbar";
import NavL from "./components/Lateralnav/NavL";
import Productos from "./components/Productos/Productos";
import Cart from "./components/CartItems/Cart";
import ProductDetails from "./components/Productos/ProductDetails";
import CartContextProvider from "./components/CartItems/CartContext";
function App() {
  return (
    <CartContextProvider>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <NavL />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/Productos" element={<Productos />} />
            <Route path="/category/:id" element={<ProductDetails />} />
          </Routes>
        </BrowserRouter>
      </div>
    </CartContextProvider>
  );
}

export default App;
