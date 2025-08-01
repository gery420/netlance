
import Navbar from '../components/common/Navbar.jsx';
import Hero from '../components/Landing/Hero.jsx';
import Footer from '../components/Landing/Footer.jsx';
import { useContext, useEffect } from 'react';
import {UserContext} from '../context/UserContext.js';
import { useNavigate } from 'react-router-dom';

const Landing = () => {

    const {isLoggedIn} = useContext(UserContext);    
    const navigate = useNavigate();
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
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

export default Landing;

