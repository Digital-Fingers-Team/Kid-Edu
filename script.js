// =========================
// File: script.js
// وصف: وظائف JavaScript العامة للموقع
// =========================

document.addEventListener("DOMContentLoaded", () => {
  highlightActiveNav();
  initializeStageSelection();
  renderDashboard();
  renderBooks();
  renderStories();
  setupAssistantChat();
  renderParentReport();
  initializeGamesPage();
  addBottomNavigation();
});

/* بيانات عامة */
const defaultStage = "KG1";

// Test scenarios for progress calculation
// Scenario 1: completedGoals = 5, totalGoals = 10 → expect 50%
// Scenario 2: completedGoals = 0, totalGoals = 10 → expect 0%
// Scenario 3: completedGoals = 10, totalGoals = 10 → expect 100%
// Scenario 4: totalGoals = 0 → expect 0%

// Default scenario: 50% completion (5/10)
const childProfile = {
  name: " ......",
  avatar: "🦁",
  badges: ["محب القراءة", "مستكشف الألوان", "بطل الأرقام"],
  stars: 18,
  weeklyStats: { games: 5, books: 3, stories: 4 },
  completion: {
    games: { completed: 2, total: 4 },
    books: { completed: 1, total: 3 },
    stories: { completed: 2, total: 3 }
  },
  aiHighlights: [
    "ساعدتُ سارة في نطق كلمة (شمس) بوضوح.",
    "اقترحت نشاطًا منزليًا عن العد باستخدام الفواكه."
  ],
  latestActivities: [
    { id: "act1", title: "لعبة الحروف الطائرة", type: "game", score: 92, date: "2025-03-10" },
    { id: "act2", title: "قصة رحلتي مع الألوان", type: "story", date: "2025-03-09" },
    { id: "act3", title: "كتاب حروفي الأولى", type: "book", date: "2025-03-08" }
  ]
};

const booksData = [
  {
    id: "arabic_letters",
    title: "حروف العربية مع بسمة",
    category: "اللغة العربية",
    stage: "KG1",
    pages: 16,
    description: "تعرف على أشكال الحروف مع أنشطة ممتعة وتمارين نطق."
  },
  {
    id: "numbers_fun",
    title: "أصدقائي الأرقام",
    category: "الرياضيات",
    stage: "KG2",
    pages: 18,
    description: "قصص قصيرة تمزج العد بالألعاب المصورة."
  },
  {
    id: "science_nature",
    title: "أستكشف الطبيعة",
    category: "العلوم",
    stage: "KG2",
    pages: 14,
    description: "رحلة في عالم الحيوانات والنباتات بطريقة مبسطة."
  },
  {
    id: "life_skills",
    title: "مهاراتي اليومية",
    category: "مهارات حياتية",
    stage: "KG1",
    pages: 12,
    description: "أنشطة حول المشاركة، التعاون، والتنظيم في البيت."
  }
];

const storiesData = [
  {
    id: "story_001",
    title: "رحلة في عالم الألوان",
    duration: "4:12",
    description: "قصة ممتعة تعلم الطفل أسماء الألوان بالعربية.",
    emoji: "🎨"
  },
  {
    id: "story_002",
    title: "صديقي القمر",
    duration: "5:03",
    description: "قصة قبل النوم عن فضول الأطفال حول السماء.",
    emoji: "🌙"
  },
  {
    id: "story_003",
    title: "رحلة بذرة صغيرة",
    duration: "3:48",
    description: "تعرف على دورة حياة النبات بأسلوب قصصي محبب.",
    emoji: "🌱"
  }
];

const activitiesForParents = [
  {
    title: "صندوق الأحرف المخفية",
    description:
      "ضع بطاقات حروف داخل صندوق صغير ودع طفلك يسحب بطاقة وينطق الحرف بصوت عالٍ مرتين أسبوعيًا.",
    icon: "🧺",
    age: "4-5 سنوات",
    duration: "10 دقائق"
  },
  {
    title: "المتجر المنزلي",
    description:
      "حوّل غرفة المعيشة إلى متجر صغير مع بطاقات أسعار ودع الطفل يعد النقود الورقية لشراء السلع.",
    icon: "🛍️",
    age: "5-6 سنوات",
    duration: "15 دقيقة"
  },
  {
    title: "مسرحية الأشكال",
    description:
      "اصنع أزياء بسيطة للأشكال الهندسية باستخدام الورق المقوى، ودع طفلك يمثل قصة لكل شكل.",
    icon: "🎭",
    age: "4-6 سنوات",
    duration: "12 دقيقة"
  }
];

/* تعريف الألعاب المتقدمة */
const gameDefinitions = [
  {
    id: "letter-safari",
    icon: "🦜",
    title: "سفاري الحروف",
    subject: "اللغة العربية",
    minutes: "6 دقائق",
    challenge: "تمييز الأصوات القصيرة",
    description: "التقط الحروف الصحيحة في غابة مرحة، وتدرّب على النطق مع مستويات تتسارع تدريجيًا.",
    skills: ["تمييز بصري", "نطق صحيح", "سرعة استجابة"],
    init: initLetterSafari
  },
  {
    id: "math-galaxy",
    icon: "🪐",
    title: "مجرة الأرقام",
    subject: "الرياضيات",
    minutes: "8 دقائق",
    challenge: "حل تكوينات الجمع والطرح",
    description: "انطلق في رحلة فضائية وابحث عن المعادلات التي تساوي الهدف قبل انتهاء الوقت.",
    skills: ["حساب عقلي", "اتخاذ القرار", "إدارة الوقت"],
    init: initMathGalaxy
  },
  {
    id: "word-garden",
    icon: "🌷",
    title: "حديقة الكلمات",
    subject: "اللغة الإنجليزية",
    minutes: "7 دقائق",
    challenge: "مطابقة المفردات مع الرموز",
    description: "ازرع مفردات جديدة بلغة إنجليزية بسيطة عبر مطابقة الكلمات مع صورها التفاعلية.",
    skills: ["مفردات أساسية", "تفكير ترابطي", "ذاكرة بصرية"],
    init: initWordGarden
  },
  {
    id: "color-game-kg1",
    icon: "🎨",
    title: "لعبة الألوان",
    subject: "المهارات البصرية",
    minutes: "5 دقائق",
    challenge: "التعرف على الألوان",
    description: "تعرف على الألوان من خلال الصور والرموز المختلفة في بيئة تفاعلية ممتعة.",
    skills: ["تمييز الألوان", "ربط الصور بالألوان", "تركيز بصري"],
    stage: "KG1",
    init: initColorGame
  },
  {
    id: "color-drag-game-kg2",
    icon: "🎯",
    title: "سحب الألوان",
    subject: "المهارات البصرية",
    minutes: "5 دقائق",
    challenge: "مطابقة الصور بالألوان",
    description: "اسحب الصور إلى الألوان المناسبة لها في لعبة تفاعلية ممتعة.",
    skills: ["تمييز الألوان", "المهارات الحركية الدقيقة", "التركيز البصري"],
    stage: "KG2",
    init: initColorDragGame
  },
  {
    id: "arabic-words-game",
    icon: "📝",
    title: "لعبة الكلمات العربية",
    subject: "اللغة العربية",
    minutes: "7 دقائق",
    challenge: "تكوين الكلمات من الحروف",
    description: "انقر على الحروف لتكوين الكلمة المطابقة للصورة في لعبة تفاعلية ممتعة.",
    skills: ["مهارات القراءة", "تكوين الكلمات", "التركيز البصري"],
    stage: "KG2",
    init: initArabicWordsGame
  }
];

/* تهيئة لعبة الكلمات العربية */
function initArabicWordsGame() {
  const gameContainer = document.createElement('div');
  gameContainer.className = 'game-iframe-container';
  gameContainer.style.width = '100%';
  gameContainer.style.height = '100%';
  gameContainer.style.overflow = 'hidden';
  gameContainer.style.borderRadius = '12px';
  
  const gameFrame = document.createElement('iframe');
  gameFrame.src = 'kg 2.html';
  gameFrame.style.width = '100%';
  gameFrame.style.height = '100%';
  gameFrame.style.border = 'none';
  
  gameContainer.appendChild(gameFrame);
  document.getElementById('game-area').innerHTML = '';
  document.getElementById('game-area').appendChild(gameContainer);
}

/* تخزين تقدّم الألعاب */
const STORAGE_KEY = "smartKidsGameRecords_v2";
let gameRecords = loadGameRecords();

/* دوال مساعدة */
function loadGameRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (error) {
    console.warn("تعذر قراءة بيانات التقدم:", error);
    return {};
  }
}

function saveGameRecords() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameRecords));
  } catch (error) {
    console.warn("تعذر حفظ بيانات التقدم:", error);
  }
}

function updateGameRecord(gameId, progress) {
  if (!gameId) return;
  const previous = gameRecords[gameId] ?? {};
  const updated = { ...previous };
  const timestamp = progress.timestamp || new Date().toISOString();

  if (typeof progress.score === "number") {
    const bestScore = previous.bestScore ?? 0;
    if (progress.score > bestScore) {
      updated.bestScore = progress.score;
      updated.bestLevel = progress.level ?? previous.bestLevel ?? 1;
      updated.bestAccuracy = Math.max(previous.bestAccuracy ?? 0, Math.round(progress.accuracy ?? 0));
      updated.lastPlayed = timestamp;
    }
  }

  if (!updated.lastPlayed) {
    updated.lastPlayed = timestamp;
  }

  gameRecords[gameId] = updated;
  saveGameRecords();
  return updated;
}

