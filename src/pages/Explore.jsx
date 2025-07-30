import Navbar from "../components/common/Navbar";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Explore = () => {

    const [gigs, setGigs] = useState([]);
    const [load, setLoad] = useState(true);

    const getAllGigs = async () => {
        try {
            setLoad(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/gig/all`, {
                withCredentials: true,
            });
            setGigs(response.data.gigs);
            setLoad(false);
        } catch (error) {
            setLoad(false);
            console.error("Error fetching all gigs:", error);
            return [];
        }
    };
    useEffect(() => {
        getAllGigs();
    }, []);

    if (load) {
        return <div className="w-full h-screen flex items-center justify-center">Getting Gigs for You...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="mt-20 w-[99vw] flex items-center justify-center">
                <div className="inline-flex flex-col flex-wrap flex-grow p-10 gap-8 w-[100%] justify-start items-start">
                    <div>
                        <p className="text-xl mb-4"><Link to="/home">Home /</Link> Explore</p>
                    </div>
                    <div className="flex flex-wrap gap-6 w-full justify-start items-start">
                        {gigs.map((gig) => (
                            <div key={gig._id} className="bg-white p-4 rounded-xl w-[30%] shadow-[27px_27px_69px_rgb(219,215,219)]">
                                <img
                                    src={`${gig.cover}`}
                                    alt={gig.title}
                                    className="w-full h-36 object-cover rounded-lg mb-4"
                                />
                                <h2 className="text-xl font-semibold">{gig.shortTitle}</h2>
                                <p className="text-[var(--purple)] font-bold mt-2">₹{gig.price}</p>
                                <div className="flex flex-row justify-between w-[100%] mt-2">
                                    <p className="text-sm text-gray-400 mt-1">🚚 {gig.deliveryTime} days</p>
                                    <p className="text-sm text-gray-500 mt-1">{gig.revisionNumber} Revisions</p>
                                </div>
                                <div className="flex w-[100%] justify-between flex-row items-center mt-2">
                                    <span className=" text-gray-600"><span className="text-yellow-400">★</span> {(gig.totalStars/gig.totalReviews).toFixed(1) || 'No ratings yet'}</span>
                                    <p className="text-sm text-gray-500 mt-1">By {gig.sellerName}</p>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <Link to={`/gig/${gig._id}`} className="text-blue-500 hover:underline">View Details</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Explore;
