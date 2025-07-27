import './App.css';
import './index.css'
import {Route, BrowserRouter, Routes} from 'react-router-dom';

//Common
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';

import ForgotPasswordWithOTP from './pages/ForgotPassword.jsx';

//Auth
import SignUp from './pages/signup.jsx'
import LoginUser from './pages/login.jsx';

//Dashboard
import MyAccount from './pages/MyAccount.jsx';

// Gigs
import CreateGig from './components/Gigs/createGig.jsx'
import Gig from './pages/Gig.jsx'
import SingleGig from './components/Gigs/singleGig.jsx';

//User Context
import UserProvider from './context/UserContext.js';

import Explore from './pages/Explore.jsx';

function App() {
  return (
    <>
      <BrowserRouter>

        <UserProvider>

          <Routes>

            <Route exact path="/" element={<Landing />} />

            <Route exact path="/home" element={<Home />} />

            <Route exact path="/signup" element={<SignUp />} />

            <Route exact path="/login" element={<LoginUser />} />

            <Route exact path="/myAccount" element={<MyAccount />} />

            <Route exact path="/forgotPassword" element={<ForgotPasswordWithOTP />} />

            <Route exact path="/createGig" element={<CreateGig />} />

            <Route exact path="/gig" element={<Gig />} />

            <Route exact path="/gig/:id" element={<SingleGig />} />

            <Route exact path="/explore" element={<Explore />} />

          </Routes>

        </UserProvider>

      </BrowserRouter>
    </>
  );
}

export default App;
