import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FriendCalendar from "./FriendCalendar";
import FriendTodo from "./FriendTodo";

import "../../styles/FriendDetailPage.css";

const Categories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  일상: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

const toDateKey = (date) => { // date 객체를 받아서 "YYYY-MM-DD" 형태의 문자열로 변환해주는 함수
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const dummyFriend = {
  followId: "1",
  name: "나나",
  tag: "1234",
  bio: "안녕하세요! 저는 나나입니다.",
  profileImage: null,
};

const dummySavedSongs = [
  {
    id: 1,
    title: "Ditto",
    artist: "NewJeans",
    imageUrl: null,
  },
];

const dummyTodosByDate = {
  "2026-05-04": [
    { id: 1, text: "프론트 보충자료 읽기", category: "공부", completed: true },
    { id: 2, text: "FriendDetailPage 주석 달기", category: "공부", completed: false },
  ],
  "2026-05-06": [
    { id: 3, text: "친구 페이지 과제 제출", category: "동아리", completed: true },
  ],
  "2026-05-10": [
    { id: 4, text: "React 복습하기", category: "공부", completed: false },
    { id: 5, text: "동아리 회의", category: "동아리", completed: false },
    { id: 6, text: "산책하기", category: "일상", completed: true },
  ],
};

const dummyRemainingByDate = {
  "2026-05-04": { hasTodo: true, remaining: 1 },
  "2026-05-06": { hasTodo: true, remaining: 0 },
  "2026-05-10": { hasTodo: true, remaining: 2 },
};

function FriendDetailPage() {
  const navigate = useNavigate();
  const location = useLocation(); // 이전 페이지에서 navigate 함수를 통해 화면을 넘어올때 숨겨서 보낸 state 보따리를 꺼내기 위해 사용함

  const passedFriend = location.state?.friend ?? null; // 이전 페이지에서 넘겨준 friend 데이터 객체가 있으면 꺼내고 없으면 null 저장

  const [friend] = useState(passedFriend ?? dummyFriend); // 화면에 띄울 친구 정보 스테이트, 전달받은 데이터가 있으면 쓰고 없으면 화면이 깨지지 않게 미리 만들어둔 dummyfriend를 기본값으로 세팅
  const [savedSongs] = useState(dummySavedSongs);

  const [selectedDate, setSelectedDate] = useState(new Date("2026-05-04")); // 달력에서 사용자가 마우스로 클릭한 날짜는 저장하는 스테이트, 이 값이 바뀌면 하단의 투두 리스트 화면이 해당 날짜 데이터로 바뀜
  const [viewDate, setViewDate] = useState(new Date("2026-05-04"));

  const [todosByDate] = useState(dummyTodosByDate); // 전체 날짜별 투두 데이터를 가지고 있는 스테이드
  const [remainingByDate] = useState(dummyRemainingByDate);

  const latestSong = useMemo(() => { // 저장된 노래 배열이 바뀔 때만 배열의 0번째 곡 데이터를 뽑아냄, 매번 계산하지 않고 값을 기억해둠
    if (!Array.isArray(savedSongs) || savedSongs.length === 0) return null;
    return savedSongs[0];
  }, [savedSongs]);

  const todos = useMemo(() => { // selecteddate state가 바뀔 때마다 전체 투두 데이터에서 해당 날짜를 key로 검색해 그 날의 할 일 배열만 쏙 뽑아냄
    const key = toDateKey(selectedDate);
    return todosByDate[key] ?? []; // 만약 해당 날짜에 데이터가 아예 없으면 빈 배열을 반환해 화면에 에러 대신 빈 목록이 뜨게함
  }, [selectedDate, todosByDate]);

  return ( // 화면에 띄울 요소들
    <div className="friend-detail-page">
      <div className="friend-detail-page__inner">
        <div className="friend-detail-page__top">
          <button
            type="button"
            className="friend-detail-page__back"
            aria-label="뒤로가기"
            onClick={() => navigate(-1)} // 이 버튼을 클릭하면 브라우저 히스토리를 1단계 뒤로 되돌려 이전 페이지로 화면이 전환됨
          >
            ‹
          </button>

          <div className="friend-detail-page__profile">
            <div className="friend-detail-page__avatar" aria-hidden="true">
              {friend?.profileImage ? ( // 프로필 이미지 데이터가 있으면 img 태그 화면을 렌더링하고 없으면 기본 아이콘 컴포넌트를 렌더링
                <img
                  src={friend.profileImage}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <UserIcon />
              )}
            </div>

            <div className="friend-detail-page__profile-info">
              <div className="friend-detail-page__name-line">
                <span className="friend-detail-page__name">
                  {friend?.name || " "} {/* 위에서 초기화한 friend state에서 이름 데이터를 꺼내와 화면에 출력 */}
                </span>
              </div>
              <div className="friend-detail-page__bio">
                {friend?.bio || "한 줄 소개"} {/* bio 데이가 있으면 출력, 없으면 '한 줄 소개' 출력 */}
              </div>
            </div>
          </div>

          <div className="friend-detail-page__songs-inline">
            {latestSong ? ( // usememo로 걸러낸 노래 데이터가 존재하면 노래 정보 ui를 화면에 글리고 없으면 '저장한 곡이 없습니다' 텍스를 렌더링
              <div className="friend-detail-page__song-inline-item">
                <div className="friend-detail-page__song-inline-cover">
                  {latestSong?.imageUrl ? (
                    <img
                      src={latestSong.imageUrl}
                      alt={latestSong.title || "album"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  ) : null}
                </div>

                <div className="friend-detail-page__song-inline-info">
                  <div className="friend-detail-page__song-inline-title">
                    {latestSong?.title || "제목 없음"}
                  </div>
                  <div className="friend-detail-page__song-inline-artist">
                    {latestSong?.artist || "아티스트 정보 없음"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="friend-detail-page__songs-inline-empty">
                저장한 곡이 없습니다.
              </div>
            )}
          </div>
        </div>

        <div className="friend-detail-page__grid">
          <div className="friend-detail-page__calendar">
            <FriendCalendar
              initialDate={selectedDate}
              onDateChange={(date) => date && setSelectedDate(date)} // 자식 컴포넌트에서 특정 날짜를 마우스로 클릭하면 이 함수가 실행되어 부모의 selectedDate state가 바뀜 > 전체 화면이 재렌더링되며 오른쪽 투두 리스트가 클릭한 날짜에 맞게 변경됨 
              onMonthChange={(date) => {
                if (!date) return;
                setViewDate(date);
              }}
              todosByDate={todosByDate}
              remainingByDate={remainingByDate}
            />
          </div>

          <div className="friend-detail-page__todo">
            <FriendTodo
              title="To do List"
              todos={todos} // 위쪽의 usememo에서 뽑아낸 클릭된 날짜의 투두 배열을 자식에게 props로 넘겨주오 화면에 리스트를 그리게 함
              categories={Categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default FriendDetailPage;