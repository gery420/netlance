import Navbar from "../components/common/Navbar.jsx";
import LeftSignUp from "../components/Signup/LeftSignUp.jsx";

const SignUp = () => {
    return (
        <>
            <Navbar />
            <div className="flex flex-row justify-center items-center">
                <LeftSignUp />
            </div>
        </>
    );
}
export default SignUp;
