import React, { useEffect, useState } from "react";
import { collection, doc, deleteDoc, addDoc, onSnapshot, query, orderBy, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config"; 
import { FaTrashAlt, FaShoppingBag, FaLayerGroup, FaPlus, FaTimes, FaCloudUploadAlt, FaEye, FaPhoneAlt, FaMapMarkerAlt, FaChartLine, FaTruck, FaEnvelope } from "react-icons/fa";

// Hot Toast ইমপোর্ট করুন
import toast from "react-hot-toast";

const AdminPannel = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newPost, setNewPost] = useState({ name: "", price: "", image: "", category: "", description: "" });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setLoading(true);
    const qOrders = query(collection(db, "orders"), orderBy("orderDate", "desc"));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const qProducts = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qMessages = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
      unsubscribeMessages();
    };
  }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "classyshop"); 
    const response = await fetch(`https://api.cloudinary.com/v1_1/dq4hsdlni/image/upload`, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Cloudinary upload failed!");
    const data = await response.json();
    return data.secure_url;
  };

  // --- আপডেট করা প্রোডাক্ট অ্যাড ফাংশন ---
  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Please select an image!");
    
    const loadingToast = toast.loading("Uploading and publishing product...");
    setUploading(true);
    
    try {
      const imageUrl = await uploadToCloudinary(imageFile);
      await addDoc(collection(db, "products"), { 
        ...newPost, 
        price: parseFloat(newPost.price), 
        image: imageUrl, 
        createdAt: new Date() 
      });

      toast.success("Product published successfully!", { id: loadingToast });
      setIsModalOpen(false);
      setNewPost({ name: "", price: "", image: "", category: "", description: "" });
      setImageFile(null);
    } catch (error) { 
      toast.error(error.message, { id: loadingToast }); 
    } finally { 
      setUploading(false); 
    }
  };

  // --- আপডেট করা ডিলিট ফাংশন (কাস্টম টোস্ট কনফার্মেশন সহ) ---
  const handleDelete = async (coll, id) => {
    toast((t) => (
      <span className="flex flex-col gap-2">
        <b className="text-sm">Are you sure you want to delete?</b>
        <div className="flex gap-2 justify-end">
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteDoc(doc(db, coll, id));
                toast.success("Item deleted!");
              } catch (err) {
                toast.error("Failed to delete");
              }
            }}
          >
            Yes, Delete
          </button>
          <button 
            className="bg-slate-200 px-3 py-1 rounded-lg text-xs font-bold"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </span>
    ), { duration: 4000, position: 'top-right' });
  };

  // --- আপডেট করা স্ট্যাটাস আপডেট ফাংশন ---
  const updateOrderStatus = async (id, status) => {
    const loadingToast = toast.loading(`Updating status to ${status}...`);
    try {
      await updateDoc(doc(db, "orders", id), { status: status });
      setSelectedOrder(null);
      toast.success(`Order marked as ${status}`, { id: loadingToast });
    } catch (error) {
      toast.error("Error updating status", { id: loadingToast });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans">
      
      {/* --- Sidebar (আপনার আগের কোড অনুযায়ী) --- */}
      <div className="w-full md:w-72 bg-slate-900 text-white p-6 shadow-2xl flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2 bg-blue-600 rounded-lg"><FaShoppingBag size={20}/></div>
          <h2 className="text-xl font-black tracking-widest uppercase italic text-blue-400">Classy Panel</h2>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab("orders")} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold ${activeTab === "orders" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
            <FaChartLine /> Dashboard/Orders
          </button>
          <button onClick={() => setActiveTab("posts")} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold ${activeTab === "posts" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
            <FaLayerGroup /> Product List
          </button>
          <button onClick={() => setActiveTab("messages")} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold ${activeTab === "messages" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
            <FaEnvelope /> Customer Messages
          </button>
        </nav>

        <div className="mt-auto p-4 bg-slate-800/50 rounded-3xl border border-slate-700">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Admin Access</p>
            <p className="font-bold text-sm">Super Admin</p>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 p-5 md:p-10 overflow-y-auto max-h-screen">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
           <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><FaShoppingBag size={24}/></div>
              <div><p className="text-sm font-bold text-slate-400">Total Orders</p><h3 className="text-2xl font-black text-slate-800">{orders.length}</h3></div>
           </div>
           <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center"><FaLayerGroup size={24}/></div>
              <div><p className="text-sm font-bold text-slate-400">Active Products</p><h3 className="text-2xl font-black text-slate-800">{posts.length}</h3></div>
           </div>
           <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center"><FaEnvelope size={24}/></div>
              <div><p className="text-sm font-bold text-slate-400">Total Messages</p><h3 className="text-2xl font-black text-slate-800">{messages.length}</h3></div>
           </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight capitalize">
                {activeTab === "posts" ? "Product List" : activeTab === "orders" ? "Orders" : "Customer Messages"}
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">Manage your store's data efficiently.</p>
          </div>
          {activeTab === "posts" && (
            <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-blue-600 transition-all font-bold shadow-xl active:scale-95">
              <FaPlus /> New Product
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20 items-center gap-3">
             <div className="animate-spin h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full"></div>
             <span className="font-bold text-slate-500">Loading Data...</span>
          </div>
        ) : (
          activeTab === "orders" ? (
            <div className="space-y-4">
                <div className="hidden lg:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Address</th>
                      <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Delivery Area</th>
                      <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Total</th>
                      <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="p-6">
                          <p className="font-black text-slate-800">{order.customerName}</p>
                          <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-1"><FaPhoneAlt size={10}/> {order.phoneNumber}</p>
                        </td>
                        <td className="p-6">
                           <div className="flex items-start gap-2 max-w-[200px]">
                             <FaMapMarkerAlt className="text-slate-300 mt-1 flex-shrink-0" size={14}/>
                             <p className="text-sm text-slate-600 truncate italic font-medium">{order.address}</p>
                           </div>
                        </td>
                        <td className="p-6 text-center">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.deliveryLocation === 'Outside Dhaka' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                              <FaTruck className="inline mr-1" /> {order.deliveryLocation || 'Inside Dhaka'}
                           </span>
                        </td>
                        <td className="p-6"><span className="font-black text-slate-900">৳{order.totalAmount?.toFixed(2)}</span></td>
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => setSelectedOrder(order)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100"><FaEye /></button>
                            <button onClick={() => handleDelete("orders", order.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100"><FaTrashAlt /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:hidden">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-black text-lg text-slate-800">{order.customerName}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{order.deliveryLocation}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 italic mb-4 line-clamp-1">{order.address}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-black text-slate-900">৳{order.totalAmount?.toFixed(2)}</p>
                      <div className="flex gap-2">
                         <button onClick={() => setSelectedOrder(order)} className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FaEye /></button>
                         <button onClick={() => handleDelete("orders", order.id)} className="p-3 bg-red-50 text-red-500 rounded-xl"><FaTrashAlt /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "posts" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {posts.map(post => (
                <div key={post.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-100 text-[10px] font-black text-blue-600 z-10">{post.category}</div>
                  <div className="w-full h-48 rounded-[2rem] overflow-hidden bg-slate-50 mb-4 border border-slate-50">
                    <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-black text-slate-800 line-clamp-1">{post.name}</h4>
                      <p className="text-blue-600 font-black text-xl mt-1">৳{post.price}</p>
                    </div>
                    <button onClick={() => handleDelete("products", post.id)} className="p-4 text-red-500 bg-red-50 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"><FaTrashAlt /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {messages.map(msg => (
                 <div key={msg.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">
                              {msg.name.charAt(0)}
                           </div>
                           <div>
                              <h4 className="font-black text-slate-900">{msg.name}</h4>
                              <p className="text-sm text-blue-600 font-bold">{msg.email}</p>
                           </div>
                        </div>
                        <button onClick={() => handleDelete("messages", msg.id)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                           <FaTrashAlt />
                        </button>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[2rem]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject: {msg.subject}</p>
                        <p className="text-slate-600 font-medium leading-relaxed italic">"{msg.message}"</p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-6 uppercase tracking-widest">
                        Received: {msg.createdAt?.toDate().toLocaleString() || 'Just now'}
                    </p>
                 </div>
               ))}
               {messages.length === 0 && <p className="text-center py-10 text-slate-400 font-bold">No messages found.</p>}
            </div>
          )
        )}
      </div>

      {/* --- Modals --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex justify-center items-center z-[100] p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 p-3 bg-slate-100 rounded-2xl hover:bg-red-500 hover:text-white text-slate-500 transition-all"><FaTimes size={18}/></button>
            <div className="flex items-center gap-3 mb-8">
               <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Order Detail</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <p className="text-[10px] uppercase font-black text-slate-400 mb-4 tracking-widest">Customer Info</p>
                <h4 className="font-black text-xl text-slate-900">{selectedOrder.customerName}</h4>
                <div className="mt-4 space-y-2">
                   <p className="text-sm text-slate-600 flex items-start gap-2 font-medium"><FaMapMarkerAlt className="mt-1 text-blue-500 flex-shrink-0"/> {selectedOrder.address}</p>
                   <p className="text-sm text-slate-600 flex items-center gap-2 font-medium"><FaPhoneAlt className="text-blue-500 flex-shrink-0"/> {selectedOrder.phoneNumber}</p>
                   <p className="text-xs font-black text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full uppercase tracking-tighter">Area: {selectedOrder.deliveryLocation}</p>
                </div>
              </div>
              <div className="p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl">
                <p className="text-[10px] uppercase font-black text-slate-500 mb-4 tracking-widest">Pricing Summary</p>
                <div className="space-y-2 text-sm font-bold">
                   <div className="flex justify-between">
                      <span className="text-slate-400">Subtotal:</span>
                      <span>৳{(selectedOrder.totalAmount - (selectedOrder.shippingCharge || 0)).toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-slate-400">Shipping Charge:</span>
                      <span className="text-blue-400">৳{selectedOrder.shippingCharge || 0}</span>
                   </div>
                </div>
                <div className="h-[1px] bg-white/10 my-4 border-dashed border-t"></div>
                <div className="flex justify-between items-end">
                   <span className="font-bold text-slate-400">Total</span>
                   <span className="text-4xl font-black tracking-tighter text-blue-400">৳{selectedOrder.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">Ordered Items ({selectedOrder.products?.length})</h3>
            <div className="space-y-4">
              {selectedOrder.products?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-3xl">
                  <div className="flex items-center gap-5">
                    <img src={item.image || item.img} className="w-16 h-16 rounded-2xl object-cover border border-slate-100" alt="" />
                    <div>
                       <p className="font-black text-slate-800 leading-tight">{item.name}</p>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Qty: <span className="text-blue-600">{item.quantity}</span></p>
                    </div>
                  </div>
                  <p className="font-black text-slate-900">৳{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
               <button onClick={() => updateOrderStatus(selectedOrder.id, "Shipped")} className="flex-1 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg hover:bg-slate-900 transition-all shadow-xl shadow-blue-100">Mark as Shipped</button>
               <button onClick={() => window.print()} className="px-8 py-5 bg-slate-100 text-slate-600 rounded-[2rem] font-black hover:bg-slate-200 transition-all">Print</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex justify-center items-center z-[100] p-4">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl relative animate-in slide-in-from-bottom duration-300 overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-400 hover:text-slate-900 transition-colors"><FaTimes size={24}/></button>
            <h2 className="text-3xl font-black mb-8 text-slate-900 tracking-tighter">Publish <span className="text-blue-600">Product</span></h2>
            <form onSubmit={handleAddPost} className="space-y-6">
              <div className="w-full h-40 border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center relative bg-slate-50 group hover:border-blue-400 transition-all cursor-pointer overflow-hidden">
                {imageFile ? <img src={URL.createObjectURL(imageFile)} className="absolute inset-0 w-full h-full object-cover" alt="" /> : (
                  <div className="text-center">
                    <FaCloudUploadAlt size={40} className="text-slate-300 mx-auto mb-2 group-hover:text-blue-500 transition-colors"/>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600">Drag or Click to Upload</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setImageFile(e.target.files[0])} />
              </div>
              <div className="space-y-4">
                <input required type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 outline-none font-bold transition-all" placeholder="What's the product name?" onChange={(e) => setNewPost({...newPost, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 outline-none font-bold transition-all" placeholder="Price (৳)" onChange={(e) => setNewPost({...newPost, price: e.target.value})} />
                  <input type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 outline-none font-bold transition-all" placeholder="Category" onChange={(e) => setNewPost({...newPost, category: e.target.value})} />
                </div>
                <textarea className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 outline-none font-bold transition-all h-24" placeholder="Brief description..." onChange={(e) => setNewPost({...newPost, description: e.target.value})}></textarea>
              </div>
              <button disabled={uploading} className={`w-full py-5 rounded-[2rem] font-black text-xl transition-all shadow-xl active:scale-95 ${uploading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-slate-900 shadow-blue-200"}`}>
                {uploading ? "Uploading, please wait..." : "Publish Product Now"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPannel;