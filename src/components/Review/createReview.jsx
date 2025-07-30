import React, { useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert2';
import {UserContext} from '../../context/UserContext';
import Navbar from '../common/Navbar';


const CreateReview = () => {

    const { user } = useContext(UserContext);
    const { orderId, gigId } = useParams();
    const [ load , setLoad ] = useState(false);

    const navigate = useNavigate();

    let [ data, setData ] = useState({
        rating: 0,
        comment: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: name === 'rating' ? parseInt(value) : value
        });
    }

    const submitReview = async (e) => {
        e.preventDefault();
        
        if (data.rating < 1 || data.rating > 5) {
            swal.fire({
                icon: "error",
                title: "Invalid Rating",
                text: "Please provide a rating between 1 and 5."
            });
            return;
        }

        try {
            setLoad(true);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/review/create/${orderId}/${gigId}`, {
                buyerId: user._id,
                desc: data.comment,
                star: data.rating,
            }, {
                withCredentials: true,
            });

            if (response.data.success) {
                swal.fire({
                    icon: "success",
                    title: "Review Created",
                    text: "Your review has been successfully created."
                });
                navigate(`/orders`);
                setLoad(false);
            } else {
                swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message || "Failed to create review."
                });
                setLoad(false);
            }
        } catch (error) {
            console.error("Error creating review:", error);
            swal.fire({
                icon: "error",
                title: "Server Error",
                text: "An error occurred while creating your review. Please try again later."
            });
            setLoad(false);
        }
    }

    return (
        <div className='w-[100dvw] h-[100dvh] bg-[var(--white)] overflow-hidden'>
            <Navbar />
            <div className="w-full h-[10dvh] mt-[10dvh] flex items-start justify-start">
                <Link to={`/orders`} className='text-[var(--black)] ml-10 mt-10 text-xl'> &lt;-- Back</Link>
            </div>
            <div className="w-full h-[80%] flex flex-col items-center justify-start">
                <h2 className='text-2xl font-bold mt-10 mb-4'>Create Review For your order: {orderId}</h2>
                <div className="w-[30%] h-[60%] flex flex-col items-center justify-center p-6 rounded-3xl mt-20 shadow-[27px_27px_69px_rgb(219,215,219)]">
                    <div className="mb-4 flex flex-col items-start  w-[100%]">
                        <div className="mb-4 flex flex-col size-full">
                            <label className="w-[100%] ">Rating (1-5):
                                <input
                                    type="number"
                                    name="rating"
                                    value={data.rating}
                                    onChange={handleChange}
                                    min="1"
                                    max="5"
                                    required
                                    className="mt-4 w-[100%] text-center p-4 border border-gray-300 rounded-3xl"
                                />
                            </label>
                        </div>
                        <div className="mb-4 flex size-full flex-col">
                            <label className="w-[100%] ">Comment:

                                <input
                                    type="text"
                                    name="comment"
                                    value={data.comment}
                                    onChange={handleChange}
                                    required
                                    className="mt-4 w-[100%] p-6 text-center items-center justify-center  border border-gray-300 rounded-3xl"

                                />
                            </label>
                        </div>
                    </div>    
                    <div className="flex items-center justify-center w-[100%] h-[20%] mt-4">
                        <button type="submit" onClick={submitReview} className={`w-[40%] h-[50%] border-solid border-2 border-[var(--black)] rounded-2xl ${load ? "bg-[var(--purple)] opacity-45 text-[var(--white)] cursor-not-allowed" : "hover:bg-[var(--purple)]"}`} 
>{load ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateReview;
