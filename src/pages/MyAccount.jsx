import React, { useContext, useEffect } from "react";
import {UserContext} from "../context/UserContext";
import Form from "../components/myaccount/form";
import { useNavigate} from "react-router";
import Navbar from "../components/Home/Navbar"

const MyAccount = () => {
    
    const navigate = useNavigate();
    
    const {isLoggedIn, profile} = useContext(UserContext);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
        console.log("Profile in MyAccount:", profile);
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
