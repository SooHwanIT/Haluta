// src/database.ts

import { sql } from '@vercel/postgres';

/**
 * 서버 시작 시 'ranking' 테이블이 없으면 생성합니다.
 * Vercel Postgres는 자동으로 연결을 관리하므로 별도의 연결 코드가 필요 없습니다.
 */
export const initializeDatabase = async () => {
  try {
    // sql 템플릿 리터럴을 사용하여 안전하게 쿼리를 실행합니다.
    await sql`
      CREATE TABLE IF NOT EXISTS ranking (
        id SERIAL PRIMARY KEY,
        name VARCHAR(10) NOT NULL,
        wpm INTEGER NOT NULL,
        errors INTEGER NOT NULL,
        createdAt TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `;
    console.log("'ranking' 테이블이 성공적으로 준비되었습니다.");
  } catch (error) {
    console.error('테이블 생성 실패:', error);
    // 실제 프로덕션에서는 에러를 더 정교하게 처리해야 합니다.
    throw error;
  }
};

/**
 * 매일 랭킹 데이터를 초기화하는 함수
 */
export const clearRankingData = async (): Promise<void> => {
  try {
    // TRUNCATE TABLE을 사용하면 테이블 구조는 남기고 모든 데이터를 빠르게 삭제합니다.
    // SERIAL 카운터도 초기화됩니다.
    await sql`TRUNCATE TABLE ranking RESTART IDENTITY;`;
    console.log('오늘의 랭킹 데이터가 초기화되었습니다.');
  } catch (error) {
    console.error('랭킹 데이터 삭제 실패:', error);
    throw error;
  }
};
