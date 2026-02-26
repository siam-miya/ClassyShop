import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, doc, updateDoc, deleteDoc } from "firebase/firestore"; // deleteDoc যোগ করা হয়েছে
import { db } from "../firebase/firebase.config";
import { FaTrashAlt } from "react-icons/fa"; // ডিলিট আইকনের জন্য react-icons ব্যবহার করুন

const AdminPannel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchOrders();
  }, []);

  // স্ট্যাটাস আপডেট করার ফাংশন
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      alert(`Status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      alert("Status update failed!");
    }
  };

  // অর্ডার ডিলিট করার ফাংশন
  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        alert("Order deleted successfully!");
        setOrders(orders.filter(order => order.id !== orderId)); // স্টেট থেকে রিমুভ করা
      } catch (error) {
        console.error("Error deleting order: ", error);
        alert("Failed to delete order!");
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 font-bold text-gray-600">Loading Orders...</div>;

  return (
    <div className="container mx-auto px-2 md:px-4 py-6 md:py-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Admin <span className="text-blue-600">Orders</span></h2>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold">Total: {orders.length}</div>
      </div>

      {/* ডেস্কটপ ভিউ */}
      <div className="hidden lg:block overflow-hidden bg-white shadow-xl border border-gray-200 rounded-2xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase">Contact & Address</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase">Total</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase">Status</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-red-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{order.customerName}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{order.phoneNumber} <br/> {order.address}</td>
                <td className="px-6 py-4 font-black text-slate-900">${order.totalAmount?.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="text-xs font-bold p-2 rounded-lg border bg-gray-50 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => handleDeleteOrder(order.id)} className="text-red-500 hover:text-red-700 transition-all p-2 rounded-full hover:bg-red-100">
                    <FaTrashAlt size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* মোবাইল ভিউ কার্ড */}
      <div className="lg:hidden grid grid-cols-1 gap-4 px-2">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-5 rounded-3xl shadow-md border border-gray-100 relative overflow-hidden">
            {/* ডিলিট বাটন (টপ রাইট কর্নারে) */}
            <button 
              onClick={() => handleDeleteOrder(order.id)}
              className="absolute top-4 right-4 bg-red-50 text-red-500 p-3 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <FaTrashAlt size={16} />
            </button>

            <div className="border-b pb-3 mb-3 pr-10">
              <h3 className="font-black text-slate-900 text-lg uppercase leading-tight">{order.customerName}</h3>
              <p className="text-xs text-blue-600 font-medium">{order.email}</p>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 mb-1">SHIPPING DETAILS</p>
                <p className="text-xs font-bold text-slate-800">{order.phoneNumber}</p>
                <p className="text-[11px] text-slate-500 italic mt-1">{order.address}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Order Summary</p>
                <div className="space-y-1">
                  {order.products?.map((item, index) => (
                    <div key={index} className="flex justify-between text-[11px] border-b border-dashed py-1">
                      <span>{item.name}</span>
                      <span className="font-bold text-blue-600">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Total Amount</p>
                  <p className="text-xl font-black text-slate-900">${order.totalAmount?.toFixed(2)}</p>
                </div>
                <select 
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={`p-2 text-xs font-bold rounded-xl border-2 outline-none ${
                    order.status === "pending" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPannel;