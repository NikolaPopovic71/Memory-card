const cardsData = [
  "🍎",
  "🍌",
  "🍇",
  "🍉",
  "🍓",
  "🍒",
  "🍍",
  "🥝",
  "🥑",
  "🍆",
  "🌽",
  "🥕",
  "🍅",
  "🥥",
  "🍋",
  "🍈",
  "😜",
  "😄",
  "😎",
  "🤓",
  "😇",
  "🤠",
  "😷",
  "🤡",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐸",
  "🐵",
  "🐔",
  "🐧",
  "🐦",
  "🐤",
  "🐣",
  "🐺",
  "🦄",
  "🐝",
  "🐛",
  "🦋",
  "🐌",
  "🐞",
  "🐜",
  "🪲",
  "🕷️",
  "🦂",
  "🐢",
  "🐍",
  "🦎",
  "🦖",
  "🦕",
  "🐙",
  "🦑",
  "🦐",
  "🦞",
  "🦀",
  "🐡",
  "🐠",
  "🐟",
  "🐬",
  "🐳",
  "🐋",
  "🦈",
  "🐊",
  "🐅",
  "🐆",
  "🦓",
  "🦍",
  "🐘",
  "🦏",
  "🦛",
  "🐪",
  "🐫",
  "🦙",
  "🐃",
  "🐂",
  "🐄",
  "🐎",
  "🦌",
  "🦥",
  "🦦",
  "🦨",
  "🦡",
  "🐁",
  "🐀",
  "🦔",
  "🐇",
  "🐿️",
  "🦔",
  "🐾",
];

const timeLimits = {
  "4x4": 40,
  "6x6": 150,
  "8x8": 420,
  "10x10": 900,
  "12x12": 1800,
};

let timerInterval;
let timeLeft;
let startTime;

document.getElementById("startGame").addEventListener("click", startGame);
document.getElementById("stopAndBack").addEventListener("click", stopAndBack);

function stopAndBack() {
  // Stop the timer
  clearInterval(timerInterval);

  // Reset the game state
  matchedPairs = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  // Clear the game container
  document.getElementById("gameContainer").innerHTML = "";

  // Hide the game screen and show the welcome screen
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("welcome-screen").style.display = "flex";

  // Hide the timer and stop button
  document.getElementById("timer").style.display = "none";
  document.getElementById("stopAndBack").style.display = "none";
}

// Existing startGame function
function startGame() {
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "flex";
  document.getElementById("game-screen").classList.remove("blur");
  document.getElementById("result-modal").style.display = "none";
  document.getElementById("timer").style.display = "block";
  document.getElementById("stopAndBack").style.display = "block"; // Show the stop button

  clearInterval(timerInterval); // Clear any existing timer interval
  matchedPairs = 0; // Reset matched pairs

  const gridSize = document.getElementById("gridSize").value;
  const [rows, cols] = gridSize.split("x").map(Number);
  const totalCards = rows * cols;

  const shuffledCardsData = shuffle([...cardsData]); // Shuffle the entire cardsData array
  const selectedCards = shuffledCardsData.slice(0, totalCards / 2); // Take the first totalCards / 2 elements
  const gameCards = shuffle([...selectedCards, ...selectedCards]);

  const gameContainer = document.getElementById("gameContainer");
  gameContainer.innerHTML = "";
  gameContainer.setAttribute("data-size", gridSize); // Set the data-size attribute
  gameContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`; // Change to 1fr to adjust dynamically

  gameCards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.card = card;
    cardElement.addEventListener("click", handleCardClick);
    gameContainer.appendChild(cardElement);
  });

  startTimer(timeLimits[gridSize]);
}

function startTimer(limit) {
  clearInterval(timerInterval);
  timeLeft = limit;
  document.getElementById("time").textContent = timeLeft;
  startTime = Date.now();

  timerInterval = setInterval(updateTime, 1000);
}

function updateTime() {
  timeLeft--;
  document.getElementById("time").innerText = `${timeLeft}s`;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    showResultModal(false);
  }
}

let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;

function handleCardClick() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("open");
  this.textContent = this.dataset.card;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.card === secondCard.dataset.card;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  matchedPairs++;
  resetBoard();

  const gridSize = document.getElementById("gridSize").value;
  const totalPairs = (gridSize.split("x")[0] * gridSize.split("x")[1]) / 2;

  if (matchedPairs === totalPairs) {
    clearInterval(timerInterval); // Stop the timer
    showResultModal(true);
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("open");
    secondCard.classList.remove("open");
    firstCard.textContent = "";
    secondCard.textContent = "";
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showResultModal(isWin) {
  clearInterval(timerInterval);
  const totalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById(
    "time-spent"
  ).textContent = `Time spent: ${totalTimeSpent} seconds`;

  const gridSize = document.getElementById("gridSize").value;
  const timeLimit = timeLimits[gridSize];

  if (isWin) {
    if (totalTimeSpent < timeLimit / 2) {
      document.getElementById("result-message").textContent =
        "Congratulations! You have an excellent memory!";
    } else {
      document.getElementById("result-message").textContent =
        "Congratulations!";
    }
  } else {
    document.getElementById("result-message").textContent =
      "Time's up! Better luck next time.";
  }

  document.getElementById("game-screen").classList.add("blur"); // Add blur class to game screen
  document.getElementById("result-modal").style.display = "block";
}

function showWelcomeScreen() {
  document.getElementById("welcome-screen").style.display = "flex";
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("result-modal").style.display = "none";
  document.getElementById("timer").style.display = "none";
  document.getElementById("game-screen").classList.remove("blur");
  document.getElementById("stopAndBack").style.display = "none"; // Hide the stop button
  matchedPairs = 0;
  clearInterval(timerInterval);
  document.getElementById("gameContainer").innerHTML = "";
}
