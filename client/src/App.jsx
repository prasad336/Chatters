
import './index.css'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Home from './pages/Home'
import Chat from "./pages/Chat"
import Sidebar from "./pages/Sidebar"
import { useEffect, useState } from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import { useAuth } from './authContext'
const App = () => {
  useEffect(() => {
    document.title = "Chatterrs";
    
  }, []);
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
};

const Main = () => {
  const location = useLocation();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 700);

  const { isloggin } = useAuth()
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 700);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>

      {isloggin && location.pathname !== "/chat" && location.pathname !== "/login" && location.pathname !== "/register" && !isSmallScreen && <Sidebar />}
      {isloggin && location.pathname === "/chat" && !isSmallScreen && <Sidebar />}
      {isloggin && location.pathname === "/" && isSmallScreen && <Sidebar />}

      <Routes>
        {
          isloggin ? <>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
          </> : <>
            <Route path='/' element={<Register/>}></Route>
            <Route path='/register' element={<Register />}></Route>
            <Route path='/login' element={<Login />}></Route>

          </>
        }


      </Routes>
    </>
  );
};

export default App
