const gameBoard = document.getElementById("game-board");
const timerElement = document.getElementById("timer");
const movesElement = document.getElementById("moves");
const scoreElement = document.getElementById("score");
const messageElement = document.getElementById("message");
const restartButton = document.getElementById("restart-btn");
const difficultySelect = document.getElementById("difficulty");

const symbols = [
    "🚀",
    "💻",
    "🤖",
    "🧠",
    "⚡",
    "🎯",
    "🔥",
    "🌟"
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let score = 0;
let timeLeft = 60;

let timer = null;
let gameStarted = false;


// ===============================
// DIFFICULTY SETTINGS
// ===============================

const difficultyTimes = {
    easy: 60,
    medium: 45,
    hard: 30
};


// ===============================
// START GAME
// ===============================

function startGame() {

    clearInterval(timer);

    cards = [];
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    moves = 0;
    score = 0;

    const difficulty = difficultySelect.value;

    timeLeft = difficultyTimes[difficulty];

    gameStarted = false;

    movesElement.textContent = moves;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    messageElement.textContent = "";

    createCards();
}


// ===============================
// CREATE CARDS
// ===============================

function createCards() {

    gameBoard.innerHTML = "";

    const cardSymbols = [...symbols, ...symbols];

    shuffle(cardSymbols);

    cardSymbols.forEach((symbol) => {

        const card = document.createElement("button");

        card.classList.add("card");

        card.dataset.symbol = symbol;

        card.textContent = "❓";

        card.addEventListener("click", () => flipCard(card));

        gameBoard.appendChild(card);

        cards.push(card);
    });
}


// ===============================
// SHUFFLE
// ===============================

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const randomIndex =
            Math.floor(Math.random() * (i + 1));

        [array[i], array[randomIndex]] =
            [array[randomIndex], array[i]];
    }

    return array;
}


// ===============================
// FLIP CARD
// ===============================

function flipCard(card) {

    if (lockBoard) return;

    if (card === firstCard) return;

    if (card.classList.contains("matched")) return;

    if (!gameStarted) {

        gameStarted = true;

        startTimer();
    }

    card.classList.add("flipped");

    card.textContent = card.dataset.symbol;

    if (!firstCard) {

        firstCard = card;

        return;
    }

    secondCard = card;

    moves++;

    movesElement.textContent = moves;

    checkMatch();
}


// ===============================
// CHECK MATCH
// ===============================

function checkMatch() {

    const isMatch =
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol;

    if (isMatch) {

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        score += 10;

        scoreElement.textContent = score;

        resetTurn();

        checkWin();

    } else {

        lockBoard = true;

        setTimeout(() => {

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            firstCard.textContent = "❓";
            secondCard.textContent = "❓";

            resetTurn();

        }, 800);
    }
}


// ===============================
// RESET TURN
// ===============================

function resetTurn() {

    firstCard = null;
    secondCard = null;
    lockBoard = false;
}


// ===============================
// TIMER
// ===============================

function startTimer() {

    timer = setInterval(() => {

        timeLeft--;

        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {

            clearInterval(timer);

            gameOver();
        }

    }, 1000);
}


// ===============================
// CHECK WIN
// ===============================

function checkWin() {

    const matchedCards =
        document.querySelectorAll(".card.matched");

    if (matchedCards.length === cards.length) {

        clearInterval(timer);

        const timeBonus = timeLeft;

        score += timeBonus;

        scoreElement.textContent = score;

        messageElement.textContent =
            `🎉 You won! Final Score: ${score}`;

        gameStarted = false;
    }
}


// ===============================
// GAME OVER
// ===============================

function gameOver() {

    lockBoard = true;
    gameStarted = false;

    messageElement.textContent =
        "⏰ Time's up! Try again!";

    cards.forEach((card) => {

        if (!card.classList.contains("matched")) {

            card.classList.add("flipped");

            card.textContent = card.dataset.symbol;
        }
    });
}


// ===============================
// RESTART
// ===============================

restartButton.addEventListener(
    "click",
    startGame
);


// ===============================
// DIFFICULTY CHANGE
// ===============================

difficultySelect.addEventListener(
    "change",
    startGame
);


// ===============================
// INITIALIZE GAME
// ===============================

startGame();
