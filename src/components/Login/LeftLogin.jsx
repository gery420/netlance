import axios from "axios"
import React, { useState, useContext, useEffect } from "react";
import swal from "sweetalert2";
import {UserContext}  from "../../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LeftLogin = () => {

    const { isLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, []);

    let [data, setData] = useState({
        username: "",
        password: "",
        type: "" 
    })

    const [load , setload] = useState(false);
    const { setLoginStatus, setUser, setUserType } = useContext(UserContext);

    const submitLogin = async (event) => {
        try{

            if (data.username === "" || data.password === "") {
                swal.fire({
                    title: "Error",
                    text: "Username and Password cannot be empty!",
                    icon: "error",
                });
                return;
            } 

            if (data.type === "") {
                swal.fire({
                    title: "Error",
                    text: "Please select a user type!",
                    icon: "error",
                });
                return;
            }

            event.preventDefault();

            let postData = {
                username: data.username,
                password: data.password,
                type: data.type,
            }

            setload(true);

            let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/loginUser/`, postData, {
                withCredentials: true,
            });

            const { accessToken, user, userType } = res.data;
            console.log("Login response:", res.data.accessToken);
            if (res.data.success) {
                setLoginStatus(true, accessToken);
                setUser(user);
                setUserType(userType);
                swal.fire({
                    title: "Success",
                    text: res.data.message,
                    icon: "success",
                });
                console.log("Login response:", res.data);
                navigate("/");
            }
            setload(false);

        } catch (error) {
            console.error("Error during login:", error);
            swal.fire({
                title: "Error",
                text: error.response ? error.response.data.message : "Login failed. Please try again.",
                icon: "error",
            });
            setload(false);
            setLoginStatus(false);
        }
    }

    const updateLoginInfo = (event) => {
        const { name, value } = event.target;
        //setting the data
        setData((prevData) => { 
            return { ...prevData, [name]: value };
        });
    }

    return (
        <div>
            <div className="w-[100dvw] sm:w-[55dvw] xl:w-[40dvw] sm:mt-12 mt-52 sm:h-[90dvh] h-fit flex items-center justify-center">
                <div className=" w-[100%] sm:w-[100%] h-[100%] sm:h-[70%] flex flex-col items-center justify-start sm:m-9 m-2 shadow-[27px_27px_69px_rgb(219,215,219)] inset-[-27px_-27px_69px_rgb(255,255,255)] rounded-2xl border-[var(--black)]">
                    <div className="w-[100%] mt-8 flex items-start justify-start">
                        <Link to="/" className="text-[var(--black)] text-md sm:ml-9">←Back</Link>
                    </div>
                    <div className="flex flex-col h-[100%] mt-8 gap-2 items-center justify-center" >
                        <label htmlFor="userName" >
                        Username:
                            <input type="text" name="username" placeholder="Username" required onChange={updateLoginInfo} className=" mt-2 w-[100%] h-[50%] p-3 border-solid border-2 border-[var(--black)] rounded-2xl" />
                        </label>
                        <br />
                        <label htmlFor="password">
                        Password:
                            <input type="password" name="password" autoComplete="current-password" placeholder="Password" required onChange={updateLoginInfo} className=" mt-2 w-[100%] h-[50%] p-3 border-solid border-2 border-[var(--black)] rounded-2xl" />
                        </label>

                        <div className="w-[100%] flex items-start justify-start mt-4 text-[var(--purple)]">
                            <Link to="/forgotPassword">Forgot Password?</Link>
                        </div>

                        <div className="flex flex-row justify-center gap-10 items-center mt-4 w-[70%]">
                            <label htmlFor="type">
                            Seller
                                <input type="radio" name="type" value="seller" checked={data.type === "seller" ? true : false} onChange={updateLoginInfo} className="ml-4"  />
                            </label>
                            
                            <label htmlFor="type">
                            Buyer
                                <input type="radio" name="type" checked={data.type === "buyer" ? true : false} value="buyer" onChange={updateLoginInfo} className=" ml-4" />
                            </label>
                        </div>
                        <br />
                        <div className="flex justify-center items-center text-center h-full w-[70%]">
                            <button onClick={submitLogin} disabled={load} className={`w-[50%] h-[40%] mb-4 border-solid border-2 sm:mt-4 mt-0 border-[var(--black)] rounded-2xl ${load ? "bg-[var(--purple)] opacity-45 text-[var(--white)] cursor-not-allowed" : "hover:bg-[var(--purple)]"}`} type="submit"> {load? "Wait..": "Login"}</button>
                        </div>

                        <div className="w-[100%] mb-4 flex items-center justify-center">
                            <h1>Don't have an account? <Link to="/signup" className="text-[var(--purple)] underline">Sign up</Link></h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default LeftLogin;
