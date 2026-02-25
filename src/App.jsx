import { BrowserRouter, Routes, Route } from "react-router"; // আপনি 'react-router' v7 বা v6 ব্যবহার করছেন ধরে নিয়েছি
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CheckOut from "./pages/CheckOut";
import Cart from "./pages/Cart";
import ContactUs from "./pages/ContactUs";
import ErrorPage from "./pages/ErrorPage";

// Context Providers ইমপোর্ট করুন
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import ProductDetails from "./pages/ProductDetails";

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index={true} element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/checkout" element={<CheckOut />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/product/:id" element={<ProductDetails />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  );
};

export default App;