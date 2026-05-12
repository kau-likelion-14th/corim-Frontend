import { Routes, Route, useLocation,Navigate} from 'react-router-dom';
import React from 'react';
import './App.css';
import Header from "./components/Header";
import MainPage from './pages/MainPages/MainPage';
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPages/Loginpage";
import MyPage from "./pages/MyPages/MyPage";
import FriendPage from './pages/FriendPage/FriendPage';
import FriendDetailPage from './pages/FriendPage/FriendDetailPage';



function App() {
  const location = useLocation(); // 브라우저의 현재 주소 정보를 가져오고 주소창 값이 바뀔때마다 화면을 재렌더링
  const isLoginPage = location.pathname === '/login'; // 현재 주소가 /login 인지 확인하고 True/False값 저장

  return ( //화면에 띄울 컴포넌트들
    <div className="app-container"> 
      {!isLoginPage && <Header/>} {/* 로그인 페이지면 헤더 안뜨게, isLoginPage가 False(현재주소 login아님)일때만 헤더 뜨게*/}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} /> {/* 기본 화면이 로그인화면이 뜨게 */}
          
          <Route path='/home' element={<MainPage />} /> {/* 주소가 /home이면 mainpage 컴포넌트 렌더링 */}
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/mypage' element={<MyPage />}/>
          <Route path="/friends" element={<FriendPage />} />
          <Route path="/friends/:id" element={<FriendDetailPage />} /> {/* :id 라는 변하는 값을 사용, 사용자가 친구 리스트에서 1번 친구
          를 클릭해 URL이 /friend/1로 바뀌면 FriendDetailPage 컴포넌가 렌더링되고 이 컴포넌트 안에서 1이라는 고유 id를 이용해 친구의 데이터를 화면에 그리게 함  */}
        </Routes>
      </main>

      {!isLoginPage && <Footer/>} {/* 헤더와 마찬가지로 로그인 페이지면 푸터 안뜨게 함*/}
    </div>
  );
}

export default App;