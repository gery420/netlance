import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Navbar from '../components/common/Navbar';
import { Link } from 'react-router';
import swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import LoadingScreen from '../components/common/loading';

const SellerDashboard = () => {

const { userType, isLoggedIn } = useContext(UserContext);
const [dashboardData, setDashboardData] = useState(null);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

useEffect(() => {
    if (!isLoggedIn && userType !== 'seller') {
        swal.fire({
            title: 'Access Denied',
            text: 'You must be logged in as a seller to view this page.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        navigate('/');
    }

    const fetchDashboard = async () => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/seller/dashboard`, {
        withCredentials: true,
        });
        setDashboardData(res.data.data);
        setLoading(false);
    } catch (err) {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
    }
    };

    fetchDashboard();
}, []);

if (loading) {
    return(
        <LoadingScreen /> // Show loading screen while fetching data
    )
}

const { gigs, orders, reviews } = dashboardData;

const completedOrders = orders.filter(order => order.status === 'completed');
const inProgressOrders = orders.filter(order => order.status === 'in-progress');
const cancelledOrders = orders.filter(order => order.status === 'cancelled');

const totalRevenue = completedOrders.reduce((sum, order) => sum + order.price, 0);


return (
    <div className="w-[100dvw] mt-[15dvh] flex-col flex items-center justify-center">
        <Navbar />
    <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

    <div className="p-6 size-full flex flex-col flex-wrap items-center justify-center">
        <div className="flex w-[100%] rounded-3xl p-4
                items-center justify-evenly flex-col gap-10">
                <div className='flex flex-row gap-10'>
                    <DashboardCard label="Total Orders" value={orders.length} />
                    <DashboardCard label="Completed" value={completedOrders.length} />
                    <DashboardCard label="In Progress" value={inProgressOrders.length} />
                    <DashboardCard label="Cancelled" value={cancelledOrders.length} />
                    <DashboardCard label="Total Revenue" value={`₹${totalRevenue}`} />
                    <DashboardCard label="Total Gigs" value={gigs.length} />
                    <DashboardCard label="Total Reviews" value={reviews.length} />
                </div>
                <div className='flex flex-col w-[100%] overflow-x-auto'>
                    <h2 className="text-xl font-semibold mb-3">Your Orders</h2>
                    {orders.length === 0 ? (
                        <p>No orders yet. Maybe you should start selling something?</p>
                    ) : (
                        <div className=' flex flex-row gap-4 overflow-x-auto'>
                            {orders.map(order => (
                                <Link to={`/orders/${order._id}`} target='_blank' key={order._id} className="bg-white p-4 flex flex-col gap-2 size-fit mb-4">
                                    <h3 className="font-semibold">{order.title}</h3>
                                    <p className="text-sm text-gray-600">Buyer: {order.buyerID?.username || 'Unknown'}</p>
                                    <p className="text-sm text-gray-600">Price: ₹{order.price}</p>
                                    <p className="text-sm text-gray-600">Status: {order.status}</p>
                                    <p className="text-sm text-gray-600">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
        </div>

        <div className="mt-20 p-4 w-full rounded-3xl h-max flex flex-col overflow-x-auto">
            <h2 className="text-xl font-semibold mb-3">All Gigs</h2>
            {gigs.length === 0 ? (
            <p>You haven’t created any gigs yet. Lazy?</p>
            ) : (
            <div className="flex flex-wrap gap-4 flex-row">
                {gigs.map(gig => (
                <Link to={`/gig/${gig._id}`} target='_blank' key={gig._id} className="p-4 mb-10 rounded-lg">
                    <h3 className="font-semibold">{gig.title}</h3>
                    <p className="text-sm text-gray-600">₹{gig.price} • {gig.totalStars} ★</p>
                </Link>
                ))}
            </div>
            )}
        </div>

        <div className="mt-20 p-4 w-full rounded-3xl h-max flex flex-col overflow-x-auto">
            <h2 className="text-xl font-semibold mt-3">Reviews on Gigs</h2>
            {reviews.length === 0 ? (
            <p>No reviews yet. Either you're new, or suspiciously flawless.</p>
            ) : (
            <div className="flex flex-row gap-4 flex-wrap">
                {reviews.map(review => (
                <div key={review._id} className=" p-4 rounded">
                    <p className="text-gray-700">⭐ {review.star} - {review.desc}</p>
                    <p className="text-sm text-gray-500 mt-1">
                    By: {review.buyerId?.username || 'Unknown'} on <strong>
                        <Link to={`/gig/${review.gigId?._id}`} target='_blank'>
                            {review.gigId?.title}
                        </Link>
                    </strong>
                    </p>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    </div> 
);
};

const DashboardCard = ({ label, value }) => (
<div className=" p-4 text-center">
    <p className="text-lg font-medium">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
</div>
);

export default SellerDashboard;
