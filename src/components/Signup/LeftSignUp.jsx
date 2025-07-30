import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";

const LeftSignUp = () => {

    const navigate = useNavigate();
    let [data, setData] = useState({
        name: "",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phonenumber: "",
        country: "",
        type:"",
        profilePicture: ""
    })

    const [load, setload] = useState(false);
    const {isLoggedIn} = useContext(UserContext);

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/myAccount");
        }
    });

    const submit = async (event) => {
        try {

            if (data.password !== data.confirmPassword) {
                swal.fire({
                    title: "Error",
                    text: "Your passwords do not match!",
                    icon: "error",
                });
                setData((prevState) => {
                    return { ...prevState, password: "", confirmPassword: "" };
                });
                return;
            }

            if (data.password.length < 8) {
                swal.fire({
                    title: "Error",
                    text: "Password must be at least 8 characters long!",
                    icon: "error",
                });
                setData((prevState) => {
                    return { ...prevState, password: "", confirmPassword: "" };
                });
                return;
            }

            if (data.name === "" || data.username === "" || data.password === "" || data.email === "" || data.phonenumber === "" || data.country === "" || data.type === "") {
                swal.fire({
                    title: "Incomplete Form",
                    text: "Complete all fields!",
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

            if (data.username.length < 6 || data.username.length > 25) {
                swal.fire({ 
                    title: "Error",
                    text: "Username must be between 6 and 25 characters long!",
                    icon: "error",
                });
                setData((prevState) => {
                    return { ...prevState, username: "" };
                });
                return;
            }

            if (data.phonenumber.length < 10) {
                swal.fire({
                    title: "Error",
                    text: "Phone number must be at least 10 digits long!",
                    icon: "error",
                });
                setData((prevState) => {
                    return { ...prevState, phonenumber: "" };   
                });
                return;
            }

            event.preventDefault();
            
            const postData = new FormData();
            postData.append("name", data.name);
            postData.append("username", data.username);
            postData.append("password", data.password);
            postData.append("email", data.email);
            postData.append("phonenumber", data.phonenumber);
            postData.append("country", data.country);
            postData.append("type", data.type);
            postData.append("profilePicture", data.profilePicture);

            setload(true);

            if (data.type === "buyer") {

                let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/buyer/registerBuyer`, postData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                console.log("Response from server:", res);

                setload(false);
                setData({
                    name: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
                    email: "",
                    phonenumber: "",
                    country: "",
                    type: "",
                    profilePicture: ""
                });
                if (res.data.success) {
                    swal.fire({
                        title: "Registration Successful",
                        text: res.data.message,
                        icon: "success",
                    })
                    navigate("/login");
                }
            } else if (data.type === "seller") {
                let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/seller/registerSeller`, postData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                console.log("Response from server:", res);

                setload(false);
                setData({
                    name: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
                    email: "",
                    phonenumber: "",
                    country: "",
                    type: "",
                    profilePicture: ""
                });
                if (res.data.success) {
                    swal.fire({
                        title: "Registration Successful",
                        text: res.data.message,
                        icon: "success",
                    })
                    navigate("/login");
                }
            }
            
        } catch (error) {
            setload(false);
            console.error("Error during registration:", error);
            swal.fire({
                title: "Registration Failed",
                text: error.response ? error.response.data.message : "An error occurred during registration.",
                icon: "error",
            });
        }
    }
    const updateInfo = (event) => {
        const { name, value, files, type } = event.target;
        //setting the data
        if (type === "file") {
            setData((prevData) => {
                return { ...prevData,
                    profilePicture: files[0] };
            });
        } else {
            setData((prevData) => {
                return { ...prevData, [name]: value };
            });
        }
    };

    return (
        <div>
            <div className="relative w-[70dvw] max-sm:h-[50vh] h-[100dvh] bg-[var(--white)] flex items-center justify-center">
                <div className="w-[60%] relative h-[80%] flex items-center justify-center m-9 shadow-[27px_27px_69px_rgb(219,215,219)] inset-[-27px_-27px_69px_rgb(255,255,255)] rounded-2xl border-[var(--black)]">
                    <div className="w-[100%] top-0 mt-8 mb-2 absolute flex items-start justify-start">
                        <Link to="/" className="text-[var(--black)] text-md ml-9">←Back</Link>
                    </div>
                    <div className="flex flex-col gap-2 relative items-center justify-center w-[70%] h-[100%]" >
                        <div className="flex flex-row gap-4 items-center justify-evenly w-[100%]">
                            <label htmlFor="name" className="w-[100%]">
                            Full Name:
                                <input type="text" value={data.name} name="name" placeholder="Full Name" required onChange={updateInfo} className=" mt-1 w-[100%] h-[50%] p-2 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                            <br />
                            <label htmlFor="userName" className="w-[90%]">
                            Username:
                                <input type="text" value={data.username} name="username" placeholder="Username" required onChange={updateInfo} className=" mt-1 w-[100%] h-[50%] p-2 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                        </div>
                        <br />
                        <div className="flex flex-row gap-4 items-start justify-evenly w-[100%]">
                            <label htmlFor="password" className="w-[100%]">
                            Password:
                                <input type="password" value={data.password} name="password" placeholder="Password" autoComplete="current-password" onChange={updateInfo} required className=" mt-1 w-[100%] h-[50%] p-2 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                            <br />
                            <label htmlFor="password" className="w-[100%]">
                            Confirm Password:
                                <input type="password" value={data.confirmPassword} name="confirmPassword" placeholder="Password" autoComplete="current-password" onChange={updateInfo} required className=" mt-1 w-[100%]  h-[50%] p-2 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                        </div>
                        <br />
                        <div className="flex flex-row gap-4 items-start justify-evenly w-[100%]">
                            <label htmlFor="profilePicture" className="w-[100%]">
                            Profile Picture:
                                <input type="file" accept="image/*"  name="profilePicture" onChange={updateInfo} className=" mt-1 w-[100%] h-[60%] p-2 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                            <label htmlFor="email" className="w-[100%]">
                            Email:
                                <input type="email" name="email" value={data.email} placeholder="Email" required onChange={updateInfo} className=" mt-1 w-[100%]  h-[60%] p-2 border-solid border-2 border-[var(--black)] rounded-2xl"/>
                            </label>
                        </div>
                        <br />
                        <div className="flex flex-row gap-4 items-start justify-evenly w-[100%]">
                            <label htmlFor="phonenumber" className="w-[100%]">
                            Phone Number:
                                <input type="text" name="phonenumber" value={data.phonenumber} placeholder="Phone Number" required onChange={updateInfo} className=" mt-1 w-[100%] h-[60%] p-2 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                            <br />
                            <label htmlFor="country" className="w-[100%]">
                            Country:
                                <input type="text" name="country" value={data.country} placeholder="Country" required onChange={updateInfo} className=" mt-1 w-[100%] h-[60%] p-2 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                        </div>
                        <br />
                        <div className="flex flex-row justify-evenly items-center w-[70%] mb-10">
                            <label htmlFor="type">
                            Seller
                                <input type="radio" name="type" value="seller" checked={data.type === "seller" ? true : false} onChange={updateInfo} className="ml-4"  />
                            </label>
                            
                            <label htmlFor="type">
                            Buyer
                                <input type="radio" name="type" checked={data.type === "buyer" ? true : false} value="buyer" onChange={updateInfo} className=" ml-4" />
                            </label>
                        </div>
                        <div className="flex justify-center items-center w-[100%]">
                            <button onClick={submit} disabled={load} className={`w-[20%] h-[110%] p-1 relative border-solid border-2 border-[var(--black)] rounded-2xl ${load ? "bg-[var(--purple)] opacity-45 text-[var(--white)] cursor-not-allowed" : "hover:bg-[var(--purple)]"}`} type="submit">{load? "Wait..": "Sign Up" }</button>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeftSignUp;
