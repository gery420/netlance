import LeftLogin from '../components/Login/LeftLogin.jsx';
import RightLogin from '../components/Login/RightLogin.jsx';

const LoginUser = () => {
    return (
        <>
            <div className="login-container max-sm:flex-col h-[100dvh] w-[100dvw] flex flex-row justify-center items-center">
                <LeftLogin />
                <RightLogin />
            </div>  
        </>
    )
}

export default LoginUser;
