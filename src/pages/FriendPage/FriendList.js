import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/icon/delete.png";
import "../../styles/FriendList.css";

function FriendList( /* 프렌드 리스트에 뜰 화면 객체 */
  { // 부모인 FriendPage가 넘겨준 데이터를 꺼내서 사용, 데이터가 없다면 = 뒤에 기본값을 대신 사용
    title = "팔로우 목록",
    friends = [], // 부모의 followlist state 데이터가 이쪽으로 넘어옴
    onClickRemove, // 부모의 모달창을 띄우는 함수가 넘어옴
    emptyText = "팔로우하는 친구가 없습니다.",
  }
) 
{
  const navigate = useNavigate(); // 페이지 주소를 바꿔서 화면을 이동시켜주는 함수

  const goFriendDetail = (friend) => {
    navigate(`/friends/${friend.id}`, { state: { friend } }); // 클릭한 친구의 고유 id를 이용해 url을 /friends/id로 바꾸고 이동할때 전체 데이터를 state로 넘겨줌
  };

  return ( // 화면에 띄울 요소들
    <section className="friend-list">
      <h2 className="friend-list__title">{title}</h2>
      {/* 부모가 준 friends 배열 길이를 ㅗ학인해서 0명이면 emptytext문구를 띄우고 1명 이상이면 밑에 ul태그 안의 목록 렌더링*/}
      {friends.length === 0 ? (
        <div className="friend-list__empty">{emptyText}</div>
      ) : (
        <ul className="friend-list__items">
          {/*배열 아느이 데이터 개수만큼 돌면서 li태그 요소를 반복해서 화면에 찍어냄 */}
          {friends.map((friend) => (
            <li key={friend.id} className="friend-list__item"> {/* 반복되는 요소들을 구분할 수 있게 각각 고유한 id를 키로 부여 */}
              <div
                className="friend-list__left"
                role="button"
                tabIndex={0}
                onClick={() => {
                  goFriendDetail(friend); // 마우스로 클릭하면 gofrienddetail 함수가 실행되며 상세 페이지 화면으로 넘어감
                }}
                >


                <div className="friend-avatar" aria-hidden="true">
                  {/* 프로필 이미지 데이터가 있으면 img를 화면에 그리고 없으면 기본 아이콘을 렌더링 */}
                  {friend.profileImageUrl ? (
                    <img
                      className="friend-avatar__img"
                      src={friend.profileImageUrl}
                      alt="프로필 사진"
                      />
                  ) : (
                    <UserIcon/>
                  )}
                </div>


                <div className="friend-info">
                  <div className = "friend-info__top">
                    <span className="friend-info__name">{friend.name}</span>
                    <span className="friend-info__tag">#{friend.tag}</span>
                  </div>

                  {/* bio 데이터가 있으면 그 값을 보여주고 없으면 소개글이 없습니다. 문구 렌더링 */}
                  {friend.bio ?(
                    <div className="friend-info__bio">{friend.bio}</div>
                  ) : (
                    <div className="friend-info__empty">소개글이 없습니다.</div>
                  )}
                </div>
              </div>

              <button
                className="friend-remove-btn"
                type="button"
                aria-label="삭제"
                onClick={(e)=>{
                  e.stopPropagation(); {/* 이벤트 겹침 방지용, 없으면 배경의 상세페이지 이동까지 같이 실행됨 */}
                  onClickRemove?.(friend); {/* 부모가 넘겨준 삭제 함수 실행 > 부모의 selectedfriend 상태가 여기 friend 값으로 바뀌고 immodalopen이 True 상태로 바뀜 > 부모화면에 삭제 확인 모달창이 렌더링됨 */}
                }}
                >
                  <img className="friend-remove-icon" src={deleteIcon} alt="삭제 아이콘" />
                </button>
            </li>
          ))}
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

export default FriendList;