function formatAccuracy(value) {
  if (value === undefined || Number.isNaN(value)) return "—";
  return `${Math.round(value)}٪`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("ar-EG", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* تهيئة لعبة الكلمات العربية */
function initArabicWordsGame() {
  // قائمة الكلمات والصور المقابلة لها
  const words = [
    { word: "باب", image: "🚪" },
    { word: "شمس", image: "🌞" },
    { word: "قمر", image: "🌙" },
    { word: "بيت", image: "🏠" },
    { word: "ولد", image: "👦" },
    { word: "بنت", image: "👧" },
    { word: "قلم", image: "✏️" },
    { word: "كتاب", image: "📖" },
    { word: "كرسي", image: "🪑" },
    { word: "مفتاح", image: "🔑" },
    { word: "نجم", image: "⭐" },
    { word: "تفاح", image: "🍎" },
    { word: "بابا", image: "👨" },
    { word: "ماما", image: "👩" },
    { word: "لعب", image: "🧸" }
  ];

  // متغيرات اللعبة
  let currentWordIndex = 0;
  let score = 0;
  let selectedLetters = [];
  let currentWordLetters = [];
  let inputSlots = [];

  // إنشاء هيكل اللعبة
  const gameContainer = document.createElement('div');
  gameContainer.className = 'game-container';
  gameContainer.innerHTML = `
    <div class="header">
      <h1>لعبة الكلمات العربية</h1>
      <p>انقر على الحروف لتكوين الكلمة</p>
    </div>
    
    <div class="word-card">
      <div class="word-image" id="word-image">🌞</div>
      <div class="word" id="current-word">شمس</div>
    </div>
    
    <div class="input-area">
      <div class="word-input" id="word-input">
        <!-- سيتم ملء هذا القسم ديناميكيًا -->
      </div>
      
      <div class="letter-tiles" id="letter-tiles">
        <!-- سيتم ملء هذا القسم ديناميكيًا -->
      </div>
    </div>
    
    <div class="feedback" id="feedback"></div>
    
    <div class="progress">
      <span class="score">النقاط: <span id="score">0</span></span>
      <div class="progress-bar">
        <div class="progress-fill" id="progress-fill"></div>
      </div>
      <span class="score"><span id="current-index">1</span>/<span id="total-words">15</span></span>
    </div>
  `;

  // إضافة الأنماط
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .game-container {
      width: 100%;
      max-width: 500px;
      background-color: #fff;
      border-radius: 24px;
      box-shadow: 0 10px 30px rgba(255, 107, 53, 0.15);
      padding: 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
    }

    .header h1 {
      color: #FF6B35;
      font-size: 32px;
      margin-bottom: 10px;
      font-weight: 800;
      text-shadow: 2px 2px 0px rgba(255, 107, 53, 0.1);
    }

    .header p {
      color: #666;
      font-size: 18px;
    }

    .word-card {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%);
      border-radius: 20px;
      padding: 30px 20px;
      margin-bottom: 30px;
      color: white;
      box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
      position: relative;
      overflow: hidden;
    }

    .word-card::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
      transform: rotate(30deg);
    }

    .word-image {
      font-size: 80px;
      margin-bottom: 15px;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    }

    .word {
      font-size: 52px;
      font-weight: bold;
      text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
    }

    .input-area {
      margin-bottom: 25px;
    }

    .word-input {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .input-slot {
      width: 60px;
      height: 60px;
      background-color: #FFF9F2;
      border: 2px dashed #FF6B35;
      border-radius: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28px;
      font-weight: bold;
      color: #333;
      transition: all 0.3s;
    }

    .input-slot.filled {
      border: 2px solid #FF6B35;
      background-color: #FFE8D9;
      transform: scale(1.05);
    }

    .input-slot.empty:hover {
      background-color: #FFE8D9;
      cursor: pointer;
    }

    .letter-tiles {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
    }

    .letter-tile {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%);
      border-radius: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28px;
      font-weight: bold;
      color: white;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 6px 0 #E55A2B;
      user-select: none;
    }

    .letter-tile:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 0 #E55A2B;
    }

    .letter-tile:active {
      transform: translateY(4px);
      box-shadow: 0 2px 0 #E55A2B;
    }

    .letter-tile.used {
      opacity: 0.3;
      transform: scale(0.9);
      pointer-events: none;
    }

    .feedback {
      margin-top: 20px;
      padding: 20px;
      border-radius: 15px;
      font-size: 22px;
      font-weight: bold;
      display: none;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .correct {
      background-color: #E8F5E9;
      color: #2E7D32;
      border: 2px solid #4CAF50;
    }

    .incorrect {
      background-color: #FFEBEE;
      color: #C62828;
      border: 2px solid #F44336;
    }

    .progress {
      margin-top: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .progress-bar {
      flex: 1;
      height: 12px;
      background-color: #E0E0E0;
      border-radius: 6px;
      margin: 0 15px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #FF6B35, #FF8E53);
      width: 0%;
      transition: width 0.5s;
      border-radius: 6px;
    }

    .score {
      font-size: 18px;
      color: #666;
      font-weight: bold;
    }

    /* تأثيرات للتفاعل */
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
      40% {transform: translateY(-15px);}
      60% {transform: translateY(-7px);}
    }

    .bounce {
      animation: bounce 1s;
    }

    @keyframes confetti {
      0% { transform: translateY(0) rotate(0); opacity: 1; }
      100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }

    .confetti {
      position: absolute;
      width: 10px;
      height: 10px;
      background-color: #FF6B35;
      opacity: 0;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    .pulse {
      animation: pulse 0.5s;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;

  document.head.appendChild(styleElement);
  document.body.innerHTML = '';
  document.body.appendChild(gameContainer);

  // عناصر DOM
  const currentWordElement = document.getElementById('current-word');
  const wordImageElement = document.getElementById('word-image');
  const wordInputElement = document.getElementById('word-input');
  const letterTilesElement = document.getElementById('letter-tiles');
  const feedbackElement = document.getElementById('feedback');
  const scoreElement = document.getElementById('score');
  const currentIndexElement = document.getElementById('current-index');
  const totalWordsElement = document.getElementById('total-words');
  const progressFillElement = document.getElementById('progress-fill');

  // تهيئة اللعبة
  function initGame() {
    totalWordsElement.textContent = words.length;
    setupWord();
    updateProgress();
  }

  // إعداد الكلمة الحالية
  function setupWord() {
    const currentWord = words[currentWordIndex].word;
    currentWordElement.textContent = currentWord;
    wordImageElement.textContent = words[currentWordIndex].image;
    
    // إعداد الحروف للكلمة الحالية
    currentWordLetters = currentWord.split('');
    selectedLetters = Array(currentWordLetters.length).fill(null);
    inputSlots = [];
    
    // إنشاء مساحات الإدخال
    wordInputElement.innerHTML = '';
    for (let i = 0; i < currentWordLetters.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'input-slot empty';
      slot.dataset.index = i;
      
      // إضافة إمكانية النقر لمسح الحرف
      slot.addEventListener('click', () => removeLetter(i));
      
      wordInputElement.appendChild(slot);
      inputSlots.push(slot);
    }
    
    // إنشاء بلاطات الحروف (مختلطة بشكل عشوائي)
    const shuffledLetters = shuffleArray([...currentWordLetters]);
    letterTilesElement.innerHTML = '';
    shuffledLetters.forEach((letter, index) => {
      const tile = document.createElement('div');
      tile.className = 'letter-tile';
      tile.textContent = letter;
      tile.dataset.letter = letter;
      tile.addEventListener('click', () => selectLetter(letter, tile));
      letterTilesElement.appendChild(tile);
    });
    
    feedbackElement.style.display = 'none';
    currentIndexElement.textContent = currentWordIndex + 1;
  }

  // اختيار حرف
  function selectLetter(letter, tile) {
    // البحث عن أول مساحة فارغة
    const emptyIndex = selectedLetters.findIndex(slot => slot === null);
    
    if (emptyIndex !== -1) {
      // وضع الحرف في المساحة الفارغة
      selectedLetters[emptyIndex] = letter;
      inputSlots[emptyIndex].textContent = letter;
      inputSlots[emptyIndex].classList.remove('empty');
      inputSlots[emptyIndex].classList.add('filled');
      
      // تعطيل البلاطة المختارة
      tile.classList.add('used');
      
      // تأثير النبض للمساحة المملوءة
      inputSlots[emptyIndex].classList.add('pulse');
      setTimeout(() => {
        inputSlots[emptyIndex].classList.remove('pulse');
      }, 500);
      
      // التحقق التلقائي عند اكتمال الكلمة
      if (selectedLetters.every(slot => slot !== null)) {
        setTimeout(checkAnswer, 500);
      }
    }
  }

  // إزالة حرف من المساحة
  function removeLetter(index) {
    if (selectedLetters[index] !== null) {
      const letter = selectedLetters[index];
      
      // إعادة تمكين البلاطة المقابلة
      const tiles = Array.from(letterTilesElement.children);
      const tile = tiles.find(t => t.textContent === letter && t.classList.contains('used'));
      if (tile) {
        tile.classList.remove('used');
      }
      
      // مسح المساحة
      selectedLetters[index] = null;
      inputSlots[index].textContent = '';
      inputSlots[index].classList.remove('filled');
      inputSlots[index].classList.add('empty');
      
      // إخفاء رسالة الخطأ إذا كانت ظاهرة
      if (feedbackElement.classList.contains('incorrect')) {
        feedbackElement.style.display = 'none';
      }
    }
  }

  // التحقق من الإجابة
  function checkAnswer() {
    const userAnswer = selectedLetters.join('');
    const correctAnswer = words[currentWordIndex].word;
    
    if (userAnswer === correctAnswer) {
      // الإجابة صحيحة
      score += 10;
      scoreElement.textContent = score;
      feedbackElement.textContent = 'أحسنت! إجابة صحيحة 🎉';
      feedbackElement.className = 'feedback correct';
      feedbackElement.style.display = 'block';
      
      // تأثيرات بصرية
      currentWordElement.classList.add('bounce');
      createConfetti();
      
      // الانتقال للكلمة التالية بعد تأخير
      setTimeout(nextWord, 2000);
    } else {
      // الإجابة خاطئة
      feedbackElement.textContent = 'حاول مرة أخرى! 💪';
      feedbackElement.className = 'feedback incorrect';
      feedbackElement.style.display = 'block';
      
      // اهتزاز المساحات
      inputSlots.forEach(slot => {
        slot.style.animation = 'shake 0.5s';
        setTimeout(() => {
          slot.style.animation = '';
        }, 500);
      });
      
      // مسح الإدخال بعد تأخير
      setTimeout(() => {
        selectedLetters.forEach((_, index) => removeLetter(index));
      }, 1500);
    }
  }

  // الانتقال للكلمة التالية
  function nextWord() {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    setupWord();
    updateProgress();
  }

  // تحديث شريط التقدم
  function updateProgress() {
    const progress = ((currentWordIndex + 1) / words.length) * 100;
    progressFillElement.style.width = `${progress}%`;
  }

  // تأثير الكونفيتي
  function createConfetti() {
    const container = document.querySelector('.game-container');
    const colors = ['#FF6B35', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.animation = `confetti ${Math.random() * 3 + 2}s linear forwards`;
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      
      container.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }

  // بدء اللعبة
  initGame();
}

/* وظائف عامة للواجهة */
function highlightActiveNav() {
  const navLinks = document.querySelectorAll(".nav-links a");
  const current = window.location.pathname.split("/").pop();
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkFile = href.split("/").pop();
    if (linkFile === current || (current === "" && linkFile === "index.html")) {
      link.classList.add("active");
    }
  });
}

function initializeStageSelection() {
  const stageButtons = document.querySelectorAll("[data-stage]");
  if (!stageButtons.length) return;
  stageButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const stage = btn.getAttribute("data-stage");
      if (stage) {
        localStorage.setItem("selectedStage", stage);
      }
    });
  });
}

