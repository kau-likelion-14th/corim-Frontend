import { Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';
import './App.css';
import Header from "./components/Header";
import MainPage from './pages/MainPages/MainPage';
import Footer from "./components/Footer";
//import MainPage from "/MainPage";
import LoginPage from "./pages/LoginPages/Loginpage";


function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {!isLoginPage && <Header/>}
      <Routes>
        <Route path='/home' element={<MainPage />} />
        <Route path='/login' element={<LoginPage />}/>
      </Routes>
      {!isLoginPage && <Footer/>}
    </div>
  );
}

export default App;