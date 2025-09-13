import React, {useState} from "react";
import md5 from "md5";

const AllianceLookup = () => {
    const [fid, setFid] = useState("");
    const [player, setPlayer] = useState(null); // 타입 제거
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [userData, setUserData] = useState(null); // 타입 제거

    const fetchAlliance = async () => {
        setLoading(true);
        setError("");
        setPlayer(null);

        try {
            const secret = "tB87#kPtkxqOS2";
            const time = Date.now();
            let form = `fid=${fid}&time=${time}`;
            form = `sign=${md5(form + secret)}&` + form;

            const res = await fetch("https://wos-giftcode-api.centurygame.com/api/player", {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: form,
            });

            const playerData = await res.json();

            if (!playerData || !playerData.data) {
                setError("플레이어 정보를 가져올 수 없습니다.");
                return;
            }

            // JS에서는 타입 없이 그냥 객체로 저장
            setPlayer({
                name: playerData.data.nickname,
                id: playerData.data.fid,
                level: playerData.data.stove_lv
            });


            console.log(player.name);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (e) => {
        const userData = {
            userName: player.name,
            userID: player.id,
            userLevel: player.level,
            isManager: false
        }

        setUserData(userData);

        if (window.confirm("이 유저를 등록하시겠습니까?")) {

            e.preventDefault(); // 기본 폼 제출 동작 방지

            fetch("http://localhost:5000/api/insert", {
                method: "post", //통신방법
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(userData),
            })
                .then((res) => res.json())
                .then((json) => {
                    if (json.success) {
                        console.log(json);
                        alert("등록 완료");
                        window.location.reload();
                    } else {
                        alert(json.message); // "이미 존재하는 데이터입니다."
                    }
                });
        } else {
            return false;
        }
    }

    return (
        <div style={{padding: 20}}>
            <h2>연맹 정보 조회</h2>
            <input
                type="text"
                value={fid}
                onChange={(e) => setFid(e.target.value)}
                placeholder="플레이어 ID 입력"
                style={{marginRight: 10}}
            />
            <button onClick={fetchAlliance} disabled={loading || !fid}>
                {loading ? "조회 중..." : "조회"}
            </button>

            {error && <p style={{color: "red"}}>{error}</p>}

            {player && (
                <form id="userSearchInfo" method="" action="">
                    <div style={{marginTop: 20}}>
                        <p>플레이어: {player.name}</p>
                        <input type="hidden" value={player.name}/>
                        <p>id: {player.id}</p>
                        <input type="hidden" value={player.id}/>
                        <p>level: {player.level}</p>
                        <input type="hidden" value={player.level}/>
                    </div>

                    <button type="button" onClick={onSubmit}>유저 추가</button>
                </form>
            )}
        </div>
    );
};

export default AllianceLookup;