function getSelectedStage() {
  return localStorage.getItem("selectedStage") || defaultStage;
}

function renderDashboard() {
  const container = document.querySelector("[data-dashboard]");
  if (!container) return;

  const stage = getSelectedStage().toUpperCase();
  const profileName = container.querySelector("[data-child-name]");
  const profileStage = container.querySelector("[data-child-stage]");
  const badgesList = container.querySelector("[data-badges]");
  const stats = container.querySelectorAll("[data-stat]");

  if (profileName) profileName.textContent = childProfile.name;
  if (profileStage) profileStage.textContent = `المرحلة: ${stage}`;
  if (badgesList) {
    badgesList.innerHTML = "";
    childProfile.badges.forEach((badge) => {
      const span = document.createElement("span");
      span.className = "badge";
      span.textContent = badge;
      badgesList.appendChild(span);
    });
  }
  stats.forEach((stat) => {
    const type = stat.dataset.stat;
    if (!type) return;
    if (type === "stars") stat.querySelector(".value").textContent = childProfile.stars;
    if (childProfile.weeklyStats[type] !== undefined) {
      stat.querySelector(".value").textContent = childProfile.weeklyStats[type];
    }
  });

  const tiles = container.querySelectorAll(".tile");
  tiles.forEach((tile) => {
    tile.addEventListener("mouseenter", () => tile.classList.add("floating"));
    tile.addEventListener("mouseleave", () => tile.classList.remove("floating"));
  });
}

function renderBooks() {
  const list = document.querySelector("[data-books-list]");
  if (!list) return;
  list.innerHTML = "";
  booksData.forEach((book) => {
    const article = document.createElement("article");
    article.className = "card";
    article.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span class="badge">${book.category}</span>
        <span class="badge">مرحلة ${book.stage}</span>
      </div>
      <h3>${book.title}</h3>
      <p>${book.description}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.85rem;color:rgba(2,48,71,0.7);">
        <span>عدد الصفحات: ${book.pages}</span>
        <button type="button" class="btn-pill">اقرأ الآن →</button>
      </div>
    `;
    list.appendChild(article);
  });
}

function renderStories() {
  const list = document.querySelector("[data-stories-list]");
  const activeContainer = document.querySelector("[data-active-story]");
  if (!list || !activeContainer) return;

  let currentStory = storiesData[0];

  const updateActiveStory = (story) => {
    activeContainer.innerHTML = `
      <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
        <span style="font-size:3rem;">${story.emoji}</span>
        <div>
          <h3 style="margin:0;">${story.title}</h3>
          <p style="margin:0.4rem 0;color:rgba(2,48,71,0.7);">${story.description}</p>
          <span class="badge">مدة الاستماع: ${story.duration}</span>
        </div>
      </div>
      <div style="margin-top:1.5rem;padding:1.2rem;border-radius:1.5rem;background:rgba(255,255,255,0.8);">
        <p style="margin:0;font-size:0.95rem;color:rgba(2,48,71,0.7);">
          🎧 سيتم إضافة ملف الصوت قريبًا. استمتع بقراءة القصة مع طفلك بصوتٍ مرتفع!
        </p>
      </div>
    `;
  };

  updateActiveStory(currentStory);

  list.innerHTML = "";
  storiesData.forEach((story) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card story-item";
    button.dataset.storyId = story.id;
    button.innerHTML = `
      <div style="display:flex;gap:1rem;align-items:center;text-align:right;">
        <span style="font-size:2.5rem;">${story.emoji}</span>
        <div style="text-align:right;">
          <h3 style="margin:0;">${story.title}</h3>
          <p style="margin:0.4rem 0;color:rgba(2,48,71,0.65);">${story.duration} دقيقة</p>
        </div>
      </div>
      <p style="margin:0;color:rgba(2,48,71,0.7);">${story.description}</p>
    `;
    button.addEventListener("click", () => {
      currentStory = story;
      updateActiveStory(story);
      list.querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
    list.appendChild(button);
  });
  list.querySelector("button")?.classList.add("active");
}

function setupAssistantChat() {
  const chatWindow = document.querySelector("[data-chat-window]");
  const form = document.querySelector("[data-chat-form]");
  const textarea = document.querySelector("[data-chat-input]");
  const quickReplies = document.querySelectorAll("[data-quick-reply]");

  if (!chatWindow || !form || !textarea) return;

  const responses = [
    "رائع! لننطقها معًا: شَـ - مْـ - س. ممتاز!",
    "لنلعب لعبة الحروف: اختر كلمة تبدأ بحرف ب.",
    "اقترحت نشاطًا منزليًا: عدّوا معًا ثمار التفاح قبل تناولها.",
    "لنقرأ قصة عن الألوان، تخيّل كل لون مع شيء تحبه.",
    "جرب أن ترسم الرقم 3 ثلاث مرات بصوتٍ عالٍ."
  ];

  const appendMessage = (role, text) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role}`;
    bubble.textContent = text;
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    chatWindow.dataset.initialized = "true";
    }
  

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = textarea.value.trim();
    if (!message) return;
    appendMessage("user", message);
    textarea.value = "";
    setTimeout(() => {
      const reply = responses[Math.floor(Math.random() * responses.length)];
      appendMessage("assistant", reply);
    }, 700);
  });

  quickReplies.forEach((replyBtn) => {
    replyBtn.addEventListener("click", () => {
      const text = replyBtn.dataset.quickReply;
      if (text) {
        appendMessage("user", text);
        setTimeout(() => {
          const reply = responses[Math.floor(Math.random() * responses.length)];
          appendMessage("assistant", reply);
        }, 600);
      }
    });
  });
}

function renderParentReport() {
  const ring = document.querySelector("[data-progress-ring]");
  const totalBadge = document.querySelector("[data-total-progress]");
  const activityList = document.querySelector("[data-activity-log]");
  const highlightsList = document.querySelector("[data-ai-highlights]");
  const parentActivitiesList = document.querySelector("[data-parent-activities]");

  if (ring) {
    const completed =
      childProfile.completion.games.completed +
      childProfile.completion.books.completed +
      childProfile.completion.stories.completed;
    const total =
      childProfile.completion.games.total +
      childProfile.completion.books.total +
      childProfile.completion.stories.total;
    
    // Handle edge case: if totalGoals is 0, set progressPercentage to 0
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const circle = ring.querySelector(".progress");
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference - (percent / 100) * circumference}`;

    const percentLabel = ring.querySelector("[data-percent]");
    if (percentLabel) percentLabel.textContent = `${percent}%`;

    if (totalBadge) totalBadge.textContent = `تم إنجاز ${completed} من ${total} هدف`;
  }

  if (activityList) {
    activityList.innerHTML = "";
    childProfile.latestActivities.forEach((activity) => {
      const wrapper = document.createElement("div");
      wrapper.className = "activity-item";
      const typeLabel =
        activity.type === "game" ? "لعبة" : activity.type === "book" ? "كتاب" : "قصة";
      wrapper.innerHTML = `
        <strong>${activity.title}</strong>
        <span style="color:rgba(2,48,71,0.6);font-size:0.9rem;">${typeLabel} • ${activity.date}</span>
        ${
          activity.score !== undefined
            ? `<span class="badge" style="width:max-content;">نتيجة: ${activity.score}%</span>`
            : ""
        }
      `;
      activityList.appendChild(wrapper);
    });
  }

  if (highlightsList) {
    highlightsList.innerHTML = "";
    childProfile.aiHighlights.forEach((note) => {
      const item = document.createElement("li");
      item.style.listStyle = "none";
      item.className = "card";
      item.style.padding = "1.2rem";
      item.textContent = note;
      highlightsList.appendChild(item);
    });
  }

  if (parentActivitiesList) {
    parentActivitiesList.innerHTML = "";
    activitiesForParents.forEach((activity) => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.display = "grid";
      card.style.gap = "0.8rem";
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.8rem;">
          <span style="font-size:2rem;">${activity.icon}</span>
          <div>
            <h3 style="margin:0;">${activity.title}</h3>
            <p style="margin:0;font-size:0.85rem;color:rgba(2,48,71,0.6);">
              العمر: ${activity.age} • المدة: ${activity.duration}
            </p>
          </div>
        </div>
        <p style="margin:0;color:rgba(2,48,71,0.75);">${activity.description}</p>
      `;
      parentActivitiesList.appendChild(card);
    });
  }
}

/* =========================
   إضافة زر الرجوع للصفحات
   ========================= */
function addBottomNavigation() {
  // لا تضف زر الرجوع للصفحة الرئيسية
  if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
    return;
  }
  
  // إنشاء عنصر div للزر
  const bottomNav = document.createElement('div');
  bottomNav.className = 'container';
  bottomNav.style.maxWidth = '800px';
  bottomNav.style.margin = '20px auto';
  bottomNav.style.textAlign = 'center';
  
  // إضافة زر الرجوع
  const backButton = document.createElement('button');
  backButton.className = 'back-button';
  backButton.id = 'backButton';
  backButton.innerHTML = '← الرجوع';
  backButton.style.display = 'inline-block';
  backButton.style.padding = '12px 24px';
  backButton.style.backgroundColor = '#FF9800';
  backButton.style.color = 'white';
  backButton.style.textDecoration = 'none';
  backButton.style.borderRadius = '5px';
  backButton.style.fontWeight = 'bold';
  backButton.style.fontSize = '16px';
  backButton.style.border = '2px solid #FF9800';
  backButton.style.transition = 'all 0.3s ease';
  backButton.style.cursor = 'pointer';
  backButton.style.marginTop = '20px';
  
  // إضافة حدث النقر على الزر
  backButton.addEventListener('click', function() {
    // التحقق مما إذا كانت هناك صفحة سابقة في سجل التصفح
    if (document.referrer && document.referrer !== window.location.href) {
      // إذا كان هناك صفحة سابقة، ارجع إليها
      window.history.back();
    } else {
      // إذا لم تكن هناك صفحة سابقة، انتقل إلى الصفحة الرئيسية
      window.location.href = 'index.html';
    }
  });
  
  // إضافة الزر إلى العنصر
  bottomNav.appendChild(backButton);
  
  // إضافة العنصر إلى نهاية الصفحة
  document.body.appendChild(bottomNav);
}

/* =========================
   مركز الألعاب المتقدمة
   ========================= */

