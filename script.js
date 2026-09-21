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

const difficultyTimes = {
    easy: 60,
    medium: 45,
    hard: 30
};

let cards = [];
let firstCard = null;
let secondCard = null;

let lockBoard = false;
let moves = 0;
let score = 0;
let timeLeft = 60;

let timer = null;
let gameStarted = false;


// ========================================
// START / RESET GAME
// ========================================

function startGame() {

    // Stop any existing timer
    clearInterval(timer);

    // Reset game variables
    cards = [];
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    moves = 0;
    score = 0;
    gameStarted = false;

    // Get selected difficulty
    const difficulty = difficultySelect.value;

    timeLeft = difficultyTimes[difficulty];

    // Update interface
    timerElement.textContent = timeLeft;
    movesElement.textContent = moves;
    scoreElement.textContent = score;
    messageElement.textContent = "";

    // Create fresh board
    createCards();
}


// ========================================
// CREATE CARDS
// ========================================

function createCards() {

    gameBoard.innerHTML = "";

    const cardSymbols = [...symbols, ...symbols];

    shuffle(cardSymbols);

    cardSymbols.forEach((symbol) => {

        const card = document.createElement("button");

        card.type = "button";

        card.className = "card";

        card.dataset.symbol = symbol;

        card.textContent = "❓";

        card.addEventListener("click", function () {
            flipCard(card);
        });

        gameBoard.appendChild(card);

        cards.push(card);
    });
}


// ========================================
// SHUFFLE
// ========================================

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const randomIndex =
            Math.floor(Math.random() * (i + 1));

        [
            array[i],
            array[randomIndex]
        ] = [
            array[randomIndex],
            array[i]
        ];
    }

    return array;
}


// ========================================
// FLIP CARD
// ========================================

function flipCard(card) {

    if (lockBoard) {
        return;
    }

    if (card === firstCard) {
        return;
    }

    if (card.classList.contains("matched")) {
        return;
    }

    // Start timer on first card
    if (!gameStarted) {

        gameStarted = true;

        startTimer();
    }

    card.classList.add("flipped");

    card.textContent = card.dataset.symbol;

    if (firstCard === null) {

        firstCard = card;

        return;
    }

    secondCard = card;

    moves++;

    movesElement.textContent = moves;

    checkMatch();
}


// ========================================
// CHECK MATCH
// ========================================

function checkMatch() {

    const match =
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol;

    if (match) {

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        score += 10;

        scoreElement.textContent = score;

        resetTurn();

        checkWin();

    } else {

        lockBoard = true;

        setTimeout(function () {

            if (firstCard && secondCard) {

                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");

                firstCard.textContent = "❓";
                secondCard.textContent = "❓";
            }

            resetTurn();

        }, 700);
    }
}


// ========================================
// RESET TURN
// ========================================

function resetTurn() {

    firstCard = null;
    secondCard = null;

    lockBoard = false;
}


// ========================================
// TIMER
// ========================================

function startTimer() {

    clearInterval(timer);

    timer = setInterval(function () {

        timeLeft--;

        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {

            clearInterval(timer);

            gameOver();
        }

    }, 1000);
}


// ========================================
// CHECK WIN
// ========================================

function checkWin() {

    const matchedCards =
        document.querySelectorAll(".card.matched");

    if (matchedCards.length === cards.length) {

        clearInterval(timer);

        gameStarted = false;

        const timeBonus = timeLeft;

        score += timeBonus;

        scoreElement.textContent = score;

        messageElement.textContent =
            `🎉 Congratulations! You won! Final Score: ${score}`;

        lockBoard = true;
    }
}


// ========================================
// GAME OVER
// ========================================

function gameOver() {

    clearInterval(timer);

    gameStarted = false;

    lockBoard = true;

    messageElement.textContent =
        "⏰ Time's up! Click Restart Game to try again.";

    cards.forEach(function (card) {

        if (!card.classList.contains("matched")) {

            card.classList.add("flipped");

            card.textContent = card.dataset.symbol;
        }
    });
}


// ========================================
// RESTART BUTTON
// ========================================

restartButton.addEventListener("click", function () {

    startGame();

});


// ========================================
// DIFFICULTY CHANGE
// ========================================

difficultySelect.addEventListener("change", function () {

    startGame();

});


// ========================================
// START GAME WHEN PAGE LOADS
// ========================================

startGame();
