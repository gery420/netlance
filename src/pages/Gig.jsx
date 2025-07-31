
import MyGigs from "../components/Gigs/myGigs"
import swal from "sweetalert2";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";

const Gig = () => {

    const { isLoggedIn } = useContext(UserContext);
    useEffect(() => {
        if (!isLoggedIn) {
            swal.fire({
                title: "Access Denied",
                text: "You must be logged in to view your gigs.",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    });

    return (
        <> 
        <div className=" flex-col flex mt-[10dvh]">
            <MyGigs />  
        </div>
        </>
    )

}
export default Gig;
