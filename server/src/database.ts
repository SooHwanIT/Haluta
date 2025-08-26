// src/database.ts

import { sql } from '@vercel/postgres';

// KST는 UTC+9 이므로, UTC 시간에 9시간을 더해줍니다.
const KST_OFFSET = 9 * 60 * 60 * 1000;

/**
 * 현재 시간을 KST 기준으로 'YYYY-MM-DD' 형식의 문자열로 반환합니다.
 */
const getTodayKST = (): string => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const kstNow = new Date(utc + KST_OFFSET);
  return kstNow.toISOString().slice(0, 10);
};

/**
 * 서버 시작 시 필요한 테이블들을 생성합니다.
 */
export const initializeDatabase = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS ranking (
        id SERIAL PRIMARY KEY,
        name VARCHAR(10) NOT NULL,
        wpm INTEGER NOT NULL,
        errors INTEGER NOT NULL,
        createdAt TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `;
    // 마지막 초기화 날짜를 저장할 테이블을 생성합니다.
    await sql`
      CREATE TABLE IF NOT EXISTS metadata (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `;
    console.log("데이터베이스 테이블이 성공적으로 준비되었습니다.");
  } catch (error) {
    console.error('테이블 생성 실패:', error);
    throw error;
  }
};

/**
 * KST 기준으로 오늘 이전의 모든 랭킹 데이터를 삭제합니다.
 */
const clearOldRankingData = async () => {
  try {
    const todayKST = getTodayKST();
    // createdAt 날짜가 오늘(KST)보다 이전인 데이터를 모두 삭제합니다.
    await sql`DELETE FROM ranking WHERE DATE(createdAt AT TIME ZONE 'Asia/Seoul') < ${todayKST};`;
    console.log(`${todayKST} 이전의 랭킹 데이터가 삭제되었습니다.`);
  } catch (error) {
    console.error('오래된 랭킹 데이터 삭제 실패:', error);
    throw error;
  }
};

/**
 * DB를 확인하여 날짜가 바뀌었으면 랭킹 데이터를 초기화하는 메인 함수
 */
export const checkAndClearRankingsIfNeeded = async () => {
  const todayKST = getTodayKST();

  // 1. DB에서 마지막으로 초기화한 날짜를 가져옵니다.
  const { rows } = await sql`SELECT value FROM metadata WHERE key = 'lastClearedDate'`;
  const lastClearedDate = rows[0]?.value;

  // 2. 마지막 초기화 날짜가 오늘이 아니면, 데이터 삭제를 진행합니다.
  if (lastClearedDate !== todayKST) {
    console.log(`날짜 변경 감지 (DB: ${lastClearedDate}, 현재: ${todayKST}). 랭킹 데이터를 초기화합니다.`);
    
    await clearOldRankingData();

    // 3. 마지막 초기화 날짜를 오늘 날짜로 DB에 기록(업데이트)합니다.
    await sql`
      INSERT INTO metadata (key, value)
      VALUES ('lastClearedDate', ${todayKST})
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value;
    `;
  }
};
