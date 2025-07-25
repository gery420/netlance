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
    
    const logout = async () => {
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

    return (
        <div className=" p-6 size-full flex flex-col gap-7 items-center justify-center">

            <div className="w-full h-[20dvh] flex flex-row justify-between items-center">
                <h1 className="text-3xl text-center ml-10 text-[var(--black)] font-bold font-Nunito">Netlance Account</h1>
                <button onClick={logout} disabled={load} className={`w-[10%] h-[30%] border-solid font-bold border-2 border-[var(--black)] mr-10 rounded-3xl ${load ? "bg-[var(--purple)] opacity-45 text-[var(--white)] cursor-not-allowed" : "hover:bg-[var(--purple)]"}`} type="submit"> {load? "Wait..": "Log Out"}</button>
            </div>

            <div className=" p-10 size-full flex flex-row gap-20 flex-wrap">
                <div className=" p-6 w-[20%] h-[25%] flex flex-col gap-4 items-start justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                    <span className="text-lg font-bold">Name </span>
                    <div className="">
                        {profile.name}
                    </div>
                </div>

                <div className=" p-6 w-[20%] h-[25%] flex flex-col gap-4 items-start justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                    <span className="text-lg font-bold">Username </span>
                    <div className="">
                        {profile.username}
                    </div>
                </div>

                <div className=" p-6 w-[20%] h-[25%] flex flex-col gap-4 items-start justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                    <span className="text-lg font-bold">Phone Number </span>
                    <div className="">
                        {profile.phonenumber}
                    </div>
                </div>

                <div className=" p-6 w-[20%] h-[25%] flex flex-col gap-4 items-start justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                    <span className="text-lg font-bold">Email </span>
                    <div className="">
                        {profile.email}
                    </div>
                </div>

                <div className=" p-6 w-[20%] h-[25%] flex flex-col gap-4 items-start justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                    <span className="text-lg font-bold">Country </span>
                    <div className="">
                        {profile.country}
                    </div>
                </div>

                <div className=" p-6 w-[20%] h-[25%] flex flex-col gap-4 items-start justify-center rounded-[1rem] shadow-[27px_27px_69px_rgb(219,215,219)]">
                    <span className="text-lg font-bold">Seller Account? </span>
                    <div className="">
                        {profile.type==="seller" ? "Yes" : "No"}
                    </div>
                </div>

            </div>
        
        </div>
    )

}

export default Form;
