
import RightSignUp from "../components/Signup/RightSignUp.jsx";
import LeftSignUp from "../components/Signup/LeftSignUp.jsx";

const SignUp = () => {
    return (
        <div className="flex flex-row w-[100dvw] h-[100dvh]">
            <LeftSignUp />
            <RightSignUp />
        </div>
    );
}
export default SignUp;
