import { Link } from "react-router";

const Navbar = () => {
    return (
        <>
            <div className="fixed top-0 z-50 w-[100dvw] h-[10dvh] bg-[var(--black)] flex items-center justify-between">
                <div className="ml-[5dvw] relative h-[100%] pointer-events-none flex items-center justify-center">
                    <div className="text-[var(--purple)] text-[8dvh] font-bold font-Times">N</div>                  
                </div>
                <div className="mr-[2dvw] relative h-[100%] sm:w-[40%] lg:w-[30%] w-[70%] flex items-center text-center justify-evenly">
                    <Link to="/order" className="text-[var(--white)] sm:text-[2dvh] text-[1.7dvh] font-Nunito">Orders</Link>
                    <Link to="/gig" className="text-[var(--white)] sm:text-[2dvh] text-[1.7dvh] font-Nunito">My Gigs</Link>

                    <Link to="/myAccount" className="w-[40%] lg:w-[30%] h-[40%] hover:bg-[var(--purple)] transition-all duration-200 ease-in-out border-2 border-solid rounded-xl flex items-center justify-center text-center bg-[#000011]">
                        <h className="text-[var(--white)] relative sm:text-[2dvh] text-[1.7dvh] font-Nunito">My Profile</h>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Navbar;

