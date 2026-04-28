import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import React from 'react';
import './App.css';
import Header from "./components/Header";
import MainPage from './pages/MainPages/MainPage';
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPages/Loginpage";
import MyPage from "./pages/MyPages/MyPage";


function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {!isLoginPage && <Header/>}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path='/home' element={<MainPage />} />
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/mypage' element={<MyPage />}/>
      </Routes>
      {!isLoginPage && <Footer/>}
    </div>
  );
}

export default App;