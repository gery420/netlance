import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert2';

const PaymentSuccess = () => {
const [searchParams] = useSearchParams();
const session_id = searchParams.get("session_id");
const gigId = searchParams.get("gigId");
const buyerId = searchParams.get("buyerId");
const navigate = useNavigate();


useEffect(() => {
	const confirmOrder = async () => {
	try {
		const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/order/confirm`, {
		session_id,
		gigId,
		buyerId
		}, { withCredentials: true });

		if (res.data.order) {
		swal.fire("Success", "Payment successful and order confirmed!", "success");
		navigate("/orders");
		}

	} catch (err) {
		console.error("Order confirmation failed:", err);
		swal.fire("Error", "Failed to confirm order", "error");
	}
	};

	if (session_id && gigId && buyerId) confirmOrder();
}, []);


return <div className="w-full h-screen flex items-center justify-center">Verifying your order...</div>;
};

export default PaymentSuccess;
