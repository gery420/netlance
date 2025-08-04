import LeftLogin from '../components/Login/LeftLogin.jsx';
import Navbar from '../components/common/Navbar.jsx';

const LoginUser = () => {
    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center">
                <LeftLogin />
            </div>  
        </>
    )
}

export default LoginUser;
