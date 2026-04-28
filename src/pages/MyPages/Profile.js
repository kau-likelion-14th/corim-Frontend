import React, { useState, useRef } from 'react';
import profile from "../../assets/img/Profile.png";

function Profile() {
    const [intro, setIntro] = useState(() => sessionStorage.getItem('intro') || '');
    const [song, setSong] = useState(() => sessionStorage.getItem('song') || '');
    const [previewUrl, setPreviewUrl] = useState(() => sessionStorage.getItem('previewUrl') || '');

    const fileInputRef = useRef(null);
    const defaultProfileImg = profile;

    const handleClickEditIcon = () => fileInputRef.current?.click();
    
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setPreviewUrl(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        sessionStorage.setItem('intro', intro);
        sessionStorage.setItem('song', song);
        sessionStorage.setItem('previewUrl', previewUrl);
        
        alert("저장되었습니다!");
    };

    const displayImageSrc = previewUrl || defaultProfileImg;

    return (
        <section className="profile-section">
            <div className="profile-header">
                <div className="profile-img-wrapper">
                    <img src={displayImageSrc} alt="프로필" className="profile-img" />
                    <button className="edit-icon" onClick={handleClickEditIcon}>✎</button>
                    <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                </div>
                <h2 className="profile-nickname">백다혜#2342</h2>
                <button className="profile-save-btn" onClick={handleSave}>프로필 저장</button>
            </div>

            <div className="profile-input-container">
                <div className="profile-input-group">
                    <label>한 줄 소개</label>
                    <input type="text" value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="안녕하세요" />
                </div>

                <div className="profile-input-group">
                    <label>좋아하는 노래</label>
                    <div className="song-input-wrapper">
                        <span className="song-icon-left">🎵</span>
                        <input type="text" value={song} onChange={(e) => setSong(e.target.value)} placeholder="내꺼하자 - 인피니트" className="song-input" />
                        <span className="song-icon-right">🔍</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Profile;