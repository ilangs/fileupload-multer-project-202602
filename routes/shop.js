const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads');
    },
    filename: function(req, file, callback) {
        // 한글 파일 깨짐 방지
        const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        // 파일명 중복을 방지하기 위한 처리
        // Date.now() <-- 타임스템프
        let index = fileName .lastIndexOf(".");
        let newFileName = fileName .substring(0, index);
        newFileName += Date.now();
        newFileName += fileName .substring(index);
        callback(null, newFileName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        files: 10, // 최대 10개까지
        fileSize: 1024*1024*1024 // 1G
    }
});

router.route('/list').get((req, res)=>{
    res.send('GET - /shop/list 호출');
});

// 코드 최적화
router.route('/input').post(upload.array('photo', 1), (req, res) => {
    console.log('/process/photo 호출됨.');
    console.log(req.body);

    try {
        const files = req.files;

        if (!files || files.length === 0) {
            res.status(400).send('파일이 업로드되지 않았습니다.');
            return;
        }

        const file = files[0]; // 첫 번째 파일만 처리 (업로드된 파일은 최대 1개)

        // 파일 정보
        const originalname = file.originalname;
        const filename = file.filename;
        const mimetype = file.mimetype;
        const size = file.size;

        console.log(`업로드된 파일: 원본 파일명 - ${Buffer.from(originalname, 'latin1').toString('utf8')}, 저장 파일명 - ${filename}, MIME TYPE - ${mimetype}, 파일 크기 - ${size}`);

        // 클라이언트에 응답 전송
        res.status(200).contentType('text/html;charset=utf8').send(`
            <h3>파일 업로드 성공</h3>
            <hr/>
            <p>원본 파일명: ${Buffer.from(originalname, 'latin1').toString('utf8')} -> 저장 파일명: ${filename}</p>
            <p>MIME TYPE: ${mimetype}</p>
            <p>파일 크기: ${size}</p>
            <p>작성자: ${req.body.writer}</p>
            <p>설명: ${req.body.comment}</p>
        `);
    } catch (err) {
        console.error('파일 처리 중 오류 발생:', err);
        res.status(500).send('서버 오류로 파일 업로드에 실패했습니다.');
    }
});

module.exports = router;