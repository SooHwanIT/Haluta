import express, { Request, Response } from 'express';
import cors from 'cors';
import crypto from 'crypto';

// --- 데이터 및 타입 정의 ---

interface RankEntry {
  id: number;
  name: string;
  errors: number;
  wpm: number; // Words Per Minute
}

const MOCK_TEXTS: string[] = [
  // 0
  `죽는 날까지 하늘을 우러러 한 점 부끄럼이 없기를, 잎새에 이는 바람에도 나는 괴로워했다. 별을 노래하는 마음으로 모든 죽어가는 것을 사랑해야지. 그리고 나한테 주어진 길을 걸어가야겠다. 오늘 밤에도 별이 바람에 스치운다.`,
  // 1
  `나 보기가 역겨워 가실 때에는 말없이 고이 보내 드리우리다. 영변에 약산 진달래꽃, 아름 따다 가실 길에 뿌리우리다. 가시는 걸음 걸음 놓인 그 꽃을 사뿐히 즈려밟고 가시옵소서. 나 보기가 역겨워 가실 때에는 죽어도 아니 눈물 흘리우리다.`,
  // 2
  `님은 갔습니다. 아아, 사랑하는 나의 님은 갔습니다. 푸른 산빛을 깨치고 단풍나무 숲을 향하여 난 작은 길을 걸어서 차마 떨치고 갔습니다. 황금의 꽃같이 굳고 빛나던 옛 맹세는 차디찬 티끌이 되어서 한숨의 미풍에 날아갔습니다.`,
  // 3
  `까마득한 날에 하늘이 처음 열리고 어디 닭 우는 소리 들렸으랴. 모든 산맥들이 바다를 연모해 휘달릴 때도 차마 이곳을 범하진 못하였으리라. 끊임없는 광음을 부지런한 계절이 피어선 지고 큰 강물이 비로소 길을 열었다.`,
  // 4
  `넓은 벌 동쪽 끝으로 옛이야기 지줄대는 실개천이 휘돌아 나가고, 얼룩백이 황소가 해설피 금빛 게으른 울음을 우는 곳, 그곳이 차마 꿈엔들 잊힐 리야. 질화로에 재가 식어지면 비인 밭에 밤바람 소리 말을 달리고, 엷은 졸음에 겨운 늙으신 아버지가 짚베개를 돋아 고이시는 곳.`,
  // 5
  `가난한 내가 아름다운 나타샤를 사랑해서 오늘 밤은 푹푹 눈이 나린다. 나타샤를 사랑은 하고 눈은 푹푹 날리고, 나는 혼자 쓸쓸히 앉어 소주를 마신다. 소주를 마시며 생각한다. 나타샤와 나는 눈이 푹푹 쌓이는 밤 흰 당나귀 타고 산골로 가자.`,
  // 6
  `거울속에는소리가없소. 저렇게까지조용한세상은참없을것이오. 거울속에도내게귀가있소. 내말을못알아듣는딱한귀가두개나있소. 거울속의나는왼손잡이오. 내악수를받을줄모르는-악수를모르는왼손잡이오.`,
  // 7
  `강나루 건너서 밀밭 길을 구름에 달 가듯이 가는 나그네. 길은 외줄기 남도 삼백 리, 술 익는 마을마다 타는 저녁놀. 구름에 달 가듯이 가는 나그네.`,
  // 8
  `얇은 사 하이얀 고깔은 고이 접어서 나빌레라. 파르라니 깎은 머리 박사 고깔에 감추오고, 두 볼에 흐르는 빛이 정작으로 고와서 서러워라. 빈 대에 황촉불이 말없이 녹는 밤에 오동잎 잎새마다 달이 지는데.`,
  // 9
  `해야 솟아라. 해야 솟아라. 말갛게 씻은 얼굴 고운 해야 솟아라. 산 넘어 산 넘어서 어둠을 살라 먹고, 산 넘어서 밤새도록 어둠을 살라 먹고, 이글이글 앳된 얼굴 고운 해야 솟아라.`,
  // 10
  `모란이 피기까지는, 나는 아직 나의 봄을 기다리고 있을 테요. 모란이 뚝뚝 떨어져 버린 날, 나는 비로소 봄을 여읜 설움에 잠길 테요. 오월 어느 날, 그 하루 무덥던 날, 떨어져 누운 꽃잎마저 시들어 버리고는 천지에 모란은 자취도 없어지고, 뻗쳐 오르던 내 보람 서운케 무너졌느니.`,
  // 11
  `껍데기는 가라. 사월도 알맹이만 남고 껍데기는 가라. 껍데기는 가라. 동학년 곰나루의, 그 아우성만 살고 껍데기는 가라. 그리하여, 다시 껍데기는 가라. 이곳에선, 두 가슴과 그곳까지 내논 아사달 아사녀가 중립의 초례청 앞에 서서 부끄럼 빛내며 맞절할지니.`,
  // 12
  `나 하늘로 돌아가리라. 새벽빛 와 닿으면 스러지는 이슬 더불어 손에 손을 잡고, 나 하늘로 돌아가리라. 노을빛 함께 단 둘이서 기슭에서 놀다가 구름 손짓하면은, 나 하늘로 돌아가리라. 아름다운 이 세상 소풍 끝내는 날, 가서, 아름다웠더라고 말하리라.`,
  // 13
  `한 송이의 국화꽃을 피우기 위해 봄부터 소쩍새는 그렇게 울었나 보다. 한 송이의 국화꽃을 피우기 위해 천둥은 먹구름 속에서 또 그렇게 울었나 보다. 그립고 아쉬움에 가슴 조이던 머언 먼 젊음의 뒤안길에서 인제는 돌아와 거울 앞에 선 내 누님같이 생긴 꽃이여.`,
  // 14
  `이것은 소리 없는 아우성. 저 푸른 해원을 향하여 흔드는 영원한 노스탤지어의 손수건. 순정은 물결같이 바람에 나부끼고 오로지 맑고 곧은 이념의 푯대 끝에 애수는 백로처럼 날개를 펴다. 아! 누구던가. 이렇게 슬프고도 애달픈 마음을 맨 처음 공중에 달 줄을 안 그는.`,
  // 15
  `자세히 보아야 예쁘다. 오래 보아야 사랑스럽다. 너도 그렇다.`,
];

