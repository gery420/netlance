
import Navbar from '../components/common/Navbar.jsx';
import Hero from '../components/Home/Hero.jsx';
import Footer from '../components/Home/Footer.jsx';
import { useContext, useEffect } from 'react';
import {UserContext} from '../context/UserContext.js';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';

const Home = () => {

    const {isLoggedIn} = useContext(UserContext);    
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn) {
            swal.fire({
                title: "Welcome to Netlance",
                text: "Please login to explore our services.",
                icon: "warning",
            });
            navigate('/login');
        }
    }, [isLoggedIn]);

    return (
        <>
            <Navbar />
            <Hero />
            <Footer />
        </>
    )
}

export default Home;

