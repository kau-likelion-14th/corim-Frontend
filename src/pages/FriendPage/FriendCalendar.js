import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useState } from "react";
import "../../styles/Calendar.css";

const toDateKey = (date) => { // 자바 스크립트의 Date 객체를 받아 "2026-04-01" 같은 문자열 형태로 바꿔주는 함수
  const y = date.getFullYear(); // 년도를 y에
  const m = String(date.getMonth() + 1).padStart(2, "0"); // 월을 m에, 월은 0부터 시작하므로 1을 더해주고 한자리수면 옆에 0을 붙여줌
  const d = String(date.getDate()).padStart(2, "0"); // 일을 d에
  return `${y}-${m}-${d}`;
};

const dummyTodosByDate = { // 날짜 문자열을 key로 해당 날짜의 할 일 목록을 value로 가지는 객체
  "2026-05-04": [
    { id: 1, title: "프론트 보충자료 읽기", completed: true }, // 프론트 보충 자료 읽기, 끝냈다는 표시
    { id: 2, title: "FriendCalendar 주석 달기", completed: false },
  ],
  "2026-05-06": [
    { id: 3, title: "친구 페이지 과제 제출", completed: true },
  ],
  "2026-05-10": [
    { id: 4, title: "React 복습하기", completed: false },
    { id: 5, title: "props 정리하기", completed: false },
    { id: 6, title: "useState 정리하기", completed: true },
  ],
};

export default function FriendCalendar() { // frienddetailpage등에서 호출되어 화면에 달력을 렌더링하고 관리하는 컴포넌트
  const [selectedDate, setSelectedDate] = useState(new Date()); // 사용자가 달력에서 마우스로 클릭한 날짜 정보를 상태로 저장, 초기값은 현재 컴퓨터 시간 기준 오늘 날짜

  const handleDateChange = (value) => { // 사용자가 달력의 특정 타일(날짜)을 클릭하면 이 함수 실행
    const next = value instanceof Date ? value : value?.[0]; // 날짜 값이 정상적으로 넘어왔는지 확인 및 정제
    if (!next) return;
    setSelectedDate(next); // 클릭한 날짜 값으로 selecteddate 상태를 업데이트 > 상태가 바뀌었으므로 달력 화면을 재렌더링하고 클릭한 날짜 칸의 값이 선택됨 상태로 바뀝니다.
  };

  const getDayMeta = (date) => { // 달력 컴포넌트가 화면에 각 날짜 칸들을 그릴때, 모든 날짜마다 한번씩 이 함수를 실행하여 화면에 어떤 기호/색상을 띄울지 결정
    const key = toDateKey(date); // 달력의 해당 칸 날짜를 YYYY-MM-DD 형태의 문자열로 변환
    const list = dummyTodosByDate[key] ?? []; // ?? : 널 병합 연산자 , 해당 날짜의 투두 데이터가 객체에 없으면 에러가 나지 않게 빈 배열을 기본값으로 꺼내옴

    if (list.length === 0) { // 빈 배열이면 할 일이 없다는 정보를 반환하고 종료
      return { hasTodos: false, remaining: 0, allDone: false };
    }

    const remaining = list.filter((todo) => !todo.completed).length; // 데이터 필터링, 해당 날짜의 투두 배열을 돌면서 completed 값이 false인 투두만 필터링해서 새 배열을 만들고 그 배열의 길이를 구함(날은 할 일 개수)

    return { // 할일이 존재함 (True), 남은 개수, 남은 개수가 0개인지를 객체로 묶어서 반환
      hasTodos: true,
      remaining,
      allDone: remaining === 0,
    };
  };

  return (
    <div className="calendar-container"> /
      <Calendar // 외부 라이브러리를 가져와 화면을 렌더링
        onChange={handleDateChange} // 사용자가 클릭할때마다 handledatechange 함수가 실행됨
        value={selectedDate} // 현재 state인 selecteddate를 넘겨주어 달력에 해당 날짜가 포커스되게 함
        calendarType="gregory"
        view="month"
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={true}
        formatDay={(locale, date) => String(date.getDate())} // 날짜에 '일' 글자를 빼고 숫자만 깔끔하게 보이게 함
        tileContent={({ date, view }) => { // 달력 칸 내부에 ui 추가, 달력의 각 날짜 칸 내부에 html 요소를 추가로 그리는 속성
          if (view !== "month") return null;

          const { hasTodos, remaining, allDone } = getDayMeta(date); // 현재 그리고 있는 타일의 날짜 데이터를 분석 함수에 넣고 결과를 받음
          if (!hasTodos) return null; // 할 일이 없는 날짜 칸이면 아무것도 안 그림

          return <div className="tile-meta">{allDone ? "★" : remaining}</div>; // allDone이 True면 화면에 별을 렌더링하고 False면 화면에 남은 개수를 렌더링
        }}
        tileClassName={({ date, view }) => { // 데이터 상태에 따라 각 날짜 칸에 서로 다른 문자열을 달아줘 화면 생상을 바꿉니다.
          if (view !== "month") return "";

          const { hasTodos, allDone } = getDayMeta(date);
          if (!hasTodos) return "";

          return allDone ? "tile-done" : "tile-has"; // 전부 완료했으면 타일에 tile-done 클래스를 달아주고 남은 일이 있으면 tile-has 클래스를 달아줘서 화면 디자인을 자동으로 바꿈
        }}
      />
    </div>
  );
}