import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";
export const SignUp = () => {

    const navigate = useNavigate();
    let [data, setData] = useState({
        username: "",
        password: "",
        email: "",
        phoneNumber: "",
        country: "",
    })

    const [load, setload] = useState(false);

    const submit = async (event) => {
        try {
            event.preventDefault();
            let postData = {
                username: data.username,
                password: data.password,
                email: data.email,
                phoneNumber: data.phoneNumber,
                country: data.country
            }

            setload(true);

            let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/buyer/registerBuyer`, postData);
            console.log("Response from server:", res);

            if (res.data.success) {
                swal.fire({
                    title: "Registration Successful",
                    text: res.data.message,
                    icon: "success",
                })
                navigate("/login");
            }
            setload(false);
            setData({
                username: "",
                password: "",
                email: "",
                phoneNumber: "",
                country: ""
            });
            
        } catch (error) {
            console.error("Error during registration:", error);
            swal.fire({
                title: "Registration Failed",
                text: error.response ? error.response.data.message : "An error occurred during registration.",
                icon: "error",
            });
            setload(false);
        }
    }
    const updateInfo = (event) => {
        const { name, value } = event.target;
        //setting the data
        setData((prevData) => {
        return { ...prevData, [name]: value };
        });
    };

    return (
        <div>
        <h1>Signup Page</h1>
        <form method="post" >
            <label htmlFor="userName">
            Username:
            <input type="text" name="username" required onChange={updateInfo} />
            </label>
            <br />
            <label htmlFor="password">
            Password:
            <input type="password" name="password" autoComplete="current-password" onChange={updateInfo} required />
            </label>
            <br />
            <input type="email" name="email" placeholder="Email" required onChange={updateInfo}/>
            <br />
            <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={updateInfo}/>
            <br />
            <input type="text" name="country" placeholder="Country" required onChange={updateInfo}/>
            <br />

            <button onClick={submit} disabled={load? true : false} type="submit">Sign Up</button>
        </form>
        </div>
    );
}
