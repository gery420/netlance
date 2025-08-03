
import MyGigs from "../components/Gigs/myGigs"
import swal from "sweetalert2";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";

const Gig = () => {

    return (
        <> 
        <div className=" flex-col flex">
            <MyGigs />  
        </div>
        </>
    )

}
export default Gig;
