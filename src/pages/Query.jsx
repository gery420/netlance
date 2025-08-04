import {  useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/common/loading";
import Navbar from "../components/common/Navbar";

const Query = () => {

    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);

    const searchQuery = queryParams.get("query");

    const [ gigs, setGigs ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/gig/search?query=${searchQuery}`);
                setGigs(response.data.gigs);
            } catch (err) {
                console.error("Error fetching gigs:", err);
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery) {
            fetchGigs();
        }
    }, [searchQuery]);

    if (loading) {
        return <LoadingScreen />;
    }
    
    return (
        <div>
            <Navbar />
            <div className="sm:mt-20 w-[99vw] mt-[20dvh] flex items-center justify-center">
                <div className="flex flex-col flex-wrap flex-grow p-10 gap-8 w-[100%] justify-start items-start">
                    <div>
                        <p className="text-xl mb-4"><Link to="/">Home /</Link> Explore</p>
                    </div>
                    <div className="flex flex-row flex-wrap flex-grow gap-6 w-full">
                        {gigs.length === 0 ? (
                            <p className="text-gray-500">No gigs found for "{searchQuery}"</p>
                        ) : (
                            gigs.map((gig) => (
                                <div key={gig._id} className="bg-white p-4 rounded-xl flex-grow-1 w-full sm:w-[40%] lg:w-[30%] shadow-[27px_27px_69px_rgb(219,215,219)]">
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
                                        <span className=" text-gray-600"><span className="text-yellow-400">★</span> {gig.totalReviews === 0 ? 'No ratings yet' : (gig.totalStars/gig.totalReviews).toFixed(1)}</span>
                                        <p className="text-sm text-gray-500 mt-1">By {gig.sellerUserName}</p>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <Link to={`/gig/${gig._id}`} className="text-blue-500 hover:underline">View Details</Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Query;
