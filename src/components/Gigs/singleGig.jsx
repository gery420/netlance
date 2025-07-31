
import Navbar from "../common/Navbar";
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";
import { UserContext } from "../../context/UserContext";
import swal from "sweetalert2";
import LoadingScreen from "../common/loading";

const SingleGig = () => {

    const { isLoggedIn, userType, user } = useContext(UserContext);

    const navigate = useNavigate();

    const { id } = useParams();
    
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);


    const getGigById = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/gig/${id}`, {
                withCredentials: true,
            });
            setGig(response.data.gig);
        } catch (error) {
            setGig(null);
            console.error("Error fetching gig by ID:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getGigById();
    }, [id]);
    
    useEffect(() => {
        if (gig) {
            getReviews();
        }
    }, [gig]);
    
    if (loading) {
        return <LoadingScreen />;
    }

    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);


    const handleBuy = async (req, res) => {

        if (!isLoggedIn) {
            swal.fire({
                title: "Please Login",
                text: "You need to be logged in to buy this gig.",
                icon: "warning",
                confirmButtonText: "Login",
            });
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/order/checkoutSession`, {
                gigId: gig._id,
                buyerId: user._id,
            }, {
                withCredentials: true,
            });
            window.location.href = response.data.url;
            const stripe = await stripePromise;
            
            const sessionId = response.data.sessionId;

            const result = await stripe.redirectToCheckout({
                sessionId: sessionId,
            });

            if (result.error) {
                console.error(result.error.message);
            }
        } catch (error) {
            swal.fire({
                title: "Error",
                text: "There was an error processing your payment. Please try again later.",
                icon: "error",
                confirmButtonText: "OK",
            });
            console.error("Error during payment:", error);
        }

    }

    const getReviews = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/review/view/${gig._id}`, {
               
            });
            setReviews(response.data.reviews);
            return response.data.reviews;
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
    }

    const deleteReview = async (reviewId) => {
        try {
            if (!isLoggedIn) {
                swal.fire({
                    title: "Access Denied",
                    text: "You must be logged in to delete a review.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
                return;
            }
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/review/delete/${reviewId}`, {
                withCredentials: true,
            });
            setReviews(reviews.filter(review => review._id !== reviewId));
            swal.fire({
                title: "Success",
                text: "Review deleted successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            console.error("Error deleting review:", error);
            swal.fire({
                title: "Error",
                text: error.response?.data?.message || "An error occurred while deleting the review.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    }

    return (
        <div className="w-full mt-[10dvh] flex flex-col items-center justify-center">
            <Navbar />
            <div className="w-[100%] h-[100%] p-10 flex flex-row items-start justify-start">
                <div className="flex flex-col items-start justify-start w-[70%]">
                    <div className="flex flex-row items-center justify-between w-full mb-4">
                        <Link to="/explore"> &lt;-- Go Back</Link>
                    </div>
                    <div className="flex flex-col items-start justify-start">
                        <h1 className="text-4xl font-bold">{gig.title}</h1>
                        <h2 className="text-xl mt-2"><span className="text-lg font-normal">Seller:</span> {gig.sellerUserName}</h2>
                        <div className="flex flex-row mt-4 items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{gig.totalReviews!==0 ? (gig.totalStars/gig.totalReviews).toFixed(1) : 0} ({gig.totalReviews} reviews)</span>
                        </div>
                    </div>

                    <div className="flex flex-col mt-10">
                        <img src={`${gig.cover}`} alt={gig.title} className="w-[500px] h-[500px]" />
                    </div>
                    <div className="mt-10">
                        <p className="font-bold">About this gig: 
                            <br />
                            <span className="mt-4 font-normal">
                                {gig.desc}
                            </span>
                        </p>
                    </div>
                    <div className="w-[50%] mt-10 flex flex-col gap-4 mb-10">
                        <h3 className="text-2xl font-bold mb-4">Reviews</h3>
                        {reviews.map((review) => (
                            <div key={review._id} className="w-[100%] p-4 bg-white  shadow-[27px_27px_69px_rgb(219,215,219)] rounded-lg">
                                <div className="flex flex-row items-start justify-between gap-2">
                                    <div className="flex flex-row items-center gap-2">
                                        <span className="text-yellow-500">★</span>
                                        <span className="font-bold">{review.buyerId.username}</span>
                                        <span className="text-gray-500 text-sm">({review.star} stars)</span>
                                    </div>
                                    <div>
                                        {user._id === review.buyerId?._id ? (
                                            <button onClick={() => deleteReview(review._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="font-normal">{review.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-[30%] h-[50%] flex flex-col items-start justify-start">
                    <div className="mt-20 w-[100%] flex flex-col gap-8 justify-center items-center p-4 bg-white">
                        <div className="size-full flex flex-col gap-10 items-start justify-start">

                            <div className="flex flex-row justify-between w-[100%] gap-2">
                                <p className="font-bold text-xl">{gig.shortTitle}</p>
                                <p>₹{gig.price}.00</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-md text-gray-500">{gig.shortDesc}</p>
                            </div>
                            <div className="flex w-[100%] flex-row justify-between gap-2">    
                                <p className="text-sm font-bold">⏱︎ {gig.deliveryTime} Days Delivery</p>
                                <p className="text-sm font-bold">🗘 {gig.revisionNumber} Revisions</p>
                            </div>
                            <div className="flex flex-col gap-2 opacity-55 italic">
                                {gig.features.map((feature, index) => (
                                    <p key={index}>✓ {feature}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    

                        <div className="w-[100%] relative flex flex-col items-center justify-center mt-4">
                            <button 
                                onClick={handleBuy} 
                                className={`mt-10 bg-[var(--purple)] text-white px-4 py-2 rounded-xl transition ${loading ? "bg-[var(--purple)] opacity-45 text-[var(--white)] cursor-not-allowed" : "hover:bg-[var(--purple)]"} duration-300`}
                            >
                                {loading ? "Processing..." : "Buy Now"}
                            </button>
                        </div>

                    
                </div>
            </div>
        </div>
    );
}

export default SingleGig;

