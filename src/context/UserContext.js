import React, {useState, createContext, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    
    const [isLoggedIn, setLogin] = useState(false);
    const [ userType, setUserType ] = useState(null); // Default user type
    const [ user , setUser ] = useState(null);
    const [ loadingUser , setLoadingUser ] = useState(true);
    const [ authToken , setAuthToken ] = useState(localStorage.getItem("authToken") || null);
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
    
    useEffect(() => {
        if (authToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            getProfile();
        }   
        else {
            delete axios.defaults.headers.common['Authorization'];
            setLoadingUser(false);
        }
    }, [authToken]);

    const getProfile = async () => {
        try {
            if (!authToken) {
                console.log("No auth token found, user not logged in");
                return;
            }
            
            console.log("User Context is working fine");
            let resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/common/profile`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            console.log("Profile response:", resp.data);
            const userData = resp.data.data.newUser;
            setProfile(userData);
            setUserType(userData.type);
            setUser(userData);
            setLogin(true);
            console.log("Profile set in UserContext:", userData);
                
        } catch (err) {
            console.log("User Context problem")
            if (err.response.data.name === "AuthenticationError") {
                setLoginStatus(false);
            }
            navigate("/login");
            localStorage.removeItem("authToken");
            setAuthToken(null);
            setLogin(false);
            setUser(null);
            setUserType(null);
            return;
        } finally {
            setLoadingUser(false);
        }
        
    };
       const setLoginStatus = (status, tokenFromLogin = null) => {
        setLogin(status);
        if ( status && tokenFromLogin ) {
            setAuthToken(tokenFromLogin);
            localStorage.setItem("authToken", tokenFromLogin);
            console.log("Auth token set in localStorage:", tokenFromLogin);
        } else {
            localStorage.removeItem("authToken");
            setAuthToken(null);
        }
    }


    return (
        <UserContext.Provider value={{ isLoggedIn, setLoginStatus, profile, user,setUser, userType,setUserType, authToken, setAuthToken, loadingUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
