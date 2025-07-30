import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import swal from 'sweetalert2';
import Navbar from '../common/Navbar';
import { Link } from 'react-router';

const Order = () => {
const { user, userType } = useContext(UserContext);
const [ filter, setFilter ] = useState('all'); 
const [orders, setOrders] = useState([]);
const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.status === filter);

const [loading, setLoading] = useState(true);

const fetchOrders = async () => {
    try {
        setLoading(true);
    const endpoint = userType === 'buyer'
        ? `/order/buyer/${user._id}`
        : `/order/seller/${user._id}`;

    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, {
        withCredentials: true,
    });

    setOrders(res.data.orders);
    setLoading(false);
    } catch (error) {
        setLoading(false);
        console.error("Error fetching orders:", error);
    } finally {
        setLoading(false);
    }
};

const updateOrderStatus = async (orderId, newStatus) => {
    try {
    const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/order/${orderId}/status`, {
        status: newStatus,
    }, {
        withCredentials: true,
    });

    swal.fire("Updated", `Order status changed to ${newStatus}`, "success");
    fetchOrders(); // Refresh list
    } catch (err) {
    swal.fire("Error", "Could not update order status", "error");
    }
};

useEffect(() => {
    if (user && user._id) {
    fetchOrders();
    }
}, [user]);

if (loading) return <div className="flex justify-center items-center h-screen">Loading Orders...</div>;


return (
    <div >
        <Navbar />
        <div className='w-full flex flex-col items-center justify-center mt-36'>
            {orders.length === 0 ? (
                <h1 className="text-2xl font-bold">No Orders Found</h1>
            ) : (
            <div className="flex flex-col items-center size-full">
                <h1 className="text-3xl w-[70%] font-bold text-left">{userType === 'buyer' ? 'Your Purchases' : 'Your Orders'}</h1>
                {userType === 'seller' && (
                    <div className=" w-[70%] flex flex-row gap-8 justify-start  mt-4">
                        <p className="text-gray-500 text-left mt-2">
                            Total Orders: <span className="font-bold">{orders.length}</span>
                        </p>
                        <p className="text-gray-500 text-left mt-2">
                            Completed: <span className="font-bold">{orders.filter(order => order.status === 'completed').length}</span>
                        </p>
                        <p className="text-gray-500 text-left mt-2">
                            In Progress: <span className="font-bold">{orders.filter(order => order.status === 'in-progress').length}</span>
                        </p>
                        <p className="text-gray-500 text-left mt-2">
                            Cancelled: <span className="font-bold">{orders.filter(order => order.status === 'cancelled').length}</span>
                        </p>
                    </div>
                )}
                <div className='w-[70%] flex justify-start flex-row gap-8 items-start mt-6'>
                    {['all', 'in-progress', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`${filter === status ? 'text-black' : 'text-gray-400'}`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {filteredOrders.length === 0 && (
                    <div className="mt-20 text-gray-500">
                        <p>No orders found </p>
                    </div>
                )}

                <div className="flex flex-col-reverse w-[70%] mt-10 mb-10 gap-6">
                    {filteredOrders.map((order) => (    
                    <div key={order._id} className={`p-6 border rounded-xl shadow-[27px_27px_69px_rgb(219,215,219)] flex flex-col md:flex-row justify-between items-start md:items-center ${order.status === 'cancelled' ? 'bg-zinc-200' : 'bg-white'}`}>
                        <div className="flex flex-col">
                        <p className="text-xl font-semibold mb-2">{order.title}</p>
                        <p className="text-gray-700">₹{order.price}</p>
                        <p className="text-gray-600">Status: <span className="font-bold">{order.status}</span></p>
                        <Link to={`/gig/${order.gigID?._id}`} target='_blank' className="text-blue-500 w-fit hover:underline">View Gig</Link>
                        </div>
                        
                        {userType === 'seller' && (
                            
                            <div className="mt-4 md:mt-0 flex gap-2">
                                {order.status === 'in-progress' ? (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'completed')}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                            Mark as Complete
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                            Cancel Order
                                        </button>
                                        <Link to={`/orders/${order._id}`} target='_blank'
                                            className="px-3 py-1 bg-[var(--purple)] text-white rounded hover:bg-[#5452b3]"
                                            >
                                            View Order
                                        </Link>
                                    </div>
                                ) : null}
                                {order.status === 'completed' ? (
                                    <div className=" flex flex-row justify-center items-center gap-4"> 
                                        <span className="text-gray-500 font-bold">Order Completed</span>
                                        <Link to={`/orders/${order._id}`} target='_blank'
                                                className="px-3 py-1 bg-[var(--purple)] text-white rounded hover:bg-[#5452b3]"
                                                >
                                                View Order
                                        </Link>
                                    </div>
                                ) : null}
                                {order.status === 'cancelled' ? (
                                    <div className=" flex flex-row justify-center items-center gap-4">
                                        <span className="text-red-500 font-bold">Order Cancelled</span>
                                        <Link to={`/orders/${order._id}`} target='_blank'
                                                className="px-3 py-1 bg-[var(--purple)] text-white rounded hover:bg-[#5452b3]"
                                                >
                                                View Order
                                        </Link>
                                    </div>
                                ) : null}
                            </div>      
                        )}

                        {userType === 'buyer' && (
                            <div className="flex gap-4">
                                {order.status === 'in-progress' ? (
                                    <div className="flex flex-row justify-center items-center gap-4">
                                        <span className="text-yellow-500 font-bold">Order In Progress</span>
                                        <Link to={`/orders/${order._id}`} target='_blank'
                                            className="px-3 py-1 bg-[var(--purple)] text-white rounded hover:bg-[#5452b3]"
                                            >
                                            View Order
                                        </Link>
                                    </div>
                                ) : null}
                                {order.status === 'completed' ? (
                                    <div className=" flex flex-row justify-center items-center gap-4">
                                        <Link to={`/orders/${order._id}`} target='_blank'
                                                className="px-3 py-1 bg-[var(--purple)] text-white rounded hover:bg-[#5452b3]"
                                                >
                                                View Order
                                        </Link>
                                        {order.reviewId ? (
                                            <span className="text-green-500 font-bold">Review Submitted</span>
                                        ) : (
                                            <Link to={`/review/create/${order._id}/${order.gigID?._id}`} className="px-3 py-1 bg-[var(--purple)] text-white rounded hover:bg-[#5452b3]">
                                                Create Review
                                            </Link>
                                        )}
                                    </div>
                                ) : null}
                                {order.status === 'cancelled' ? (
                                    <div className=" flex flex-row justify-center items-center gap-4">
                                        <span className="text-red-500 font-bold">Order Cancelled</span>
                                        <Link to={`/orders/${order._id}`} target='_blank'
                                                className="px-3 py-1 bg-[var(--purple)] text-white rounded hover:bg-[#5452b3]"
                                                >
                                                View Order
                                        </Link>
                                    </div>
                                ) : null}
                            </div>  
                        )}
                        
                    </div>
                    ))}
                </div>
            </div>
            )}
        </div>
    </div>
);
};

export default Order;
