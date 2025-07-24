import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert2";

const Log = () => {
    const navigate = useNavigate();

    const { isLoggedIn, setLoginStatus, profile } = useContext(UserContext);
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, []);

    const logout = async () => {
        try{
            let resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/logoutUser/`, { withCredentials: true });
            if (resp.data.success) {
                setLoginStatus(false);
                swal.fire({
                    title: "Success",
                    text: resp.data.message,
                    icon: "success",
                });
                navigate("/login");
            }
        } catch (error) {
            console.error("Error during logout:", error);
            swal.fire({
                title: "Error",
                text: error.response ? error.response.data.message : "Logout failed. Please try again.",
                icon: "error",
            });
        }
    }

    return (
        <>
            <div onClick={logout}>
                <h2>Logout</h2>
            </div>
        </>
    )

}

export default Log;

