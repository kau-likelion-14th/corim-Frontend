import React, { useEffect } from "react";
import "../../styles/FriendUnfollowModal.css";

function FriendUnfollowModal({ isOpen, friend, onConfirm, onClose }) { // isopen : 부모인 friendpage의 ismodalopen state, 모달을 띄울지 말지 결정하는 상태 값, friend : 부모의 selectedfriend state, 삭제하려고 선택한 친구의 데이터 객체, onconfirm : 예를 눌렀을때 실행될부모의 함수 ( 삭제 ), onclose : 아니오를 누르거나 배경을 눌렀을때 실행될 부모의 함수
  useEffect(() => { // 화면에 렌더링 될 때 한 번 실행되고 안의 데이터가 바뀔 때마다 샐행되는 훅
    if (!isOpen) return; // 모달이 닫혀있으면 이벤트 등록할 필요가 없으니 함수를 바로 종료

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.(); // 사용자가 누른 키가 esc면 부모가 넘겨준 onclose 함수를 실행해 모달을 닫음
    };

    document.addEventListener("keydown", handleKeyDown); // 브라우저 전체에 키보드를 누르는 이벤트를 감지
    return () => document.removeEventListener("keydown", handleKeyDown); // 모달이 닫혀서 화면에서 사라질때 등록했던 이벤트를 지워서 에러를 막음
  }, [isOpen, onClose]); // isopen이나 onclose 값이 바뀔 때만 이 로직을 갱신해서 다시 실행

  if (!isOpen) return null; // 부모의 isopen state가 False하면 이 컴포넌트는 null 반환하고 렌더링을 멈춤

  const displayName = friend?.name ?? ""; // 객체가 존재하면 name을 가져오고 없으면 undefined 반환, 앞의 값이 없으면 기본값으로 뒤의 빈 문자열을 사용
  const displayTag = friend?.tag ? `#${friend.tag}` : "";

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.(); // 하얀색 모달 내부 박스를 클릭했을때 닫히지 않고 바깥쪽 어두운 배경을 클릭했을 때만 부모의 onclose 함수를 실행시켜 창을 닫음
  };

  return (
    <div className="friend-unfollow-modal__overlay" onClick={handleOverlayClick}> {/* 배경 클릭시 위에 만든 handleoverlayclick 함수 실행 */}
      <div
        className="friend-unfollow-modal__content"
        role="dialog"
        aria-modal="true"
      >
        <p className="friend-unfollow-modal__text">
          <span className="friend-unfollow-modal__name">{displayName}</span>{" "}
          <span className="friend-unfollow-modal__tag">{displayTag}</span>
          님을 팔로우 목록에서
          <br />
          삭제하시겠습니까? {/* 위에서 가공한 친구 이름과 태그 데이터를 화면에 동적으로 렌더링 */}
        </p>

        <div className="friend-unfollow-modal__actions">
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--yes"
            onClick={onConfirm} // 예 버튼 클릭시 부모가 준 handleconfirmremove 실행 > 부모의 followlist state 배열에서 이 친구가 삭제 됨 > 부모의 ismodalopen state가 False가 됨 > 화면 전체가 재렌더링 되면서 모달이 사라지고 친구 목록도 갱신됨
          >
            예
          </button>

          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--no"
            onClick={onClose} // 버튼 클릭 > 부모가 준 handleclocemodal 실행 > 부모의 ismodalopen state가 false가 됨 > 데이터 삭제는 일어나지 않고 화면에서 모달만 사라짐
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendUnfollowModal;