import React, { useContext, useEffect } from "react";
import {UserContext} from "../context/UserContext";
import Form from "../components/myaccount/form";
import { useNavigate} from "react-router";
import Navbar from "../components/common/Navbar"
import swal from "sweetalert2";

const MyAccount = () => {
    
    const navigate = useNavigate();

    const {isLoggedIn, profile, loadingUser, authToken} = useContext(UserContext);

    useEffect(() => {
        const checkAccessAndFetch = async () => {
            if (loadingUser) {
                return;   
            }
            if (!isLoggedIn || !profile || !authToken) {
                swal.fire({
                    title: "Access Denied",
                    text: "You must be logged in to access your account.",
                    icon: "error",
                });
                navigate("/login");
                return;
            }
        }
        checkAccessAndFetch();
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center mt-[10dvh] justify-center h-[90vh]">
                <Form profile={profile} />
            </div>

        </>
    )

}

export default MyAccount;
