
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { MOCK_TEXTS } from './src/texts'; // 1. 외부 파일에서 글 데이터 가져오기
import { db, clearRankingData } from './src/database'; // 2. 데이터베이스 관련 모듈 가져오기

// --- 타입 정의 ---

interface RankEntry {
  id: number;
  name: string;
  errors: number;
  wpm: number;
  createdAt: string; // 3. 날짜 필드 추가
}

// --- Express 서버 설정 ---

const app = express();

app.use(cors());
app.use(express.json());

// --- 데이터 초기화 로직 ---

let lastResetDate: string | null = null;

// 4. 매일 첫 요청 시 데이터를 초기화하는 미들웨어
const dailyResetMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD' 형식

  if (today !== lastResetDate) {
    try {
      await clearRankingData();
      lastResetDate = today;
    } catch (error) {
      // 초기화 실패 시에도 서버는 계속 동작해야 하므로 에러만 로깅
      console.error("매일 데이터 초기화 실패:", error);
    }
  }
  next(); // 다음 미들웨어 또는 라우트 핸들러로 제어를 넘김
};

// 모든 API 요청 전에 초기화 미들웨어를 실행
app.use('/api', dailyResetMiddleware);


// --- 라우팅 및 로직 ---

/**
 * 오늘의 글을 반환하는 API (수정된 로직)
 */
app.get('/api/word-of-the-day', (req: Request, res: Response) => {
  try {
    // 1. 오늘의 날짜로 고유한 문자열을 생성합니다.
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    // 2. 날짜 문자열을 기반으로 SHA-256 해시를 생성하여 매일 고정된 값을 얻습니다.
    const hash = crypto.createHash('sha256').update(dateString).digest('hex');

    // 3. MOCK_TEXTS 배열의 전체 길이를 가져옵니다.
    const textsLength = MOCK_TEXTS.length;

    // 4. 생성된 해시의 앞 8자리를 16진수 숫자로 변환합니다.
    //    (해시 전체는 너무 커서 JavaScript 숫자 범위를 초과할 수 있으므로,
    //     분포도를 확보하기에 충분한 앞부분만 사용합니다.)
    const hashAsNumber = parseInt(hash.substring(0, 8), 16);

    // 5. 변환된 숫자를 배열의 전체 길이로 나눈 나머지 값을 최종 인덱스로 사용합니다.
    //    이렇게 하면 인덱스는 항상 '0'부터 '배열 길이 - 1' 사이의 유효한 값이 됩니다.
    const index = hashAsNumber % textsLength;

    const todaysText = MOCK_TEXTS[index];
    
    res.status(200).json({ text: todaysText });
  } catch (error) {
    // 에러 발생 시 서버 콘솔에 로그를 남겨 디버깅을 돕습니다.
    console.error("오늘의 글을 가져오는 중 오류 발생:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
});

/**
 * 랭킹 목록을 반환하는 API
 */
app.get('/api/ranking', (req: Request, res: Response) => {
  const sql = 'SELECT * FROM ranking ORDER BY wpm DESC, errors ASC';

  db.all(sql, [], (err, rows: RankEntry[]) => {
    if (err) {
      res.status(500).json({ message: "랭킹 데이터를 불러오는 데 실패했습니다." });
      return;
    }
    res.status(200).json(rows);
  });
});

/**
 * 새로운 랭킹을 등록하는 API
 */
app.post('/api/ranking', (req: Request, res: Response) => {
  try {
    const { name, wpm, errors } = req.body;

    // 유효성 검사
    if (typeof name !== 'string' || typeof wpm !== 'number' || typeof errors !== 'number') {
      return res.status(400).json({ message: "잘못된 데이터 형식입니다." });
    }
    if (name.trim().length === 0 || name.length > 10) {
      return res.status(400).json({ message: "이름은 1자 이상 10자 이하로 입력해주세요." });
    }
    if (wpm < 0 || errors < 0) {
      return res.status(400).json({ message: "wpm과 errors는 0 이상이어야 합니다." });
    }
    
    // 3. 현재 시간 데이터 추가
    const createdAt = new Date().toISOString();

    const sql = 'INSERT INTO ranking (name, wpm, errors, createdAt) VALUES (?, ?, ?, ?)';
    
    // `function` 키워드를 사용해야 `this.lastID`에 접근 가능
    db.run(sql, [name, wpm, errors, createdAt], function (err) {
      if (err) {
        res.status(500).json({ message: "랭킹 등록에 실패했습니다." });
        return;
      }
      // 방금 삽입된 데이터 반환
      const newEntry: RankEntry = {
        id: this.lastID,
        name,
        wpm,
        errors,
        createdAt
      };
      res.status(201).json(newEntry);
    });

  } catch (error) {
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
});

// Vercel 환경에서는 app.listen()을 사용하지 않고, app 객체를 export합니다.
// 로컬 테스트를 위해서는 아래 listen 코드를 활성화하세요.
/*
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버가 실행 중입니다.`);
});
*/

export default app;