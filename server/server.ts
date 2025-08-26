
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { MOCK_TEXTS } from './src/texts';
// Vercel Postgres 관련 함수와 sql 객체를 가져옵니다.
import { sql } from '@vercel/postgres';
import { initializeDatabase, clearRankingData } from './src/database';

// --- 타입 정의 ---
interface RankEntry {
  id: number;
  name: string;
  errors: number;
  wpm: number;
  createdat: string; // Postgres는 소문자로 반환합니다.
}

// --- Express 서버 설정 ---
const app = express();
app.use(cors());
app.use(express.json());

// 서버 시작 시 데이터베이스 테이블을 확인하고 생성합니다.
initializeDatabase().catch(console.error);

// --- 데이터 초기화 로직 ---
let lastResetDate: string | null = null;

const dailyResetMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== lastResetDate) {
    try {
      await clearRankingData();
      lastResetDate = today;
    } catch (error) {
      console.error("매일 데이터 초기화 실패:", error);
    }
  }
  next();
};

app.use('/api', dailyResetMiddleware);

// --- 라우팅 및 로직 ---

/**
 * 오늘의 글을 반환하는 API
 */
app.get('/api/word-of-the-day', (req: Request, res: Response) => {
  try {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const hash = crypto.createHash('sha256').update(dateString).digest('hex');
    const textsLength = MOCK_TEXTS.length;
    const hashAsNumber = parseInt(hash.substring(0, 8), 16);
    const index = hashAsNumber % textsLength;
    const todaysText = MOCK_TEXTS[index];
    res.status(200).json({ text: todaysText });
  } catch (error) {
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
});

/**
 * 랭킹 목록을 반환하는 API
 */
app.get('/api/ranking', async (req: Request, res: Response) => {
  try {
    // await를 사용하여 비동기 쿼리 결과를 기다립니다.
    const { rows } = await sql<RankEntry>`
      SELECT * FROM ranking ORDER BY wpm DESC, errors ASC LIMIT 100;
    `;
    res.status(200).json(rows);
  } catch (error) {
    console.error("랭킹 데이터 조회 실패:", error);
    res.status(500).json({ message: "랭킹 데이터를 불러오는 데 실패했습니다." });
  }
});

/**
 * 새로운 랭킹을 등록하는 API
 */
app.post('/api/ranking', async (req: Request, res: Response) => {
  try {
    const { name, wpm, errors } = req.body;

    if (typeof name !== 'string' || typeof wpm !== 'number' || typeof errors !== 'number') {
      return res.status(400).json({ message: "잘못된 데이터 형식입니다." });
    }
    if (name.trim().length === 0 || name.length > 10) {
      return res.status(400).json({ message: "이름은 1자 이상 10자 이하로 입력해주세요." });
    }
    if (wpm < 0 || errors < 0) {
      return res.status(400).json({ message: "wpm과 errors는 0 이상이어야 합니다." });
    }
    
    // Postgres의 NOW() 함수를 사용하여 현재 시간을 기록합니다.
    const createdAt = new Date();

    // RETURNING * 를 사용하여 방금 삽입된 행의 전체 데이터를 반환받습니다.
    const { rows } = await sql<RankEntry>`
      INSERT INTO ranking (name, wpm, errors, createdAt)
      VALUES (${name}, ${wpm}, ${errors}, ${createdAt})
      RETURNING *;
    `;
    
    res.status(201).json(rows[0]);

  } catch (error) {
    console.error("랭킹 등록 실패:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
});

export default app;