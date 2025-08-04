import { Link } from "react-router";
import {use, useContext , useState} from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const { isLoggedIn, userType } = useContext(UserContext);

    const [ data, setData ] = useState({
        search: ""
    });
    
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const searchQuery = data.search.trim();
        if (searchQuery) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
      
    return (
        <>  
            <div className="fixed z-50 top-0 w-[100dvw] sm:h-[10dvh] h-[20dvh]  bg-[var(--black)] flex flex-col sm:gap-[5dvw] sm:flex-row items-center justify-between">
                <div className="flex sm:w-[70%] gap-10 w-[100%] sm:gap-[10dvw] h-[100%] items-center justify-start">
                    <div className="ml-[5dvw] relative h-[100%] flex items-center justify-center">
                        <Link to="/" className="text-[var(--purple)] select-none text-[8dvh] font-bold font-Times">N</Link>                  
                    </div>
                    <div className="w-[100%] h-[100%] flex items-center justify-center">
                        <search className="w-full h-[5dvh] bg-white bg-opacity-90 rounded-full flex items-center justify-between">
                            <input type="text" name="search" value={data.search} onChange={handleChange} placeholder="Search for freelancers, gigs, etc." className="w-[80%] h-[100%] bg-transparent outline-none p-4 text-[var(--black)]" />
                            <button onClick={handleSearch} className="bg-[var(--purple)] text-white py-2 px-4 h-full w-20 rounded-full">Search</button>
                        </search>
                    </div>
                </div>

                {isLoggedIn ? (
                    
                    userType === "seller" ? (
                        <div className=" relative h-[100%] sm:w-[70%] w-[100%] flex gap-2 items-center text-center justify-evenly">
                            <Link to="/orders" className="text-[var(--white)] sm:text-[2dvh] text-[1.7dvh] font-Nunito">Orders</Link>
                            <Link to="/gig" className="text-[var(--white)] sm:text-[2dvh] text-[1.7dvh] font-Nunito">My Gigs</Link>
                            <Link to="/dashboard" className="text-[var(--white)] sm:text-[2dvh] text-[1.7dvh] font-Nunito">Dashboard</Link>
                            <Link to="/myAccount" className="w-[30%] lg:w-[25%] h-[40%] hover:bg-[var(--purple)] transition-all duration-200 ease-in-out border-2 border-solid rounded-xl flex items-center justify-center text-center bg-[#000011]">
                                <span className="text-[var(--white)] relative sm:text-[2dvh] text-[1.7dvh] font-Nunito">My Profile</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="mr-[2dvw] relative h-[100%] sm:w-[40%] lg:w-[25%] w-[70%] flex items-center text-center justify-evenly">
                            <Link to="/orders" className="text-[var(--white)] sm:text-[2dvh] text-[1.7dvh] font-Nunito">My Orders</Link>
                            <Link to="/myAccount" className="w-[40%] h-[40%] hover:bg-[var(--purple)] transition-all duration-200 ease-in-out border-2 border-solid rounded-xl flex items-center justify-center text-center bg-[#000011]">
                                <span className="text-[var(--white)] relative sm:text-[2dvh] text-[1.7dvh] font-Nunito">My Profile</span>
                            </Link>
                        </div>
                    )

                ) : (
                    <div className="mr-[2dvw] relative h-[100%] sm:w-[50%] lg:w-[35%] w-[70%] flex lg:gap-0 gap-8 items-center text-center justify-evenly">
                        <Link to="/" className="text-[var(--white)] w-full sm:text-[1.2rem] xl:text-[1.5rem] 2xl:text-[2dvh] text-[1rem] font-Nunito">Start Freelancing</Link>
                        <Link to="/login" className="w-[50%] lg:w-[40%] h-[40%] hover:bg-[var(--purple)] transition-all duration-200 ease-in-out border-2 border-solid rounded-xl flex items-center justify-center text-center bg-[#000011]">
                            <h className="text-[var(--white)] relative sm:text-[2dvh] text-[1.7dvh] font-Nunito">Sign In</h>
                        </Link>
                    </div>
                )}
            </div>
            
        </>
    )
}

export default Navbar;

