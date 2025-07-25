import React, {useState, createContext, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    
    const getLoginStatus = () => {
        let login = window.localStorage.getItem("isLoggedIn");
        if (login == null) {
            window.localStorage.setItem("isLoggedIn", false);
            return false;
        }
        return JSON.parse(login);
    }

    const setLoginStatus = (val) => {
        window.localStorage.setItem("isLoggedIn", val);
        setLogin(val);
    }

    const [isLoggedIn, setLogin] = useState(getLoginStatus());

    const [profile, setProfile] = useState({
        name: "",
        username: "",
        email: "",
        phonenumber: "",
        country: "",
        desc: "",
        profilePicture: "",
        type: "",
    });

    const navigate = useNavigate();

    const getProfile = async () => {
        try {
            
            if (isLoggedIn){
                console.log("User Context is working fine");
                let resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/common/profile`, {
                    withCredentials: true,});
                console.log("Profile response:", resp.data);
                setProfile(resp.data.data.newUser);
            }
        
        } catch (err) {
            console.log("User Context problem")
            if (err.response.data.name === "AuthenticationError") {
                window.localStorage.setItem("isLoggedIn", false);
                setLogin(false);
            }
            navigate("/login");
            return;
        }
        
    };
    useEffect(() => {
        getProfile();
    }, [isLoggedIn]);

    return (
        <UserContext.Provider value={{ isLoggedIn, setLoginStatus, profile }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