/* تهيئة لعبة الألوان للمرحلة KG2 */
function initColorDragGame() {
  const gameLevels = [
    // المستوى 1: أساسي - 4 عناصر
    {
      items: [
        { id: 1, emoji: '🍌', color: 'yellow', name: 'موزة' },
        { id: 2, emoji: '🍎', color: 'red', name: 'تفاحة' },
        { id: 3, emoji: '🌳', color: 'green', name: 'شجرة' },
        { id: 4, emoji: '⛄', color: 'white', name: 'رجل ثلج' }
      ],
      colors: ['red', 'yellow', 'green', 'white']
    },
    // المستوى 2: متوسط - 5 عناصر
    {
      items: [
        { id: 1, emoji: '🍊', color: 'orange', name: 'برتقالة' },
        { id: 2, emoji: '🚗', color: 'red', name: 'سيارة' },
        { id: 3, emoji: '☁️', color: 'white', name: 'سحابة' },
        { id: 4, emoji: '🐤', color: 'yellow', name: 'كتكوت' },
        { id: 5, emoji: '🐸', color: 'green', name: 'ضفدع' }
      ],
      colors: ['red', 'yellow', 'green', 'white', 'orange']
    },
    // المستوى 3: متقدم - 6 عناصر
    {
      items: [
        { id: 1, emoji: '🚑', color: 'white', name: 'إسعاف' },
        { id: 2, emoji: '🐯', color: 'orange', name: 'نمر' },
        { id: 3, emoji: '🌼', color: 'yellow', name: 'زهرة' },
        { id: 4, emoji: '🦢', color: 'white', name: 'بجعة' },
        { id: 5, emoji: '🦁', color: 'orange', name: 'أسد' },
        { id: 6, emoji: '🍋', color: 'yellow', name: 'ليمون' }
      ],
      colors: ['yellow', 'white', 'orange', 'green', 'red', 'blue']
    }
  ];

  const colorDetails = {
    'red': { name: 'أحمر', value: '#FF5252' },
    'yellow': { name: 'أصفر', value: '#FFEB3B' },
    'green': { name: 'أخضر', value: '#4CAF50' },
    'white': { name: 'أبيض', value: '#FFFFFF' },
    'orange': { name: 'برتقالي', value: '#FF9800' },
    'blue': { name: 'أزرق', value: '#2196F3' }
  };

  let currentLevel = 0;
  let matchedPairs = 0;
  let correctAnswers = 0;
  let totalAttempts = 0;
  let score = 0;

  const gameArea = document.querySelector("[data-game-area]");
  if (!gameArea) return;

  // إضافة الأنماط الخاصة باللعبة
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .game-container {
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
      background: white;
      border-radius: 25px;
      padding: 30px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
    }

    .level-info {
      background: #FF9800;
      color: white;
      padding: 12px 30px;
      border-radius: 30px;
      margin-bottom: 20px;
      display: inline-block;
      font-size: 22px;
      font-weight: bold;
      box-shadow: 0 5px 15px rgba(255,152,0,0.3);
    }

    .instructions {
      background: white;
      padding: 18px;
      border-radius: 20px;
      margin-bottom: 25px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      font-size: 18px;
    }

    .game-area {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .images-container {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
      min-height: 140px;
      background: rgba(255,255,255,0.95);
      padding: 25px;
      border-radius: 25px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      border: 4px dashed #FF9800;
    }

    .image-item {
      width: 100px;
      height: 100px;
      font-size: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      transition: all 0.3s ease;
      border-radius: 20px;
      background: white;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      border: 3px solid transparent;
    }

    .image-item.dragging {
      opacity: 0.7;
      transform: scale(1.15) rotate(8deg);
      border-color: #FF9800;
    }

    .image-item.matched {
      visibility: hidden;
    }

    .colors-container {
      display: flex;
      justify-content: center;
      gap: 25px;
      flex-wrap: wrap;
      background: rgba(255,255,255,0.95);
      padding: 30px;
      border-radius: 25px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .color-dropzone {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 5px dashed #999;
      position: relative;
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }

    .color-dropzone:hover {
      transform: scale(1.08);
    }

    .color-dropzone.over {
      border-style: solid;
      border-color: #333;
      background-color: rgba(0,0,0,0.1);
      transform: scale(1.12);
    }

    .color-name {
      position: absolute;
      bottom: -35px;
      font-weight: bold;
      color: #333;
      font-size: 16px;
      background: white;
      padding: 5px 12px;
      border-radius: 15px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .matched {
      border-style: solid !important;
      border-color: #4CAF50 !important;
      border-width: 6px !important;
      transform: scale(1.18);
    }

    .matched-item {
      position: absolute;
      font-size: 50px;
      animation: popIn 0.6s;
    }

    .completion-screen {
      display: none;
      background: white;
      padding: 50px;
      border-radius: 30px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
      margin-top: 30px;
    }

    .completion-screen h2 {
      color: #FF9800;
      margin-bottom: 25px;
      font-size: 32px;
    }

    .celebration {
      font-size: 80px;
      margin: 25px 0;
      animation: celebrate 1.2s infinite;
    }

    .score {
      font-size: 24px;
      margin-top: 20px;
      color: #333;
      font-weight: bold;
    }

    .progress {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 20px 0;
    }

    .progress-dot {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #ddd;
      transition: all 0.3s ease;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .progress-dot.active {
      background: #FF9800;
      transform: scale(1.4);
    }

    .progress-dot.completed {
      background: #4CAF50;
    }

    .feedback {
      font-size: 70px;
      margin: 15px 0;
      min-height: 80px;
      animation: popIn 0.5s;
    }

    .validation-message {
      font-size: 20px;
      margin: 10px 0;
      padding: 10px;
      border-radius: 15px;
      background: #E8F5E8;
      color: #2E7D32;
      display: none;
    }

    @keyframes popIn {
      0% { transform: scale(0); }
      70% { transform: scale(1.4); }
      100% { transform: scale(1); }
    }

    @keyframes celebrate {
      0%, 100% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.5) rotate(20deg); }
      75% { transform: scale(1.5) rotate(-20deg); }
    }

    .restart-btn {
      background: #FF9800;
      color: white;
      border: none;
      padding: 18px 45px;
      border-radius: 30px;
      font-size: 22px;
      cursor: pointer;
      margin-top: 20px;
      transition: all 0.3s ease;
    }

    .restart-btn:hover {
      background: #F57C00;
      transform: translateY(-3px);
    }
  `;
  document.head.appendChild(styleElement);

  // إنشاء هيكل اللعبة
  gameArea.innerHTML = `
    <div class="game-container">
      <div class="level-info">المستوى: <span id="currentLevel">1</span></div>
      
      <div class="instructions">
        <h3>اسحب الصورة إلى داخل الدائرة الملونة المناسبة</h3>
      </div>

      <div class="progress" id="progressContainer"></div>

      <div class="feedback" id="feedback"></div>

      <div class="validation-message" id="validationMessage">
        ✓ كل الإجابات صحيحة! انتقل للمستوى التالي
      </div>

      <div class="game-area">
        <div class="images-container" id="imagesContainer">
          <!-- Images will be added here by JavaScript -->
        </div>
        
        <div class="colors-container" id="colorsContainer">
          <!-- Color dropzones will be added here by JavaScript -->
        </div>
      </div>

      <div class="score" id="score">الصور المصنفة: <span id="matchedCount">0</span>/<span id="totalItems">0</span></div>

      <div class="completion-screen" id="completionScreen">
        <div class="celebration">🎉 🎊 🎉</div>
        <h2>مستوى متميز! 🏆</h2>
        <p style="font-size: 22px; color: #666; margin-bottom: 25px;">كل الإجابات صحيحة - أنت تتقدم بشكل رائع!</p>
      </div>

      <div class="completion-screen" id="finalCompletionScreen" style="display: none;">
        <div class="celebration">🏆 🎉 🏆</div>
        <h2>تهانينا! أكملت كل المستويات 🥳</h2>
        <p style="font-size: 22px; color: #666; margin-bottom: 25px;">كل إجاباتك كانت صحيحة - أنت خبير في الألوان!</p>
        <button class="restart-btn" id="restartBtn">العب مرة أخرى</button>
      </div>
    </div>
  `;

  function initializeGame() {
    matchedPairs = 0;
    correctAnswers = 0;
    totalAttempts = 0;
    createImages();
    createColorDropzones();
    updateScore();
    updateProgress();
    document.getElementById('currentLevel').textContent = currentLevel + 1;
    document.getElementById('feedback').textContent = '';
    document.getElementById('validationMessage').style.display = 'none';
  }

  function createImages() {
    const container = document.getElementById('imagesContainer');
    container.innerHTML = '';
    
    const level = gameLevels[currentLevel];
    document.getElementById('totalItems').textContent = level.items.length;
    document.getElementById('matchedCount').textContent = '0';
    
    const shuffledItems = [...level.items].sort(() => Math.random() - 0.5);
    
    shuffledItems.forEach(item => {
      const imgElement = document.createElement('div');
      imgElement.className = 'image-item';
      imgElement.id = `img-${item.id}`;
      imgElement.textContent = item.emoji;
      imgElement.draggable = true;
      imgElement.dataset.itemId = item.id;
      imgElement.dataset.color = item.color;
      
      imgElement.addEventListener('dragstart', handleDragStart);
      imgElement.addEventListener('dragend', handleDragEnd);
      
      container.appendChild(imgElement);
    });
  }

  function createColorDropzones() {
    const container = document.getElementById('colorsContainer');
    container.innerHTML = '';
    
    const level = gameLevels[currentLevel];
    const shuffledColors = [...level.colors].sort(() => Math.random() - 0.5);
    
    shuffledColors.forEach(colorId => {
      const color = colorDetails[colorId];
      const colorElement = document.createElement('div');
      colorElement.className = 'color-dropzone';
      colorElement.id = `color-${colorId}`;
      colorElement.style.backgroundColor = color.value;
      colorElement.dataset.colorId = colorId;
      
      if (colorId === 'white') {
        colorElement.style.borderColor = '#333';
      }
      
      const colorName = document.createElement('div');
      colorName.className = 'color-name';
      colorName.textContent = color.name;
      colorElement.appendChild(colorName);
      
      colorElement.addEventListener('dragover', handleDragOver);
      colorElement.addEventListener('dragenter', handleDragEnter);
      colorElement.addEventListener('dragleave', handleDragLeave);
      colorElement.addEventListener('drop', handleDrop);
      
      container.appendChild(colorElement);
    });
  }

  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.itemId);
    e.target.classList.add('dragging');
  }

  function handleDragEnd(e) {
    e.target.classList.remove('dragging');
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDragEnter(e) {
    e.preventDefault();
    if (e.target.classList.contains('color-dropzone')) {
      e.target.classList.add('over');
    }
  }

  function handleDragLeave(e) {
    if (e.target.classList.contains('color-dropzone')) {
      e.target.classList.remove('over');
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    if (!e.target.classList.contains('color-dropzone')) return;
    
    e.target.classList.remove('over');
    
    const draggedId = e.dataTransfer.getData('text/plain');
    const imageElement = document.getElementById(`img-${draggedId}`);
    const imageColor = imageElement.dataset.color;
    const dropzoneColor = e.target.dataset.colorId;
    const feedback = document.getElementById('feedback');
    
    totalAttempts++;
    
    if (imageColor === dropzoneColor) {
      // تأكد أن الصورة لم تكن متطابقة من قبل
      if (!imageElement.classList.contains('matched')) {
        correctAnswers++;
        score += 20;
      }
      
      imageElement.classList.add('matched');
      
      // Create a new image inside the circle
      const matchedImage = document.createElement('div');
      matchedImage.className = 'matched-item';
      matchedImage.textContent = imageElement.textContent;
      e.target.appendChild(matchedImage);
      
      e.target.classList.add('matched');
      
      feedback.textContent = '🎉';
      feedback.style.color = '#4CAF50';
      
      matchedPairs++;
      updateScore();
      updateProgress();
      
      // التحقق من اكتمال جميع الإجابات الصحيحة
      if (matchedPairs === gameLevels[currentLevel].items.length) {
        const validationMessage = document.getElementById('validationMessage');
        validationMessage.style.display = 'block';
        validationMessage.textContent = `✓ كل الإجابات صحيحة! (${correctAnswers}/${totalAttempts})`;
        
        setTimeout(nextLevel, 2000);
      } else {
        setTimeout(() => {
          feedback.textContent = '';
        }, 1000);
      }
    } else {
      feedback.textContent = '❌';
      feedback.style.color = '#f44336';
      
      setTimeout(() => {
        feedback.textContent = '';
      }, 800);
    }
  }

  function updateScore() {
    document.getElementById('matchedCount').textContent = matchedPairs;
  }

  function updateProgress() {
    const progressContainer = document.getElementById('progressContainer');
    progressContainer.innerHTML = '';
    
    const totalItems = gameLevels[currentLevel].items.length;
    
    for (let i = 0; i < totalItems; i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      if (i < matchedPairs) {
        dot.classList.add('completed');
      } else if (i === matchedPairs) {
        dot.classList.add('active');
      }
      progressContainer.appendChild(dot);
    }
  }

  function nextLevel() {
    currentLevel++;
    
    if (currentLevel >= gameLevels.length) {
      document.getElementById('completionScreen').style.display = 'none';
      document.getElementById('finalCompletionScreen').style.display = 'block';
      
      // تحديث سجل اللعبة
      const accuracy = Math.round((correctAnswers / totalAttempts) * 100);
      updateGameRecord('color-drag-game-kg2', {
        score: score,
        level: gameLevels.length,
        accuracy: accuracy
      });
    } else {
      document.getElementById('completionScreen').style.display = 'block';
      setTimeout(() => {
        document.getElementById('completionScreen').style.display = 'none';
        initializeGame();
      }, 2000);
    }
  }

  function restartGame() {
    currentLevel = 0;
    score = 0;
    document.getElementById('finalCompletionScreen').style.display = 'none';
    initializeGame();
  }

  // إضافة مستمع الحدث لزر إعادة اللعب
  document.getElementById('restartBtn').addEventListener('click', restartGame);

  // بدء اللعبة
  initializeGame();
  
  return {
    cleanup: () => {
      // تنظيف أي مستمعات أحداث أو عناصر تمت إضافتها
      document.getElementById('restartBtn').removeEventListener('click', restartGame);
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    }
  };
}

/* تهيئة لعبة الألوان للمرحلة KG1 */
function initColorGame() {
  const gameData = {
    levels: [
      {
        questions: [
          { image: '🍌', correctColor: 'yellow', colors: ['yellow', 'red', 'blue'] },
          { image: '🍎', correctColor: 'red', colors: ['red', 'green', 'blue'] },
          { image: '🌊', correctColor: 'blue', colors: ['blue', 'green', 'yellow'] },
          { image: '🐸', correctColor: 'green', colors: ['green', 'blue', 'yellow'] },
          { image: '🚗', correctColor: 'red', colors: ['red', 'blue', 'green'] }
        ]
      },
      {
        questions: [
          { image: '🍋', correctColor: 'yellow', colors: ['yellow', 'orange', 'white'] },
          { image: '🌅', correctColor: 'orange', colors: ['orange', 'red', 'yellow'] },
          { image: '🍊', correctColor: 'orange', colors: ['orange', 'red', 'yellow'] },
          { image: '☁️', correctColor: 'white', colors: ['white', 'blue', 'yellow'] },
          { image: '🍐', correctColor: 'green', colors: ['green', 'yellow', 'white'] }
        ]
      },
      {
        questions: [
          { image: '🚑', correctColor: 'white', colors: ['white', 'red', 'blue', 'orange'] },
          { image: '🐯', correctColor: 'orange', colors: ['orange', 'yellow', 'white', 'red'] },
          { image: '🌼', correctColor: 'yellow', colors: ['yellow', 'white', 'orange', 'green'] },
          { image: '⛄', correctColor: 'white', colors: ['white', 'blue', 'yellow', 'orange'] },
          { image: '🦁', correctColor: 'orange', colors: ['orange', 'yellow', 'white', 'red'] }
        ]
      }
    ]
  };

  let currentLevel = 0;
  let currentQuestion = 0;
  let score = 0;
  let totalQuestions = 0;
  let correctAnswers = 0;

  const colorMap = {
    'red': '#FF5252',
    'blue': '#2196F3',
    'green': '#4CAF50',
    'yellow': '#FFEB3B',
    'orange': '#FF9800',
    'white': '#FFFFFF'
  };

  // حساب إجمالي عدد الأسئلة
  gameData.levels.forEach(level => {
    totalQuestions += level.questions.length;
  });

  const gameArea = document.querySelector("[data-game-area]");
  if (!gameArea) return;

  gameArea.innerHTML = `
    <div class="game-container">
      <div id="gameScreen">
        <div class="level-info">المستوى: <span id="currentLevel">1</span></div>
        <h2 id="questionText" style="font-size: 24px; color: #333;">ما هو لون هذه الصورة؟</h2>
        <div id="questionImage" class="question-image"></div>
        
        <div class="progress" id="progressContainer"></div>
        
        <div class="feedback" id="feedback"></div>
        
        <div class="colors-container" id="colorsContainer"></div>
      </div>

      <div class="completion-screen" id="completionScreen" style="display: none;">
        <div class="fireworks">🎉 🎊 🎉</div>
        <h2>أحسنت! أنهيت كل المراحل</h2>
        <p style="font-size: 20px; color: #666; margin-bottom: 20px;">أنت مميز في التعرف على الألوان!</p>
        <button class="restart-btn" id="restartBtn">العب مرة أخرى</button>
      </div>
    </div>
  `;

  // إضافة الأنماط الخاصة باللعبة
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .game-container {
      background: white;
      border-radius: 25px;
      padding: 30px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
      text-align: center;
      max-width: 500px;
      width: 100%;
      margin: 0 auto;
    }

    .level-info {
      background: #FF9800;
      color: white;
      padding: 12px 25px;
      border-radius: 30px;
      margin-bottom: 25px;
      display: inline-block;
      font-size: 20px;
      font-weight: bold;
    }

    .question-image {
      width: 160px;
      height: 160px;
      object-fit: contain;
      margin: 20px auto;
      border: 4px solid #333;
      border-radius: 20px;
      padding: 15px;
      background: white;
      font-size: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .colors-container {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 30px 0;
      flex-wrap: wrap;
    }

    .color-btn {
      width: 90px;
      height: 90px;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 5px solid transparent;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .color-btn:hover {
      transform: scale(1.15);
      border-color: #333;
    }

    .feedback {
      margin: 20px 0;
      font-size: 60px;
      min-height: 80px;
      padding: 10px;
      animation: popIn 0.5s;
    }

    .correct {
      color: #4CAF50;
    }

    .wrong {
      color: #f44336;
    }

    .progress {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin: 20px 0;
    }

    .progress-dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ddd;
      transition: all 0.3s ease;
    }

    .progress-dot.active {
      background: #FF9800;
      transform: scale(1.3);
    }

    .progress-dot.completed {
      background: #4CAF50;
    }

    .restart-btn {
      background: #FF9800;
      color: white;
      border: none;
      padding: 18px 45px;
      border-radius: 30px;
      font-size: 22px;
      cursor: pointer;
      margin-top: 25px;
      transition: all 0.3s ease;
      box-shadow: 0 5px 15px rgba(255,152,0,0.3);
    }

    .restart-btn:hover {
      background: #F57C00;
      transform: translateY(-3px);
    }

    @keyframes popIn {
      0% { transform: scale(0); }
      70% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(styleElement);

  function showQuestion() {
    const level = gameData.levels[currentLevel];
    const question = level.questions[currentQuestion];
    
    document.getElementById('currentLevel').textContent = currentLevel + 1;
    document.getElementById('questionImage').textContent = question.image;
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    
    updateProgressDots();
    
    const colorsContainer = document.getElementById('colorsContainer');
    colorsContainer.innerHTML = '';
    
    // خلط الألوان عشوائياً في كل سؤال
    const shuffledColors = [...question.colors].sort(() => Math.random() - 0.5);
    
    shuffledColors.forEach(color => {
      const colorBtn = document.createElement('button');
      colorBtn.className = 'color-btn';
      colorBtn.style.backgroundColor = colorMap[color] || color;
      if (color === 'white') {
        colorBtn.style.borderColor = '#333';
      }
      colorBtn.onclick = () => checkAnswer(color === question.correctColor);
      colorsContainer.appendChild(colorBtn);
    });
  }

  function updateProgressDots() {
    const progressContainer = document.getElementById('progressContainer');
    progressContainer.innerHTML = '';
    
    const totalQuestions = gameData.levels[currentLevel].questions.length;
    
    for (let i = 0; i < totalQuestions; i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      if (i < currentQuestion) {
        dot.classList.add('completed');
      } else if (i === currentQuestion) {
        dot.classList.add('active');
      }
      progressContainer.appendChild(dot);
    }
  }

  function checkAnswer(isCorrect) {
    const feedback = document.getElementById('feedback');
    
    if (isCorrect) {
      feedback.textContent = '🎉';
      feedback.className = 'feedback correct';
      correctAnswers++;
      score += 20;
      
      setTimeout(nextQuestion, 800);
    } else {
      feedback.textContent = '❌';
      feedback.className = 'feedback wrong';
      
      setTimeout(() => {
        feedback.textContent = '';
      }, 800);
    }
  }

  function nextQuestion() {
    currentQuestion++;
    const level = gameData.levels[currentLevel];
    
    if (currentQuestion >= level.questions.length) {
      currentQuestion = 0;
      currentLevel++;
      
      if (currentLevel >= gameData.levels.length) {
        showCompletionScreen();
        return;
      }
    }
    
    showQuestion();
  }

  function showCompletionScreen() {
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('completionScreen').style.display = 'block';
    
    // تحديث سجل اللعبة
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    updateGameRecord('color-game-kg1', {
      score: score,
      level: gameData.levels.length,
      accuracy: accuracy
    });
  }

  function restartGame() {
    currentLevel = 0;
    currentQuestion = 0;
    correctAnswers = 0;
    score = 0;
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('completionScreen').style.display = 'none';
    showQuestion();
  }

  // إضافة مستمع الحدث لزر إعادة اللعب
  document.getElementById('restartBtn').addEventListener('click', restartGame);

  // بدء اللعبة
  showQuestion();
  
  return {
    cleanup: () => {
      // تنظيف أي مستمعات أحداث أو عناصر تمت إضافتها
      document.getElementById('restartBtn').removeEventListener('click', restartGame);
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    }
  };
}

function initializeGamesPage() {
  const panel = document.querySelector("[data-games-panel]");
  const stage = document.querySelector("[data-game-stage]");
  if (!panel || !stage) return;

  const subjectFiltersContainer = panel.querySelector("[data-subject-filters]");
  const catalogContainer = panel.querySelector("[data-game-catalog]");

  const stageIcon = stage.querySelector("[data-selected-icon]");
  const stageTitle = stage.querySelector("[data-selected-title]");
  const stageDescription = stage.querySelector("[data-selected-description]");
  const stageSubject = stage.querySelector("[data-selected-subject]");
  const stageSkills = stage.querySelector("[data-selected-skills]");
  const gameArea = stage.querySelector("[data-game-area]");

  const liveScoreEl = stage.querySelector("[data-live-score]");
  const liveLevelEl = stage.querySelector("[data-live-level]");
  const liveAccuracyEl = stage.querySelector("[data-live-accuracy]");
  const bestScoreEl = stage.querySelector("[data-best-score]");
  const bestLevelEl = stage.querySelector("[data-best-level]");
  const bestAccuracyEl = stage.querySelector("[data-best-accuracy]");
  const lastPlayedEl = stage.querySelector("[data-last-played]");

  const uniqueSubjects = Array.from(new Set(gameDefinitions.map((game) => game.subject)));
  const subjects = ["الكل", ...uniqueSubjects];

  let activeSubject = "الكل";
  let activeGameId = null;
  let activeCard = null;
  let cleanupActiveGame = null;
  let latestProgress = { score: 0, level: 1, accuracy: 100 };

  const createSkillBadge = (text) => {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = text;
    return span;
  };

  const buildSubjectFilters = () => {
    subjectFiltersContainer.innerHTML = "";
    subjects.forEach((subject) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "subject-chip";
      button.dataset.subject = subject;
      button.textContent = subject;
      if (subject === activeSubject) button.classList.add("active");
      button.addEventListener("click", () => {
        if (activeSubject === subject) return;
        activeSubject = subject;
        buildSubjectFilters();
        renderCatalog();
      });
      subjectFiltersContainer.appendChild(button);
    });
  };

  const resetLiveStats = () => {
    latestProgress = { score: 0, level: 1, accuracy: 100 };
    if (liveScoreEl) liveScoreEl.textContent = "0";
    if (liveLevelEl) liveLevelEl.textContent = "—";
    if (liveAccuracyEl) liveAccuracyEl.textContent = "—";
  };

  const updateBestStatsUI = (record) => {
    if (bestScoreEl) bestScoreEl.textContent = record?.bestScore ?? "—";
    if (bestLevelEl) bestLevelEl.textContent = record?.bestLevel ?? "—";
    if (bestAccuracyEl) bestAccuracyEl.textContent =
      record?.bestAccuracy !== undefined ? `${record.bestAccuracy}٪` : "—";
    if (lastPlayedEl) lastPlayedEl.textContent = formatDate(record?.lastPlayed);
  };

  const updateLiveStatsUI = (progress) => {
    if (progress.score !== undefined) {
      latestProgress.score = progress.score;
      if (liveScoreEl) liveScoreEl.textContent = `${progress.score}`;
    }
    if (progress.level !== undefined) {
      latestProgress.level = progress.level;
      if (liveLevelEl) liveLevelEl.textContent = `${progress.level}`;
    }
    if (progress.accuracy !== undefined) {
      latestProgress.accuracy = progress.accuracy;
      if (liveAccuracyEl) liveAccuracyEl.textContent = formatAccuracy(progress.accuracy);
    }
  };

  const handleProgress = (progress = {}) => {
    updateLiveStatsUI(progress);
    if (!activeGameId) return;
    if (progress.save) {
      const record = updateGameRecord(activeGameId, {
        ...progress,
        timestamp: progress.timestamp || new Date().toISOString()
      });
      updateBestStatsUI(record);
    }
  };

  const renderCatalog = () => {
    catalogContainer.innerHTML = "";
    
    // الحصول على المرحلة الحالية من localStorage أو استخدام المرحلة الافتراضية
    const currentStage = localStorage.getItem('selectedStage') || defaultStage;
    
    // تصفية الألعاب حسب المرحلة والموضوع
    let filteredGames = gameDefinitions.filter(game => 
      !game.stage || game.stage === currentStage
    );
    
    // تطبيق تصفية الموضوع إذا لم يكن "الكل"
    if (activeSubject !== "الكل") {
      filteredGames = filteredGames.filter(game => game.subject === activeSubject);
    }

    if (!filteredGames.length) {
      const empty = document.createElement("div");
      empty.className = "card";
      empty.innerHTML = `
        <h3>قريبًا!</h3>
        <p>نعمل على إضافة ألعاب جديدة لهذه المادة.</p>
      `;
      catalogContainer.appendChild(empty);
      return;
    }

    filteredGames.forEach((game) => {
      const card = document.createElement("article");
      card.className = "game-card";
      card.dataset.gameId = game.id;
      card.innerHTML = `
        <div class="game-card__header">
          <div class="game-card__icon">${game.icon}</div>
          <span class="badge">${game.subject}</span>
        </div>
        <h3 style="margin:0;">${game.title}</h3>
        <p style="margin:0;color:rgba(2,48,71,0.7);">${game.description}</p>
        <div class="game-card__meta">
          <span class="metric-chip">⏱ ${game.minutes}</span>
          <span class="metric-chip">🎯 ${game.challenge}</span>
        </div>
        <ul class="game-card__skills">
          ${game.skills.map((skill) => `<li>${skill}</li>`).join("")}
        </ul>
        <div class="game-card__record">
          ${
            gameRecords[game.id]?.bestScore
              ? `🏅 أفضل نتيجة: ${gameRecords[game.id].bestScore}`
              : "✨ أول تجربة!"
          }
        </div>
        <div class="game-card__cta">
          <button type="button" class="btn-pill" data-game-start="${game.id}">ابدأ المغامرة</button>
        </div>
      `;
      card.addEventListener("click", (event) => {
        if (event.target instanceof HTMLElement && event.target.dataset.gameStart) {
          selectGame(game.id, card);
        } else if (!event.target.dataset.gameStart) {
          selectGame(game.id, card);
        }
      });
      if (game.id === activeGameId) {
        card.classList.add("game-card--active");
        activeCard = card;
      }
      catalogContainer.appendChild(card);
    });

    const firstCard = catalogContainer.querySelector(".game-card");
    if (filteredGames.length && (!activeGameId || !filteredGames.some((g) => g.id === activeGameId))) {
      selectGame(filteredGames[0].id, firstCard);
    }
  };

  const selectGame = (gameId, cardElement) => {
    const game = gameDefinitions.find((item) => item.id === gameId);
    if (!game) return;

    if (cleanupActiveGame) {
      cleanupActiveGame();
      cleanupActiveGame = null;
    }
    activeGameId = gameId;

    if (activeCard) activeCard.classList.remove("game-card--active");
    if (cardElement) {
      cardElement.classList.add("game-card--active");
      activeCard = cardElement;
    }

    if (stageIcon) stageIcon.textContent = game.icon;
    if (stageTitle) stageTitle.textContent = game.title;
    if (stageDescription) stageDescription.textContent = game.description;
    if (stageSubject) stageSubject.textContent = game.subject;

    if (stageSkills) {
      stageSkills.innerHTML = "";
      game.skills.forEach((skill) => {
        stageSkills.appendChild(createSkillBadge(skill));
      });
    }

    const record = gameRecords[gameId] ?? null;
    updateBestStatsUI(record);
    resetLiveStats();

    if (gameArea) {
      gameArea.innerHTML = "";
    }

    cleanupActiveGame = game.init({
      container: gameArea,
      onProgress: handleProgress
    });
  };

  buildSubjectFilters();
  renderCatalog();
}

/* =========================
   الألعاب التفاعلية
   ========================= */

/* لعبة 1: سفاري الحروف */
function initLetterSafari({ container, onProgress }) {
  if (!container) return () => {};
  container.innerHTML = `
    <div class="game-stage__hud">
      <div class="hud-card">
        <span>المستوى</span>
        <strong data-hud-level>1</strong>
      </div>
      <div class="hud-card">
        <span>النقاط</span>
        <strong data-hud-score>0</strong>
      </div>
      <div class="hud-card">
        <span>الحرف المطلوب</span>
        <strong data-hud-target>أ</strong>
      </div>
      <div class="hud-card">
        <span>الدقة</span>
        <strong data-hud-accuracy>100٪</strong>
      </div>
    </div>
    <canvas class="game-canvas" width="360" height="420" aria-label="سفاري الحروف"></canvas>
    <p class="game-instructions">
      🦜 حرك السلة يمينًا ويسارًا لالتقاط الحرف المطلوب. كل خمس نقاط تفتح سرعة جديدة، ومع كل مستوى
      ستظهر تحديات أسرع وأكثر تنوعًا في الحروف. هدفنا ضبط النطق وبناء ذاكرة بصرية قوية.
    </p>
  `;

  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const hudScore = container.querySelector("[data-hud-score]");
  const hudLevel = container.querySelector("[data-hud-level]");
  const hudTarget = container.querySelector("[data-hud-target]");
  const hudAccuracy = container.querySelector("[data-hud-accuracy]");

  const width = canvas.width;
  const height = canvas.height;

  const lettersPool = "أبجد هوز حطي كلمن سعفص قرشت ثخذ ضظغ"
    .replace(/\s/g, "")
    .split("");

  const basket = {
    x: width / 2 - 50,
    y: height - 60,
    width: 110,
    height: 28,
    color: "#FB8500"
  };

  const state = {
    score: 0,
    level: 1,
    target: randomFrom(lettersPool),
    catches: 0,
    tries: 0,
    accuracy: 100,
    speedBoost: 0
  };

  const fallingLetters = [];
  let animationId;
  let running = true;

  const pickTarget = () => {
    const options = shuffleArray(lettersPool).slice(0, 6);
    const newTarget = randomFrom(options);
    state.target = newTarget;
  };

  const spawnLetter = (forceTarget = false) => {
    const letter = forceTarget ? state.target : randomFrom(lettersPool);
    const baseSpeed = 1.2 + state.level * 0.25 + Math.random() * 0.4 + state.speedBoost;
    fallingLetters.push({
      letter,
      x: Math.random() * (width - 60) + 30,
      y: -30,
      radius: 22,
      speed: baseSpeed
    });
  };

  const ensureTargetVisible = () => {
    const hasTarget = fallingLetters.some((item) => item.letter === state.target);
    if (!hasTarget) {
      spawnLetter(true);
    }
  };

  const updateHUD = () => {
    if (hudScore) hudScore.textContent = `${state.score}`;
    if (hudLevel) hudLevel.textContent = `${state.level}`;
    if (hudTarget) hudTarget.textContent = state.target;
    if (hudAccuracy) hudAccuracy.textContent = `${Math.round(state.accuracy)}٪`;
  };

  const emitProgress = (save = true) => {
    const accuracy = state.tries ? (state.catches / state.tries) * 100 : 100;
    state.accuracy = accuracy;
    updateHUD();
    if (typeof onProgress === "function") {
      onProgress({
        score: state.score,
        level: state.level,
        accuracy,
        save,
        timestamp: new Date().toISOString()
      });
    }
  };

  const updateLevel = () => {
    const newLevel = clamp(1 + Math.floor(state.score / 40), 1, 7);
    if (newLevel > state.level) {
      state.level = newLevel;
      state.speedBoost += 0.2;
      emitProgress(true);
    }
  };

  const drawBackground = () => {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#DFF3FF");
    gradient.addColorStop(1, "#FDF5E6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(142, 202, 230, 0.3)";
    ctx.fillRect(18, 18, width - 36, height - 90);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillRect(30, height - 80, width - 60, 50);
  };

  const drawBasket = () => {
    ctx.fillStyle = basket.color;
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(basket.x + 10, basket.y + 6, basket.width - 20, basket.height - 12);
    ctx.fillStyle = "rgba(2, 48, 71, 0.14)";
    ctx.fillRect(basket.x + 16, basket.y + 10, basket.width - 32, basket.height - 20);
  };

  const drawLetters = () => {
    fallingLetters.forEach((letterObj) => {
      ctx.beginPath();
      ctx.arc(letterObj.x, letterObj.y, letterObj.radius, 0, Math.PI * 2);
      ctx.fillStyle =
        letterObj.letter === state.target ? "rgba(251, 133, 0, 0.9)" : "rgba(142, 202, 230, 0.9)";
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "22px Cairo";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(letterObj.letter, letterObj.x, letterObj.y + 2);
    });
  };

  const updateLetters = () => {
    for (let i = fallingLetters.length - 1; i >= 0; i -= 1) {
      const letterObj = fallingLetters[i];
      letterObj.y += letterObj.speed;

      const caught =
        letterObj.y + letterObj.radius >= basket.y &&
        letterObj.y - letterObj.radius <= basket.y + basket.height &&
        letterObj.x >= basket.x &&
        letterObj.x <= basket.x + basket.width;

      if (caught) {
        state.tries += 1;
        if (letterObj.letter === state.target) {
          state.score += 12;
          state.catches += 1;
          pickTarget();
        } else {
          state.score = Math.max(0, state.score - 6);
        }
        fallingLetters.splice(i, 1);
        emitProgress(true);
        updateLevel();
        continue;
      }

      if (letterObj.y - letterObj.radius > height) {
        state.tries += 1;
        if (letterObj.letter === state.target) {
          state.score = Math.max(0, state.score - 8);
        }
        fallingLetters.splice(i, 1);
        emitProgress(true);
      }
    }
  };

  const drawTargetBadge = () => {
    ctx.fillStyle = "rgba(251, 133, 0, 0.25)";
    ctx.fillRect(40, 32, width - 80, 48);
    ctx.fillStyle = "#023047";
    ctx.font = "18px Cairo";
    ctx.textAlign = "left";
    ctx.fillText("التقط الحرف:", 50, 62);
    ctx.textAlign = "right";
    ctx.font = "28px Cairo";
    ctx.fillText(state.target, width - 50, 62);
  };

  const gameLoop = () => {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    drawTargetBadge();
    drawLetters();
    drawBasket();
    updateLetters();
    ensureTargetVisible();
    if (fallingLetters.length < 4) {
      spawnLetter();
    }
    animationId = requestAnimationFrame(gameLoop);
  };

  const moveBasket = (x) => {
    basket.x = clamp(x - basket.width / 2, 16, width - basket.width - 16);
  };

  const handleMouseMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    moveBasket(event.clientX - rect.left);
  };

  const handleTouchMove = (event) => {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    moveBasket(touch.clientX - rect.left);
  };

  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

  pickTarget();
  updateHUD();
  spawnLetter(true);
  spawnLetter();
  gameLoop();

  return () => {
    running = false;
    cancelAnimationFrame(animationId);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("touchmove", handleTouchMove);
  };
}

/* لعبة 2: مجرة الأرقام */
function initMathGalaxy({ container, onProgress }) {
  if (!container) return () => {};
  container.innerHTML = `
    <div class="game-stage__hud">
      <div class="hud-card">
        <span>المستوى</span>
        <strong data-hud-level>1</strong>
      </div>
      <div class="hud-card">
        <span>النقاط</span>
        <strong data-hud-score>0</strong>
      </div>
      <div class="hud-card">
        <span>الهدف الحالي</span>
        <strong data-hud-target>5</strong>
      </div>
      <div class="hud-card">
        <span>الوقت المتبقي</span>
        <strong data-hud-time>60ث</strong>
      </div>
    </div>
    <canvas class="game-canvas" width="360" height="420" aria-label="مجرة الأرقام"></canvas>
    <p class="game-instructions">
      🪐 انقر على الفقاعة الصحيحة التي تساوي الهدف. كل إصابة صحيحة تمنحك طاقة نجومية.
      ازدادت صعوبة المستويات بإضافة عمليات طرح وأعداد أكبر مع دقة زمنية متصاعدة.
    </p>
  `;

  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  const hudLevel = container.querySelector("[data-hud-level]");
  const hudScore = container.querySelector("[data-hud-score]");
  const hudTarget = container.querySelector("[data-hud-target]");
  const hudTime = container.querySelector("[data-hud-time]");

  const width = canvas.width;
  const height = canvas.height;

  let score = 0;
  let level = 1;
  let timeLeft = 75;
  let correctHits = 0;
  let attempts = 0;

  let currentTarget = 5;
  let animationId;
  let countdownId;
  let running = true;

  const bubbles = [];

  const levelTargetRange = [
    { min: 3, max: 8 },
    { min: 5, max: 12 },
    { min: 7, max: 16 },
    { min: 8, max: 20 },
    { min: 10, max: 24 }
  ];

  const getRangeForLevel = () => {
    const index = clamp(level - 1, 0, levelTargetRange.length - 1);
    return levelTargetRange[index];
  };

  const pickTargetValue = () => {
    const range = getRangeForLevel();
    currentTarget = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    if (hudTarget) hudTarget.textContent = currentTarget;
  };

  const generateEquationForResult = (result) => {
    const options = [];
    for (let a = 0; a <= result; a += 1) {
      const b = result - a;
      options.push({ text: `${a} + ${b}`, value: result });
    }
    if (result <= 12) {
      for (let a = result; a <= result + 5; a += 1) {
        const b = a - result;
        options.push({ text: `${a} - ${b}`, value: result });
      }
    }
    return randomFrom(options);
  };

  const generateRandomEquation = () => {
    const max = clamp(8 + level * 4, 8, 24);
    const a = Math.floor(Math.random() * (max + 1));
    const b = Math.floor(Math.random() * (max + 1));
    if (Math.random() < 0.6) {
      const value = a + b;
      return { text: `${a} + ${b}`, value };
    }
    const bigger = Math.max(a, b);
    const smaller = Math.min(a, b);
    const value = bigger - smaller;
    return { text: `${bigger} - ${smaller}`, value };
  };

  const spawnBubble = (forcedEquation = null) => {
    const size = Math.random() * 18 + 34;
    const speed = 0.6 + level * 0.25 + Math.random() * 0.4;
    const equation = forcedEquation || generateRandomEquation();

    bubbles.push({
      ...equation,
      x: Math.random() * (width - size * 2) + size,
      y: height + size,
      radius: size,
      speed,
      glow: forcedEquation ? true : Math.random() > 0.7
    });
  };

  const ensureTargetBubble = () => {
    const hasTarget = bubbles.some((bubble) => bubble.value === currentTarget);
    if (!hasTarget) {
      spawnBubble(generateEquationForResult(currentTarget));
    }
  };

  const updateHUD = () => {
    if (hudLevel) hudLevel.textContent = `${level}`;
    if (hudScore) hudScore.textContent = `${score}`;
    if (hudTime) hudTime.textContent = `${timeLeft}ث`;
  };

  const emitProgress = (save = true) => {
    const accuracy = attempts ? (correctHits / attempts) * 100 : 100;
    if (typeof onProgress === "function") {
      onProgress({
        score,
        level,
        accuracy,
        save,
        timestamp: new Date().toISOString()
      });
    }
  };

  const levelUp = () => {
    const newLevel = clamp(1 + Math.floor(score / 50), 1, 6);
    if (newLevel > level) {
      level = newLevel;
      timeLeft += 10;
      emitProgress(true);
    }
  };

  const drawBackground = () => {
    const gradient = ctx.createRadialGradient(width / 2, height, 80, width / 2, height, height);
    gradient.addColorStop(0, "#1B4965");
    gradient.addColorStop(1, "#14213D");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fillRect(20, 40, width - 40, height - 80);
  };

  const drawBubbles = () => {
    bubbles.forEach((bubble) => {
      const bubbleGradient = ctx.createRadialGradient(
        bubble.x - bubble.radius / 3,
        bubble.y - bubble.radius / 3,
        10,
        bubble.x,
        bubble.y,
        bubble.radius
      );
      const baseColor =
        bubble.value === currentTarget ? "rgba(255, 183, 3, 0.9)" : "rgba(168, 218, 220, 0.85)";
      bubbleGradient.addColorStop(0, "#FFFFFF");
      bubbleGradient.addColorStop(1, baseColor);
      ctx.fillStyle = bubbleGradient;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fill();

      if (bubble.glow) {
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = "#023047";
      ctx.font = `${Math.max(16, bubble.radius / 2)}px Cairo`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(bubble.text, bubble.x, bubble.y);
    });
  };

  const updateBubbles = () => {
    for (let i = bubbles.length - 1; i >= 0; i -= 1) {
      const bubble = bubbles[i];
      bubble.y -= bubble.speed;
      if (bubble.y + bubble.radius < 0) {
        bubbles.splice(i, 1);
      }
    }
  };

  const handleClick = (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    for (let i = bubbles.length - 1; i >= 0; i -= 1) {
      const bubble = bubbles[i];
      const distance = Math.hypot(bubble.x - clickX, bubble.y - clickY);
      if (distance <= bubble.radius) {
        attempts += 1;
        bubbles.splice(i, 1);
        if (bubble.value === currentTarget) {
          correctHits += 1;
          score += 15;
          pickTargetValue();
          emitProgress(true);
          levelUp();
        } else {
          score = Math.max(0, score - 6);
          emitProgress(true);
        }
        break;
      }
    }
  };

  const drawTargetPanel = () => {
    ctx.fillStyle = "rgba(255, 183, 3, 0.25)";
    ctx.fillRect(30, 24, width - 60, 44);
    ctx.fillStyle = "#FFF";
    ctx.font = "16px Cairo";
    ctx.textAlign = "left";
    ctx.fillText("ابحث عن نتيجة:", 40, 52);
    ctx.font = "26px Cairo";
    ctx.textAlign = "right";
    ctx.fillStyle = "#FB8500";
    ctx.fillText(`${currentTarget}`, width - 40, 52);
  };

  const gameLoop = () => {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    drawTargetPanel();
    drawBubbles();
    updateBubbles();

    if (bubbles.length < 6) {
      spawnBubble();
    }
    ensureTargetBubble();

    updateHUD();
    animationId = requestAnimationFrame(gameLoop);
  };

  const endGame = () => {
    running = false;
    cancelAnimationFrame(animationId);
    clearInterval(countdownId);
    canvas.removeEventListener("click", handleClick);
    const overlay = document.createElement("div");
    overlay.className = "game-overlay";
    overlay.innerHTML = `
      <div class="game-overlay__content game-over-panel">
        <h3>انتهت الرحلة الفضائية! 🚀</h3>
        <p>نقاطك: ${score} • الدقة: ${formatAccuracy((correctHits / (attempts || 1)) * 100)}</p>
        <button type="button" class="btn-pill" data-restart-math>إعادة اللعب</button>
      </div>
    `;
    container.appendChild(overlay);
    emitProgress(true);
    overlay.querySelector("[data-restart-math]").addEventListener("click", () => {
      overlay.remove();
      initMathGalaxy({ container, onProgress });
    });
  };

  const startCountdown = () => {
    countdownId = setInterval(() => {
      if (!running) return;
      timeLeft -= 1;
      updateHUD();
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  };

  pickTargetValue();
  updateHUD();
  spawnBubble(generateEquationForResult(currentTarget));
  spawnBubble();
  spawnBubble();
  ensureTargetBubble();
  canvas.addEventListener("click", handleClick);
  startCountdown();
  gameLoop();

  return () => {
    running = false;
    cancelAnimationFrame(animationId);
    clearInterval(countdownId);
    canvas.removeEventListener("click", handleClick);
  };
}

/* لعبة 3: حديقة الكلمات */
function initWordGarden({ container, onProgress }) {
  if (!container) return () => {};
  container.innerHTML = `
    <div class="game-stage__hud">
      <div class="hud-card">
        <span>المستوى</span>
        <strong data-hud-level>1</strong>
      </div>
      <div class="hud-card">
        <span>الكلمات المزروعة</span>
        <strong data-hud-score>0</strong>
      </div>
      <div class="hud-card">
        <span>الدقة</span>
        <strong data-hud-accuracy>100٪</strong>
      </div>
    </div>
    <div class="word-garden">
      <div class="word-garden__progress">
        <div class="word-garden__bar" data-progress-bar></div>
      </div>
      <div class="word-garden__rows">
        <div class="word-garden__words" data-word-cards></div>
        <div class="word-garden__emoji" data-emoji-cards></div>
      </div>
      <p class="game-instructions">
        🌷 اختر كلمة، ثم طابقها مع الصورة الصحيحة. كل مستوى يضيف مفردات جديدة ويدعم التفكير اللغوي
        البصري. عندما تنتهي من كل الكلمات ستحتفل الفراشات بنجاحك!
      </p>
    </div>
  `;

  const hudLevel = container.querySelector("[data-hud-level]");
  const hudScore = container.querySelector("[data-hud-score]");
  const hudAccuracy = container.querySelector("[data-hud-accuracy]");
  const wordsContainer = container.querySelector("[data-word-cards]");
  const emojiContainer = container.querySelector("[data-emoji-cards]");
  const progressBar = container.querySelector("[data-progress-bar]");

  const levels = [
    [
      { word: "Sun", emoji: "☀️", hint: "يضيء السماء" },
      { word: "Fish", emoji: "🐟", hint: "يسبح في الماء" },
      { word: "Tree", emoji: "🌳", hint: "يمنحنا الظل" },
      { word: "Milk", emoji: "🥛", hint: "شراب أبيض" }
    ],
    [
      { word: "Bird", emoji: "🐦", hint: "يطير في السماء" },
      { word: "Book", emoji: "📚", hint: "نقرأه للتعلم" },
      { word: "Apple", emoji: "🍎", hint: "فاكهة حمراء" },
      { word: "Star", emoji: "⭐", hint: "تلمع ليلًا" }
    ],
    [
      { word: "Cloud", emoji: "☁️", hint: "تجلب المطر" },
      { word: "Cake", emoji: "🍰", hint: "حلوى الأعياد" },
      { word: "Ball", emoji: "⚽", hint: "نلعب به الرياضة" },
      { word: "Car", emoji: "🚗", hint: "وسيلة للنقل" }
    ]
  ];

  let currentLevelIndex = 0;
  let plantedWords = 0;
  let matches = 0;
  let attempts = 0;
  let selectedWord = null;

  const updateHUD = () => {
    if (hudLevel) hudLevel.textContent = `${currentLevelIndex + 1}`;
    if (hudScore) hudScore.textContent = `${plantedWords}`;
    const accuracy = attempts ? (matches / attempts) * 100 : 100;
    if (hudAccuracy) hudAccuracy.textContent = `${Math.round(accuracy)}٪`;
    if (progressBar) {
      const percent = ((currentLevelIndex + matches / levels[currentLevelIndex].length) / levels.length) * 100;
      progressBar.style.width = `${clamp(percent, 0, 100)}%`;
    }
  };

  const emitProgress = (save = true) => {
    const accuracy = attempts ? (matches / attempts) * 100 : 100;
    if (typeof onProgress === "function") {
      onProgress({
        score: plantedWords,
        level: currentLevelIndex + 1,
        accuracy,
        save,
        timestamp: new Date().toISOString()
      });
    }
  };

  const celebrate = (message) => {
    const overlay = document.createElement("div");
    overlay.className = "game-overlay";
    overlay.innerHTML = `
      <div class="game-overlay__content">
        <h3>${message.title}</h3>
        <p>${message.subtitle}</p>
      </div>
    `;
    container.appendChild(overlay);
    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 300);
    }, 1100);
  };

  const renderLevel = () => {
    const levelData = levels[currentLevelIndex];
    wordsContainer.innerHTML = "";
    emojiContainer.innerHTML = "";
    selectedWord = null;
    matches = 0;
    attempts = 0;

    const shuffledWords = shuffleArray(levelData);
    const shuffledEmoji = shuffleArray(levelData);

    shuffledWords.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "word-card";
      card.dataset.word = item.word;
      card.dataset.emoji = item.emoji;
      card.dataset.hint = item.hint;
      card.innerHTML = `
        <span>${item.word}</span>
        <small style="display:block;color:rgba(2,48,71,0.6);font-size:0.75rem;">${item.hint}</small>
      `;
      wordsContainer.appendChild(card);
    });

    shuffledEmoji.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "emoji-card";
      card.dataset.emoji = item.emoji;
      card.innerHTML = `<span style="font-size:2.2rem;">${item.emoji}</span>`;
      emojiContainer.appendChild(card);
    });

    updateHUD();
  };

  const checkCompletion = () => {
    const levelWords = levels[currentLevelIndex];
    if (matches >= levelWords.length) {
      celebrate({
        title: "أحسنت! 🌼",
        subtitle: "زرعت كل الكلمات في هذا المستوى."
      });
      plantedWords += levelWords.length;
      emitProgress(true);
      if (currentLevelIndex < levels.length - 1) {
        currentLevelIndex += 1;
        setTimeout(() => {
          renderLevel();
        }, 700);
      } else {
        const overlay = document.createElement("div");
        overlay.className = "game-overlay";
        overlay.innerHTML = `
          <div class="game-overlay__content game-over-panel">
            <h3>حديقة المفردات ازدانت بالألوان! 🎉</h3>
            <p>زرعت ${plantedWords} كلمة جديدة بدقة ${hudAccuracy.textContent}.</p>
            <button type="button" class="btn-pill" data-restart-garden>إعادة التجربة</button>
          </div>
        `;
        container.appendChild(overlay);
        overlay.querySelector("[data-restart-garden]").addEventListener("click", () => {
          overlay.remove();
          currentLevelIndex = 0;
          plantedWords = 0;
          renderLevel();
          emitProgress(true);
        });
      }
    } else {
      updateHUD();
    }
  };

  const handleWordClick = (event) => {
    const target = event.target.closest(".word-card");
    if (!target || target.classList.contains("matched")) return;
    wordsContainer.querySelectorAll(".word-card").forEach((card) => card.classList.remove("selected"));
    target.classList.add("selected");
    selectedWord = {
      word: target.dataset.word,
      emoji: target.dataset.emoji,
      element: target
    };
  };

  const handleEmojiClick = (event) => {
    const target = event.target.closest(".emoji-card");
    if (!target || target.classList.contains("matched") || !selectedWord) return;
    attempts += 1;
    if (target.dataset.emoji === selectedWord.emoji) {
      matches += 1;
      selectedWord.element.classList.add("matched");
      target.classList.add("matched");
      selectedWord = null;
      emitProgress(true);
      updateHUD();
      checkCompletion();
    } else {
      selectedWord.element.classList.add("pulse");
      setTimeout(() => selectedWord.element.classList.remove("pulse"), 400);
      selectedWord = null;
      wordsContainer.querySelectorAll(".word-card").forEach((card) => card.classList.remove("selected"));
      emitProgress(false);
      updateHUD();
    }
  };

  wordsContainer.addEventListener("click", handleWordClick);
  emojiContainer.addEventListener("click", handleEmojiClick);

  renderLevel();

  return () => {
    wordsContainer.removeEventListener("click", handleWordClick);
    emojiContainer.removeEventListener("click", handleEmojiClick);
  };
}