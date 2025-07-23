import './App.css';
import './index.css'
import {Route, BrowserRouter, Routes} from 'react-router-dom';

//Common
import Landing from './pages/Landing.jsx';

//Auth
import SignUp from './pages/signup.jsx'
import Login from './pages/login.jsx';
import Log from './pages/Logout.jsx';

//Dashboard
import MyAccount from './pages/MyAccount.jsx';

//User Context
import UserProvider from './context/UserContext.js';

function App() {
  return (
    <>
      <BrowserRouter>

        <UserProvider>

          <Routes>

            <Route exact path="/" element={<Landing />} />

            <Route exact path="/signup" element={<SignUp />} />

            <Route exact path="/login" element={<Login />} />

            <Route exact path="/myAccount" element={<MyAccount />} />

            <Route exact path="/logout" element={<Log />} />

          </Routes>

        </UserProvider>

      </BrowserRouter>
    </>
  );
}

export default App;
