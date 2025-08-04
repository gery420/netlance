import { useState } from "react";
import axios from "axios";
import swal from "sweetalert2";
import { useNavigate , Link} from "react-router-dom";
import Navbar from "../components/common/Navbar";

export default function ForgotPasswordWithOTP() {
	
	const [email, setEmail] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const [otp, setOtp] = useState("");
	const [otpVerified, setOtpVerified] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

    const navigate = useNavigate();

	const api = axios.create({
		baseURL: `${process.env.REACT_APP_BACKEND_URL}/auth`,
		withCredentials: true,
	});

	const sendOtp = async () => {
		setLoading(true);
		try {
            await api.post("/forgotPassword", { email });
            setOtpSent(true);
            swal.fire({
                title: "Success",
                text: "OTP sent to your email. Please check your inbox.",
                icon: "success",
            });
		} catch (err) {
            swal.fire({
                title: "Error",
                text: err.response?.data?.message || "Error sending OTP.",
                icon: "error",
            });
        }
        setLoading(false);
	};

	const verifyOtp = async () => {
		setLoading(true);
		try {

            if (!otp) {
                swal.fire({
                    title: "Error",
                    text: "Please enter the OTP.",
                    icon: "error",
                });
                setLoading(false);
                return;
            }

            await api.post("/verifyOtp", { email, otp });
            setOtpVerified(true);
            swal.fire({
                title: "Success",
                text: "OTP verified successfully. You can now reset your password.",
                icon: "success",
            });
		} catch (err) {
            swal.fire({
                title: "Error",
                text: err.response?.data?.message || "OTP verification failed.",
                icon: "error",
            });
        }
		setLoading(false);
	};

	const resetPassword = async () => {
		
		setLoading(true);
		try {
            await api.post("/setPassword", { email, otp, newPassword });
            swal.fire({
                title: "Success",
                text: "Password reset successful. Please log in with your new password.",
                icon: "success",
        });
		setOtpSent(false);
		setOtpVerified(false);
		setEmail("");
		setOtp("");
		setNewPassword("");
        navigate("/login");
		} catch (err) {
            swal.fire({
                title: "Error",
                text: err.response?.data?.message || "Password reset failed.",
                icon: "error",
            });
        }
		setLoading(false);
	};

	return (
		<div>
            <Navbar />
            <div className="w-[100%] h-[100dvh] bg-[var(--purple)] flex items-center justify-center">
                <div className="w-[100%] sm:w-[30%] mt-[10dvh] relative h-[40%] bg-white p-5 rounded-lg shadow-[27px_27px_69px_rgb(219,215,219)] inset-[-27px_-27px_69px_rgb(255,255,255)] flex flex-col items-center justify-center">
                    
                    <div className="w-[100%] top-0 mb-2 flex items-start justify-start">
                            <Link to="/login" className="text-[var(--black)] text-md">←Back</Link>
                    </div>
                    
                    <h2 className=" mt-2 text-xl font-Nunito font-thin top-12">Password Reset</h2>

                        {!otpSent && (
                            <div className="w-full h-[80%] flex flex-col items-center justify-center">
                                <label htmlFor="email" className="sm:w-[80%] w-[100%] mb-10" > Email:
                                    <input
                                        placeholder="Email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-[100%] h-[50%] p-3 border-solid border-2 border-[var(--black)] rounded-2xl mt-2"
                                        />
                                </label>
                                <button onClick={sendOtp} disabled={loading} className={`sm:w-[30%] w-[40%] sm:h-[15%] h-[20%] border-solid border-2 border-[var(--black)] rounded-2xl ${loading ? "bg-[var(--purple)] opacity-45 text-[var(--white)] cursor-not-allowed" : "hover:bg-[var(--purple)]"}`}>
                                    {loading ? "Sending OTP..." : "Send OTP"}
                                </button>
                            </div>
                        )}

                        {otpSent && !otpVerified && (
                            <div className="w-full h-[80%] flex flex-col items-center justify-center">
                                <label htmlFor="otp" className="sm:w-[80%] w-[100%] mb-10">Enter OTP:
                                    <input
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                        className="w-[100%] h-[50%] p-3 border-solid border-2 border-[var(--black)] rounded-2xl mt-2"
                                        />
                                </label>
                            <button onClick={verifyOtp} disabled={loading} className={`sm:w-[30%] w-[40%] sm:h-[15%] h-[20%] border-solid border-2 border-[var(--black)] rounded-2xl ${loading ? "bg-[var(--purple)] opacity-45 text-[var(--white)] cursor-not-allowed" : "hover:bg-[var(--purple)]"}`}>
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                            </div>
                        )}

                        {otpVerified && (
                            <div className="w-full h-[80%] flex flex-col items-center justify-center">
                                <label className="sm:w-[80%] w-[100%] mb-10"> Enter New Password:
                                    <input
                                        placeholder="New Password"
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="w-[100%] h-[50%] p-3 border-solid border-2 border-[var(--black)] rounded-2xl mt-2"
                                        />
                                </label>
                            <button onClick={resetPassword} disabled={loading} className={`sm:w-[40%] w-[70%] sm:h-[18%] h-[20%] border-solid border-2 border-[var(--black)] rounded-3xl ${loading ? "bg-[var(--purple)] opacity-45 text-[var(--white)] cursor-not-allowed" : "hover:bg-[var(--purple)]"}`}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                            </div>
                        )}

                        {message && (
                            <div style={{ marginTop: "1rem", color: "gray" }}>
                            {message}
                            </div>
                        )}
                </div>
            </div>
		</div>
	);

}
