import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CheckOut from "./pages/CheckOut";
import Cart from "./pages/Cart";
import ContactUs from "./pages/ContactUs";
import ErrorPage from "./pages/ErrorPage";

// Context Providers
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import ProductDetails from "./pages/ProductDetails";
import AdminPannel from "./pages/AdminPannel";
import AdminLogin from "./pages/AdminLogin";

// Protected Route ইমপোর্ট
import ProtectedRoute from "./components/ProtectedRoute"; 

// React Hot Toast ইমপোর্ট
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
        {/* Toaster যোগ করা হয়েছে যা পুরো অ্যাপের সব পেজে মেসেজ শো করবে */}
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '15px',
              padding: '16px',
            },
          }}
        />
        
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index={true} element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/checkout" element={<CheckOut />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/adminlogin" element={<AdminLogin />} />
              
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminPannel />
                  </ProtectedRoute>
                } 
              />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  );
};

export default App;