// 인메모리 DB 역할을 할 배열
let rankingData: RankEntry[] = [
  { id: 1, name: "별헤는밤", wpm: 580, errors: 2 },
  { id: 2, name: "익명의타자", wpm: 550, errors: 1 },
  { id: 3, name: "윤슬", wpm: 550, errors: 5 },
  { id: 4, name: "미리내", wpm: 480, errors: 8 },
  { id: 5, name: "오늘의문장", wpm: 450, errors: 3 },
  { id: 6, name: "구름위산책", wpm: 450, errors: 7 },
];

// --- Express 서버 설정 ---

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// --- 라우팅 및 로직 ---

/**
 * 오늘의 글을 반환하는 API
 * @route GET /api/word-of-the-day
 */
app.get('/api/word-of-the-day', (req: Request, res: Response) => {
  try {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const hash = crypto.createHash('sha256').update(dateString).digest('hex');
    const index = parseInt(hash.charAt(0), 16);
    const todaysText = MOCK_TEXTS[index];
    res.status(200).json({ text: todaysText });
  } catch (error) {
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
});

/**
 * 랭킹 목록을 반환하는 API
 * @route GET /api/ranking
 */
app.get('/api/ranking', (req: Request, res: Response) => {
  try {
    const sortedRanking = [...rankingData].sort((a, b) => {
      if (b.wpm !== a.wpm) {
        return b.wpm - a.wpm;
      }
      return a.errors - b.errors;
    });
    res.status(200).json(sortedRanking);
  } catch (error) {
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
});

/**
 * 새로운 랭킹을 등록하는 API
 * @route POST /api/ranking
 */
app.post('/api/ranking', (req: Request, res: Response) => {
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

    const newId = rankingData.length > 0 ? Math.max(...rankingData.map(r => r.id)) + 1 : 1;
    const newRankEntry: RankEntry = { id: newId, name, wpm, errors };
    rankingData.push(newRankEntry);
    
    res.status(201).json(newRankEntry);
  } catch (error) {
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
});

// Vercel 환경에서는 app.listen()을 사용하지 않고, app 객체를 export합니다.
export default app;
