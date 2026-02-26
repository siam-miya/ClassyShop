import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {

        const q = query(collection(db, "orders"), orderBy("orderDate", "desc"));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders: ", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-20">Loading Orders...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Admin Panel - All Orders</h2>
      
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone & Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                {/* কাস্টমার ইনফরমেশন */}
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.email}</p>
                </td>
                
                {/* ফোন এবং ঠিকানা */}
                <td className="px-6 py-4">
                  <p className="text-sm">{order.phoneNumber}</p>
                  <p className="text-xs text-gray-500">{order.address}</p>
                </td>

                {/* প্রোডাক্টের বিস্তারিত (লুপ চালিয়ে দেখানো হচ্ছে) */}
                <td className="px-6 py-4">
                  {order.products.map((item, index) => (
                    <div key={index} className="text-xs border-b last:border-0 py-1">
                      <span className="font-semibold">{item.name}</span> (x{item.quantity})
                    </div>
                  ))}
                </td>

                {/* মোট টাকা */}
                <td className="px-6 py-4 font-bold text-blue-600">
                  ${order.totalAmount?.toFixed(2)}
                </td>

                {/* স্ট্যাটাস */}
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;