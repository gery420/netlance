import React, { useContext, useState,useEffect } from 'react';
import Navbar from '../common/Navbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const SingleOrder = () => {

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);                           
    const [newMessage, setNewMessage] = useState("");     
    const { user, userType } = useContext(UserContext);

    const getOrderById = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/order/${id}`, {
                withCredentials: true,
            });
            setOrder(response.data.data.order);
            setLoading(false);
            console.log(response.data.data.order);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching order by ID:", error);
        }
    }
    const getConversation = async () => {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/chat/conversation/${id}`, {
            withCredentials: true,
        });
        setConversation(res.data.conversation);
    };  
    const fetchMessages = async (conversationId) => {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/chat/message/${conversationId}`, {
            withCredentials: true,
        });
        setMessages(res.data.messages);
    };
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/chat/message/${conversation._id}`,
            {
            senderType: userType,
            senderId: user._id,
            text: newMessage,
            },
            { withCredentials: true }
        );

        setNewMessage("");
        fetchMessages(conversation._id);
    };

    useEffect(() => {
        getOrderById();
    }, [id]);

    useEffect(() => {
        if (order) {
            getConversation();
        }
    }
    , [order]);
    useEffect(() => {
        let intervalID;

        if (conversation) {
            intervalID =setInterval(() => {
                fetchMessages(conversation._id);
            }, 1000);
        }
        return () => {
            if (intervalID) {
                clearInterval(intervalID);
            }
        };
    }, [conversation]);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading Order...</div>;
    if (!order) return <div className="text-center mt-20 text-xl font-bold">Order not found.</div>;

    return (
        <div className=' flex flex-col items-center justify-center'>
            <Navbar />
            <div className="w-[90dvw] h-fit flex flex-col gap-10 mt-[15dvh] items-center justify-center">
                <div className="w-[100%] mb-4">
                    <div >
                        <Link to={`/orders`}> &lt;- Back</Link>
                    </div>
                    <h1 className="text-3xl font-bold">Your Order:
                        <span className="font-normal"> {order._id}</span>
                    </h1>
                </div>
                <div className='w-[80%] h-[60%] flex flex-col justify-end items-end '>
                    <div className="bg-white rounded-2xl relative flex flex-col justify-center items-center shadow-[27px_27px_69px_rgb(219,215,219)] gap-10 w-[90%] h-[100%] p-10">
                        <p className='w-[100%] font-thin'>Buyer: 
                            <span className='font-semibold font-Nunito text-xl'> {order.buyerID?.username}</span>
                        </p>
                        <p className='w-[100%] font-thin'>Seller: 
                            <span className='font-semibold font-Nunito text-xl'> {order.sellerID?.username}</span>
                        </p>
                        <p className='w-[100%] font-thin'>Gig Title: 
                            <span className='font-semibold font-Nunito text-xl'> {order.title}</span>
                        </p>
                        <p className='w-[100%] font-thin'>Gig Price: 
                            <span className='font-semibold font-Nunito text-xl'> {order.price}</span>
                        </p>
                        <p className='w-[100%]  font-thin'>Order Status: 
                            <span className={`font-semibold font-Nunito text-xl ${order.status === 'in-progress' ? 'text-[var(--purple)]' : 'text-red-500'}`}> {order.status}</span>
                        </p>
                    </div>
                </div>
                <div className='w-[20%] h-[60%] flex flex-col justify-end items-end '>
                    <div className="bg-white rounded-2xl relative flex flex-row justify-center items-center shadow-[27px_27px_69px_rgb(219,215,219)] gap-1 w-[100%] h-[100%] p-10">
                    Chat with 
                    <span className='font-bold text-lg'>{userType === "buyer" ? order.sellerID?.username : order.buyerID?.username}</span>
                    </div>
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className='w-[100%] h-[50vh] flex justify-start items-start p-4'>
                            {conversation && (
                                <div className='w-[100%] h-[100%] flex justify-start'>
                                    <div className="w-[100%] h-[90%] p-4 rounded">
                                        <div className="h-[100%] overflow-y-scroll">
                                            {messages.map((msg, idx) => (
                                                <div
                                                key={idx}
                                                className={`mb-2 p-4 rounded-xl w-fit ${
                                                    msg.senderType === userType ? " border-2 border-[#000000c6] ml-auto mr-4 text-right" : "bg-gray-200"
                                                }`}
                                                >
                                                    <p>{msg.text}</p>
                                                    <p className="text-xs text-gray-500">{new Date(msg.sentAt).toLocaleString()}</p>
                                                </div>
                                        
                                            ))}
                                        </div>
                                    {order.status === "completed" || order.status === "cancelled" ? (
                                        <div className="mt-4 text-gray-500 italic">
                                            Chat disabled. This order has been marked as <strong>completed</strong>.
                                        </div>
                                        ) : (
                                        <div className="flex gap-2">
                                            <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            className="flex-1 border p-3 rounded-xl"
                                            placeholder="Type your message"
                                            />
                                            <button
                                            onClick={handleSendMessage}
                                            className="bg-[var(--purple)] text-white px-4 py-2 rounded hover:bg-[#5856b8]"
                                            >
                                            Send
                                            </button>
                                        </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                    
                    </>
                )}
            </div>
        </div>
    )
}
export default SingleOrder;
