import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import swal from "sweetalert2";

import { Link } from "react-router-dom";

const MyGigs = () => {

    const [gigs, setGigs] = useState([]);
    const { isLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();
    const fetchGigs = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/gig/`, {
                    withCredentials: true,
                });
                setGigs(response.data.gigs);
            } catch (error) {
                console.error("Error fetching gigs:", error);
            }
        };
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }     
        fetchGigs();
    }, [isLoggedIn, navigate]);

    const handleDelete = async (gigId) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/gig/${gigId}`, {
                withCredentials: true,
            });
            if (response.data.success) {
                fetchGigs(); // Refresh the gigs list
                swal.fire({
                    title: "Gig Deleted",
                    text: "Your gig has been successfully deleted.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error("Error deleting gig:", error);
            swal.fire({
                title: "Error",
                text: "There was an error deleting your gig. Please try again later.",
                icon: "error",
            });
        }
    };

    return (
        <div className=" p-6 flex flex-col items-center justify-center">

            <div className="w-full h-[15dvh] top-[10dvh] flex flex-row justify-between items-center">
                <h1 className="text-3xl text-center ml-10 text-[var(--black)] font-bold font-Nunito">Your Gigs</h1>
                <Link to="/createGig" className="w-[10%] h-[40%] p-3 transition-all duration-200 ease-in-out justify-self-center items-center text-center border-solid hover:bg-[var(--purple)] font-bold border-2 border-[var(--black)] mr-10 rounded-3xl" > Create a Gig</Link>
            </div>

            <div className="p-10 size-full">
                {gigs.length !== 0 ? (
                    <div className="flex flex-wrap flex-row gap-6 justify-evenly items-start">
                        {gigs.map((gig) => (
                            <div key={gig._id} className="bg-white p-4 rounded-xl w-[30%] shadow-[27px_27px_69px_rgb(219,215,219)]">
                                <img
                                    src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${gig.cover}`}
                                    alt={gig.title}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h2 className="text-xl font-semibold">{gig.title}</h2>
                                <p className="text-gray-600">{gig.shortTitle}</p>
                                <p className="text-green-600 font-bold mt-2">₹{gig.price}</p>
                                <p className="text-sm text-gray-400 mt-1">Delivery in {gig.deliveryTime} days</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <Link to={`/gig/${gig._id}`} className="text-blue-500 hover:underline">View Details</Link>
                                    <button onClick={() => handleDelete(gig._id)} className="text-red-500 hover:underline">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">You haven't created any gigs yet.</p>
                    
                )}
            </div>
        </div>
    );
}

export default MyGigs;
