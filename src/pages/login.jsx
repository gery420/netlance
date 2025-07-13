import axios from "axios"
import React, { useState } from "react";
import swal from "sweetalert2";


export const Login = () => {

    let [data, setData] = useState({
        username: "",
        password: "",
        type: "" 
    })

    const [load , setload] = useState(false);

    const submitLogin = async (event) => {
        try{
            event.preventDefault();

            let postData = {
                username: data.username,
                password: data.password,
                type: data.type,
            }

            setload(true);

            let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/loginUser/`, postData, {withCredentials: true});

            if (res.data.success) {
                swal.fire({
                    title: "Success",
                    text: res.data.message,
                    icon: "success",
                });
                console.log("Login response:", res.data);
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
        <h1>Login Page</h1>
        <form method="post" >
            <label htmlFor="userName">
            Username:
            <input type="text" name="username" required onChange={updateLoginInfo} />
            </label>
            <br />
            <label htmlFor="password">
            Password:
            <input type="password" name="password" autoComplete="current-password"  required onChange={updateLoginInfo} />
            </label>
            <label ></label>
            <input type="radio" name="type" value="seller" checked={data.type === "seller" ? true : false} onChange={updateLoginInfo} />
            <label ></label>
            <input type="radio" name="type" checked={data.type === "buyer" ? true : false} value="buyer" onChange={updateLoginInfo}/>
            <br />

            <button onClick={submitLogin} type="submit"> {load? "Loaing..": "Login"}</button>
        </form>
        </div>
    )
    
}
