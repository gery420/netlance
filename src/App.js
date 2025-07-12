import './App.css';
import {SignUp} from './pages/signup.jsx'
import {Login} from './pages/login.jsx';
import {Route, BrowserRouter, Routes} from 'react-router-dom';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
