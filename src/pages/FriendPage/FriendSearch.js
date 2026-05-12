import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FriendSearch.css";
import searchIcon from "../../assets/icon/search.png";

const dummyUsers = [ // 유저 데이터 객체
    {
        id: "1",
        userId: 1,
        name: "나나",
        tag: "1234",
        bio: "안녕하세요! 저는 나나입니다.",
        profileImageUrl: null,
    },
    {
        id: "2",
        userId: 2,
        name: "얀",
        tag: "2342",
        bio: "^^",
        profileImageUrl: null,
    },
    {
        id: "3",
        userId: 3,
        name: "지말",
        tag: "1214",
        bio: "ㅎㅎ",
        profileImageUrl: null,
    },
    {
        id: "4",
        userId: 4,
        name: "코다",
        tag: "1223",
        bio: ";ㅁ;",
        profileImageUrl: null,
    },
    {
        id: "5",
        userId: 5,
        name: "딜런",
        tag: "1777",
        bio: ".",
        profileImageUrl: null,
    },
];

function FriendSearch({
  title = "팔로우 요청",
  placeholder = "이름/태그로 검색",
  onFollow, // 부모인 friendpage에서 전달받은 함수이고 실행되면 부모의 followlist state 배열에 새로운 친구가 추가됨
  followingList = [], // 부모의 현재 팔로우 목록 state 데이터이고 검색된 유저가 이미 내 친구인지 판별할때 사용 
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(""); // 사용자가 검색창에 타이핑하는 글자를 저장하는 state, 사용자가 타이핑을 할 때마다 값이 바뀌고 화면이 재렌더링됨
 
  const followingIdSet = useMemo(() => {
    return new Set(followingList.map((x) => x.id)); // 부모에게 받은 followinglist 배열에서 id만 뽑아 set 형태로 만듦
  }, [followingList]); // followinglist 값이 바뀔 때만 이 set을 새로 만듦

  const results = useMemo(() => { // usememo를 활용해서 검색 결과 필터링
    const q = query.trim(); // 검색어 앞뒤 공백 제거

    if (!q) return []; // 쿼리가 없으면 빈 배열 반환 > 아래 조건부 렌더링에 의해 화면에 결과 안뜸

    return dummyUsers.filter((user) => { // 쿼리 스테이트가 바뀔 때마다 전체 유저를 순회해서 검색어가 이름이나 태그에 포함된 사람만 걸러내 새 배열을 만듦
      return (
        user.name.includes(q) || // 유저의 이름에 검색어 글자가 포함되어 있거나
        user.tag.includes(q) || // 유저의 태그 번호에 검색어가 포함되어 있거나
        `${user.name}#${user.tag}`.includes(q) // 이름#태그 형태로 합친 문자열에 검색어가 통째로 포함되어 있다면 통과 "|| <- or"
      );
    });
  }, [query]); // 사용자가 타이핑을 쳐서 쿼리 스테이트가 바뀔때만 이 필터링 계산을 다시 실행해 화면에 보여줄 검색 결과 갱신

  const goFriendDetail = (friend) => {
    navigate("/friends/detail", { state: { friend } }); // 검색된 유저를 클릭하면 해당 유저의 고유 id를 이용해 상세 페이지 url로 화면을 이동시킴
  };

  return (
    <section className="friend-search">
      <h2 className="friend-search__title">{title}</h2>

      <div className="friend-search__input-box">
        <span className="friend-search__icon" aria-hidden="true">
          <img
            src={searchIcon}
            alt="검색"
            className="friend-search__icon-img"
          />
        </span>

        <input
          className="friend-search__input"
          value={query} // input 창에 보이는 글자를 쿼리 스테이트와 동기화
          onChange={(e) => setQuery(e.target.value)} // 사용자가 키보드를 칠때마다 이벤트가 발생하면 e.target.value로 쿼리 스테이트 값 변경하고 컴포넌트가 재렌더링되면서 필터링된 결과 화면 출력
          placeholder={placeholder}
        />
      </div>

      {query.trim() === "" ? null : results.length === 0 ? ( // 삼항 연산자이고 쿼리가 비어있으면 null, 검색 결과 배열 길이가 0이면 결과 없습니다 라는 문자열 띄움
        <div className="friend-search__empty">검색 결과가 없습니다.</div>
      ) : (
        <ul className="friend-search__list">
          {results.map((user) => { // 위에서 만들어진 검색 결과 배열을 map으로 돌면서 화면에 유저 목록 li를 하나씩 렌더링
            const isFollowing = followingIdSet.has(user.id); // 렌더링 중인 이 유저가 내 친구 목록 set 안에 존재하는지 확인하고 결과를 True 혹은 False 로 저장

            return (
              <li key={user.id} className="friend-search__item">
                <div
                  className="friend-search__left"
                  role="button"
                  tabIndex={0}
                  onClick={() => goFriendDetail(user)} // 영역 클릭 시 상세 페이지로 url 변경 및 화면 전환
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") goFriendDetail(user); // 키보드 엔터나 스페이스바를 눌러도 클릭과 똑같은 결과 나오게 처리
                  }}
                >
                  <div className="friend-avatar" aria-hidden="true">
                    {user.profileImageUrl ? ( // 프로필 이미지 데이터 유무에 따른 조건부 렌더링
                      <img
                        src={user.profileImageUrl}
                        alt=""
                        className="friend-avatar__img"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>

                  <div className="friend-info">
                    <div className="friend-info__top">
                      <span className="friend-info__name">{user.name}</span>
                      <span className="friend-info__tag">#{user.tag}</span>
                    </div>

                    <div className="friend-info__bio">
                      {user.bio || "한 줄 소개"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`friend-follow-btn ${
                    isFollowing ? "is-disabled" : "" // isfollowing이 true면 is-disabled 문자열을 클래스에 추가해 버튼 색상ㅇ르 회색으로 바꿈
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // 상위 div의 onclick이 같이 실행되지 않게 클릭 이벤트를 여기서 막음
                    onFollow?.(user); // 클릭 시 부모가 넘겨준 함수 실행 > 부모의 folowlist state 배열에 선택한 유저 추가 > 전체 화면 재렌더링 되면서 현재 버튼 클씨가 팔로잉으로 바뀜
                  }}
                  disabled={isFollowing} // True 값이면 html의 disabled 속성을 활성화해 버튼 클릭을 막음
                >
                  {isFollowing ? "팔로잉" : "팔로우"} {/* 이미 친구면 글씨를 팔로잉으로 아니면 팔로우로 렌더링 */}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function UserIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

export default FriendSearch;