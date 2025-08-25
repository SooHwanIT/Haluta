export const MOCK_TEXTS: string[] = [
  `죽는 날까지 하늘을 우러러 한 점 부끄럼이 없기를, 잎새에 이는 바람에도 나는 괴로워했다. 별을 노래하는 마음으로 모든 죽어가는 것을 사랑해야지. 그리고 나한테 주어진 길을 걸어가야겠다.

오늘 밤에도 별이 바람에 스치운다.

계절이 지나가는 하늘에는 가을로 가득 차 있습니다. 나는 아무 걱정도 없이 가을 속의 별들을 다 헬 듯합니다. 가슴 속에 하나 둘 새겨지는 별을 이제 다 못 헤는 것은 쉬이 아침이 오는 까닭이요, 내일 밤이 남은 까닭이요, 아직 나의 청춘이 다하지 않은 까닭입니다.

별 하나에 추억과, 별 하나에 사랑과, 별 하나에 쓸쓸함과, 별 하나에 동경과, 별 하나에 시와, 별 하나에 어머니, 어머니.`
];

export interface RankEntry {
  id: number;
  name: string;
  errors: number;
  wpm: number;
}

export interface RankEntry {
  id: number;
  name: string;
  errors: number;
  wpm: number;
}

export const MOCK_RANKING: RankEntry[] = [
  { id: 1, name: "별헤는밤", wpm: 580, errors: 2 },
  { id: 2, name: "익명의타자", wpm: 550, errors: 1 },
  { id: 3, name: "윤슬", wpm: 550, errors: 5 },
  { id: 4, name: "미리내", wpm: 480, errors: 8 },
  { id: 5, name: "오늘의문장", wpm: 450, errors: 3 },
  { id: 6, name: "구름위산책", wpm: 450, errors: 7 },
  { id: 7, name: "빠른손가락", wpm: 380, errors: 12 },
  { id: 8, name: "미리내", wpm: 180, errors: 4 },
  { id: 9, name: "오늘의문장", wpm: 250, errors: 3 },
  { id: 10, name: "구름위산책", wpm: 50, errors: 2 },
  { id: 11, name: "빠른손가락", wpm: 180, errors: 12 },
  { id: 12, name: "워드마스터", wpm: 271, errors: 4 },
  { id: 13, name: "햇살", wpm: 314, errors: 2 },
  { id: 14, name: "새벽감성", wpm: 493, errors: 13 },
  { id: 15, name: "그림자", wpm: 252, errors: 5 },
  { id: 16, name: "작은별", wpm: 446, errors: 11 },
  { id: 17, name: "고요한밤", wpm: 205, errors: 8 },
  { id: 18, name: "푸른솔", wpm: 452, errors: 5 },
  { id: 19, name: "밤편지", wpm: 305, errors: 4 },
  { id: 20, name: "여행자", wpm: 450, errors: 5 },
  { id: 21, name: "안개", wpm: 505, errors: 0 },
  { id: 22, name: "방랑자", wpm: 114, errors: 8 },
  { id: 23, name: "익명", wpm: 224, errors: 7 },
  { id: 24, name: "달무리", wpm: 432, errors: 8 },
  { id: 25, name: "달빛", wpm: 487, errors: 10 },
  { id: 26, name: "은하수", wpm: 165, errors: 10 },
  { id: 27, name: "겨울아이", wpm: 244, errors: 7 },
  { id: 28, name: "해바라기", wpm: 528, errors: 4 },
  { id: 29, name: "은하수", wpm: 240, errors: 9 },
  { id: 30, name: "산들바람", wpm: 377, errors: 2 },
  { id: 31, name: "워드마스터", wpm: 259, errors: 5 },
  { id: 32, name: "해바라기", wpm: 381, errors: 4 },
  { id: 33, name: "노을", wpm: 445, errors: 2 },
  { id: 34, name: "그림자", wpm: 436, errors: 6 },
  { id: 35, name: "가을하늘", wpm: 156, errors: 8 },
  { id: 36, name: "소나기", wpm: 216, errors: 3 },
  { id: 37, name: "여행자", wpm: 144, errors: 8 },
  { id: 38, name: "이슬", wpm: 286, errors: 3 },
  { id: 39, name: "도깨비", wpm: 318, errors: 7 },
  { id: 40, name: "타자신공", wpm: 260, errors: 5 },
  { id: 41, name: "진달래", wpm: 409, errors: 8 },
  { id: 42, name: "단비", wpm: 243, errors: 7 },
  { id: 43, name: "바람", wpm: 357, errors: 3 },
  { id: 44, name: "풀잎", wpm: 433, errors: 5 },
  { id: 45, name: "달무리", wpm: 488, errors: 0 },
  { id: 46, name: "바람", wpm: 195, errors: 3 },
  { id: 47, name: "이슬", wpm: 377, errors: 8 },
  { id: 48, name: "하늘", wpm: 312, errors: 5 },
  { id: 49, name: "고요한밤", wpm: 113, errors: 1 },
  { id: 50, name: "가을하늘", wpm: 397, errors: 5 },
  { id: 51, name: "겨울아이", wpm: 514, errors: 10 },
  { id: 52, name: "소나기", wpm: 361, errors: 3 },
  { id: 53, name: "푸른솔", wpm: 282, errors: 2 },
  { id: 54, name: "나비효과", wpm: 54, errors: 2 },
  { id: 55, name: "익명", wpm: 342, errors: 2 },
  { id: 56, name: "커피향가득", wpm: 76, errors: 6 },
  { id: 57, name: "밤편지", wpm: 384, errors: 2 },
  { id: 58, name: "여우비", wpm: 329, errors: 4 },
  { id: 59, name: "그림자", wpm: 194, errors: 3 },
  { id: 60, name: "단비", wpm: 495, errors: 14 },
  { id: 61, name: "도깨비", wpm: 284, errors: 3 },
  { id: 62, name: "방랑자", wpm: 518, errors: 14 },
  { id: 63, name: "하늘", wpm: 66, errors: 4 },
  { id: 64, name: "타자신공", wpm: 522, errors: 9 },
  { id: 65, name: "가을하늘", wpm: 148, errors: 3 },
  { id: 66, name: "안개", wpm: 448, errors: 12 },
  { id: 67, name: "가을하늘", wpm: 127, errors: 1 },
  { id: 68, name: "노을", wpm: 130, errors: 8 },
  { id: 69, name: "푸른솔", wpm: 408, errors: 7 },
  { id: 70, name: "이슬", wpm: 404, errors: 12 },
  { id: 71, name: "겨울아이", wpm: 591, errors: 1 },
  { id: 72, name: "봄날", wpm: 471, errors: 2 },
  { id: 73, name: "은하수", wpm: 394, errors: 7 },
  { id: 74, name: "도깨비", wpm: 514, errors: 14 },
  { id: 75, name: "산책", wpm: 252, errors: 5 },
  { id: 76, name: "달빛", wpm: 452, errors: 2 },
  { id: 77, name: "그림자", wpm: 405, errors: 6 },
  { id: 78, name: "새벽감성", wpm: 113, errors: 1 },
  { id: 79, name: "진달래", wpm: 150, errors: 9 },
  { id: 80, name: "노을", wpm: 388, errors: 7 },
  { id: 81, name: "익명", wpm: 90, errors: 1 },
  { id: 82, name: "산책", wpm: 262, errors: 7 },
  { id: 83, name: "안개", wpm: 363, errors: 6 },
  { id: 84, name: "눈꽃", wpm: 436, errors: 6 },
  { id: 85, name: "그림자", wpm: 454, errors: 13 },
  { id: 86, name: "밤편지", wpm: 437, errors: 7 },
  { id: 87, name: "속삭임", wpm: 495, errors: 1 },
  { id: 88, name: "햇살", wpm: 406, errors: 6 },
  { id: 89, name: "그림자", wpm: 84, errors: 1 },
  { id: 90, name: "여우비", wpm: 375, errors: 7 },
  { id: 91, name: "산들바람", wpm: 192, errors: 6 },
  { id: 92, name: "구름", wpm: 493, errors: 2 },
  { id: 93, name: "속삭임", wpm: 526, errors: 0 },
  { id: 94, name: "커피향가득", wpm: 323, errors: 3 },
  { id: 95, name: "밤편지", wpm: 328, errors: 7 },
  { id: 96, name: "산들바람", wpm: 384, errors: 6 },
  { id: 97, name: "달무리", wpm: 240, errors: 4 },
  { id: 98, name: "꽃잎", wpm: 403, errors: 7 },
  { id: 99, name: "고요한밤", wpm: 432, errors: 10 },
  { id: 100, name: "푸른솔", wpm: 524, errors: 5 },
];