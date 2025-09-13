const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000; // 백엔드 포트

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL 데이터베이스 연결 설정
const db = mysql.createPool({
    host: "localhost",
    user: "root", // MySQL 사용자명
    password: "0519", // MySQL 비밀번호
    database: "lov_user", // 데이터베이스 이름
});

// POST 요청 처리 라우트
app.post("/api/insert", (req, res) => {
    const { userName, userID, userLevel, isManager } = req.body; // 리액트에서 보낸 데이터 받기

    const sqlQuery = "INSERT INTO lov_user (userName, userID, userLevel, isManager) VALUES (?, ?, ?, ?)";
    db.query(sqlQuery, [userName, userID, userLevel, isManager], (err, result) => {
        if (err) {
            console.log(err);
            if (err.code === "ER_DUP_ENTRY") {
                return res.json({ success: false, message: "이미 존재하는 데이터입니다." });
            }
            return res.status(500).json({ error: "데이터 삽입 중 오류 발생", details: err });
        } else {
            res.json({ success: true, insertedId: result.insertId });
            res.status(200).send("데이터가 성공적으로 추가되었습니다.");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});