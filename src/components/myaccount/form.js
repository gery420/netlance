import { useEffect, useContext } from "react"
import { UserContext } from "../../context/UserContext";
import {Link} from "react-router-dom";

const Form = ({profile}) => {

    const { isLoggedIn } = useContext(UserContext);
    useEffect(() => {
        console.log("Profile data:", profile);
    }, [isLoggedIn]);

    return (
        <>

            <div>
                Username: {profile.username}
            </div>

            <div>
                Email: {profile.email}
            </div>
            
            <div>
                Phone Number: {profile.phonenumber}
            </div>

            <div>
                Country: {profile.country}
            </div>

            <div>
                Seller Account? : {profile.type === "seller" ? "Yes" : "No"}
            </div>

            <div>
                <Link to="/logout">LOGOUT</Link>
            </div>

            
        
        </>
    )

}

export default Form;
