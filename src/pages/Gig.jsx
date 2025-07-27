
import MyGigs from "../components/Gigs/myGigs"
import Navbar from "../components/common/Navbar"

const Gig = () => {

    return (
        <> 
            <Navbar />
            <div className=" flex-col flex mt-[10dvh]">
                <MyGigs />  
            </div>
        </>
    )

}
export default Gig;
