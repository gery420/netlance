import React, { useContext, useEffect } from "react";
import {UserContext} from "../context/UserContext";
import Form from "../components/myaccount/form";
import { useNavigate } from "react-router";

const MyAccount = () => {
    
    const navigate = useNavigate();
    
    const {isLoggedIn, profile} = useContext(UserContext);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
        console.log("Profile in MyAccount:", profile);
    }, [isLoggedIn]);

    return (
        <>

            <div>
                <Form profile={profile} />
            </div>

        </>
    )

}

export default MyAccount;
