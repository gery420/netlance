import { useEffect, useContext, useState } from "react"
import { UserContext } from "../../context/UserContext";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import swal from "sweetalert2";

const Form = ({profile}) => {

    const { isLoggedIn, setLoginStatus } = useContext(UserContext);
    useEffect(() => {
        console.log("Profile data:", profile);
    }, [isLoggedIn]);

    const navigate = useNavigate();

    const [load , setLoad] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ save , setSave ] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // ✨ NEW

    const [name, setName] = useState(profile.name);
    const [username, setUsername] = useState(profile.username);
    const [phonenumber, setPhonenumber] = useState(profile.phonenumber);

    const [ newPassword, setNewPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");

    useEffect(() => {
        setName(profile.name || "");
        setUsername(profile.username || "");
        setPhonenumber(profile.phonenumber || "");
    }, [profile]);

    const logout = async (e) => {
        e.preventDefault();
        try{
            setLoad(true);
            let resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/logoutUser/`, { withCredentials: true });
            if (resp.data.success) {
                setLoginStatus(false);
                swal.fire({
                    title: "Success",
                    text: resp.data.message,
                    icon: "success",
                });
                navigate("/");
            }
            setLoad(false);
        } catch (error) {
            console.error("Error during logout:", error);
            swal.fire({
                title: "Error",
                text: error.response ? error.response.data.message : "Logout failed. Please try again.",
                icon: "error",
            });
            setLoad(false);
        }
    }

    const handleReset = async (e) => {
        e.preventDefault();
        try {

            if (newPassword === "" || confirmPassword === "") {
                swal.fire({
                    title: "Error",
                    text: "Please fill in all fields.",
                    icon: "error",
                });
                return;
            }

            if (newPassword !== confirmPassword) {
                swal.fire({
                    title: "Error",
                    text: "Passwords do not match.",
                    icon: "error",
                });
                return;
            }

            setLoading(true);
            let resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/resetPassword/`, { newPassword }, { withCredentials: true });
            if (resp.data.success) {
                swal.fire({
                    title: "Success",
                    text: resp.data.message,
                    icon: "success",
                });
            }
            setLoading(false);
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error during password reset:", error);
            swal.fire({
                title: "Error",
                text: error.response ? error.response.data.message : "Password reset failed. Please try again.",
                icon: "error",
            });
            setLoading(false);
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSave(true);
            let resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/updateProfile/`, {
                name,
                username,
                phonenumber
            }, { withCredentials: true });

            if (resp.data.success) {
                swal.fire({
                    title: "Success",
                    text: resp.data.message,
                    icon: "success",
                });
                setIsEditing(false);
                profile.name = name;
                profile.username = username;
                profile.phonenumber = phonenumber;
            }
            setSave(false);
        } catch (error) {
            console.error("Error during profile update:", error);
            swal.fire({
                title: "Error",
                text: error.response ? error.response.data.message : "Profile update failed. Please try again.",
                icon: "error",
            });
            setSave(false);
        }
    }

    return (
        <div className=" p-6 size-full flex flex-col items-center justify-center">
            <div className="w-full h-[20dvh] flex flex-row justify-between items-center">
                <h1 className="text-3xl text-center ml-10 text-[var(--black)] font-bold font-Nunito">Netlance Account</h1>
                <div className="flex w-[50%] h-[100%] flex-row gap-10 items-center justify-end">
                    {isEditing && (
                        <button onClick={handleSave} disabled={save} className={`w-[20%] h-[30%] transition-all ${save ? "bg-[var(--purple)] opacity-45 text-[var(--white)] cursor-not-allowed" : "hover:bg-[var(--purple)]"} duration-200 ease-in-out border-solid font-bold border-2 border-[var(--black)] rounded-3xl hover:bg-[var(--purple)]`}>
                            Save
                        </button>
                    )}
                    <button onClick={() => setIsEditing(prev => !prev)}
                        className={`w-[20%] h-[30%] transition-all duration-200 ease-in-out border-solid font-bold border-2 border-[var(--black)] rounded-3xl ${isEditing ? "border-red-600 text-red-600" : "hover:bg-[var(--purple)]"}`}
                    >
                        {isEditing ? "Cancel Edit" : "Edit"}
                    </button>
                    <button onClick={logout} disabled={load} className={`w-[20%] h-[30%] transition-all duration-200 ease-in-out border-solid font-bold border-2 border-[var(--black)] mr-10 rounded-3xl ${load ? "bg-[var(--purple)] opacity-45 text-[var(--white)] cursor-not-allowed" : "hover:bg-[var(--purple)]"}`} type="submit"> {load? "Wait..": "Log Out"}</button>
                </div>
            </div>


            <div className=" p-10 w-full h-[100%] flex flex-row gap-16 items-center justify-center flex-wrap">
                <div className="w-[20%] h-[50%] flex items-center justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                    <img src={profile.profilePicture} alt="Profile" className="w-32 h-32 rounded-full" />
                </div>
                <div className="flex flex-row gap-20 w-[70%] items-center justify-center flex-wrap">
                    <div className=" p-6 w-[25%] h-[25%] flex flex-col gap-4 items-start justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                        <span className="text-lg font-bold">Name </span>
                        <div>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    name="name" 
                                    placeholder="Name" 
                                    className="border rounded-xl w-full" 
                                />
                            ) : (
                                profile.name
                            )}
                        </div>
                    </div>
                    
                    <div className=" p-6 w-[25%] h-[25%] flex flex-col gap-4 items-start justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                        <span className="text-lg font-bold">Username </span>
                        <div>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    name="username" 
                                    placeholder="Username" 
                                    className="border rounded-xl w-full" 
                                />
                            ) : (
                                profile.username
                            )}
                        </div>
                    </div>

                    <div className=" p-6 w-[25%] h-[25%] flex flex-col gap-4 items-start justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                        <span className="text-lg font-bold">Phone Number </span>
                        <div>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={phonenumber} 
                                    onChange={(e) => setPhonenumber(e.target.value)} 
                                    name="phonenumber" 
                                    placeholder="Phone Number" 
                                    className="border rounded-xl w-full" 
                                />
                            ) : (
                                profile.phonenumber
                            )}
                        </div>
                    </div>
                    <div className=" p-6 w-[25%] h-[25%] flex flex-col gap-4 items-start justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                        <span className="text-lg font-bold">Email </span>
                        <div>
                            {profile.email}
                        </div>
                    </div>

                    <div className=" p-6 w-[25%] h-[25%] flex flex-col gap-4 items-start justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                        <span className="text-lg font-bold">Country </span>
                        <div>
                            {profile.country}
                        </div>
                    </div>

                    <div className=" p-6 w-[25%] h-[25%] flex flex-col gap-4 items-start justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                        <span className="text-lg font-bold">Seller Account? </span>
                        <div>
                            {profile.type==="seller" ? "Yes" : "No"}
                        </div>
                    </div>
                </div>


                <div className=" p-6 w-[45%] h-[25%] flex flex-col gap-4 items-start justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                    <span className="text-lg font-bold">Reset Password </span>
                    <div className="flex flex-row items-start justify-start w-full">
                        <div className="flex flex-row gap-4 items-start justify-start w-full">
                            <label>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} name="newPassword" placeholder="New Password" className="border p-3 rounded-xl w-full" />
                            </label>
                            <label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} name="confirmPassword" placeholder="Confirm New Password" className="border p-3 rounded-xl w-full" />
                            </label>
                        </div>
                        <button className={`bg-[var(--purple)] w-[15%] text-[var(--white)] p-3 ${loading ? "bg-[var(--purple)] opacity-45 text-[var(--white)] cursor-not-allowed" : "hover:bg-[var(--purple)]"} rounded-xl transition-all duration-200 ease-in-out`} onClick={handleReset}>Reset</button>
                    </div>
                </div>
            </div>
        
        </div>
    )

}

export default Form;
