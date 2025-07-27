
import Navbar from "../common/Navbar";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SingleGig = () => {

    const { id } = useParams();
    
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="w-full mt-[10dvh] flex flex-col items-center justify-center">
            <Navbar />
            <div className="w-[90dvw] p-5">
                <div className="flex flex-col items-start justify-start">
                    <h1 className="text-4xl font-bold">{gig.title}</h1>
                    <h2 className="text-xl">{gig.sellerName}</h2>
                    <div className="flex flex-row items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{gig.starNumber} ({gig.totalStars} reviews)</span>
                    </div>
                </div>
                <div className="flex flex-col mt-10">
                    <img src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${gig.cover}`} alt={gig.title} className="w-[500px] h-[500px]" />
                </div>
                <div className="mt-10">
                    <p className="font-bold">About this gig: 
                        <div className="mt-4 font-normal">
                            {gig.desc}
                        </div>
                    </p>
                </div>
                <div className="mt-4 absolute w-[20%] flex flex-col gap-8 justify-start items-start top-[20%] right-[5%] p-4 bg-white">
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
        </div>
    );
}

export default SingleGig;

