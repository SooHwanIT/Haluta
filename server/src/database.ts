// src/database.ts

import sqlite3 from 'sqlite3';

const verboseSqlite = sqlite3.verbose();

// 'ranking.db' 파일에 데이터베이스를 저장합니다.
export const db = new verboseSqlite.Database('ranking.db', (err) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err.message);
  } else {
    console.log('데이터베이스 연결 성공.');
    initializeDatabase();
  }
});

/**
 * 서버 시작 시 'ranking' 테이블이 없으면 생성합니다.
 */
const initializeDatabase = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS ranking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      wpm INTEGER NOT NULL,
      errors INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('테이블 생성 실패:', err.message);
    } else {
      console.log("'ranking' 테이블이 성공적으로 준비되었습니다.");
    }
  });
};

// 매일 랭킹을 초기화하는 함수
export const clearRankingData = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM ranking', (err) => {
      if (err) {
        console.error('랭킹 데이터 삭제 실패:', err);
        reject(err);
      } else {
        console.log('오늘의 랭킹 데이터가 초기화되었습니다.');
        // SQLite의 autoincrement 카운터도 초기화
        db.run("DELETE FROM sqlite_sequence WHERE name='ranking'", () => resolve());
      }
    });
  });
};