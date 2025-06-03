const guessInput = document.getElementById("guessInput");
const checkBtn = document.getElementById("checkBtn");
const restartBtn = document.getElementById("restartBtn");
const message = document.getElementById("message");
const history = document.getElementById("history");
const volumeControl = document.getElementById("volumeControl");
const toggleMusic = document.getElementById("toggleMusic");

const gameMusic = document.getElementById("gameMusic");
const failSound = document.getElementById("failSound");
const buttonClick = document.getElementById("buttonClick");

let secretNumber;
let attempts;
const maxAttempts = 10;
let musicPlaying = false;

function initGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  message.textContent = "Введите число от 1 до 100 и нажмите Проверить.";
  message.style.color = "var(--text)";
  history.innerHTML = "";
  guessInput.value = "";
  guessInput.disabled = false;
  guessInput.classList.remove("error");
  checkBtn.style.display = "inline-block";
  restartBtn.style.display = "none";
  guessInput.focus();
  
  playMusic();
}

function addHistory(text) {
  const li = document.createElement("li");
  li.textContent = text;
  history.appendChild(li);
  history.scrollTop = history.scrollHeight;
}

function setErrorState(errorMsg) {
  message.textContent = errorMsg;
  message.style.color = "red";
  guessInput.classList.add("error");
}

function clearErrorState() {
  message.style.color = "var(--text)";
  guessInput.classList.remove("error");
}

function playMusic() {
  gameMusic.volume = volumeControl.value;
  if (!musicPlaying) {
    gameMusic.play().catch(() => {
      // Автоматический старт звука может быть заблокирован браузером
      musicPlaying = false;
    });
    musicPlaying = true;
  }
}

function pauseMusic() {
  gameMusic.pause();
  musicPlaying = false;
}

checkBtn.addEventListener("click", () => {
  buttonClick.play();
  const guess = Number(guessInput.value);
  
  if (!guess || guess < 1 || guess > 100) {
    setErrorState("Пожалуйста, введите число от 1 до 100!");
    guessInput.focus();
    return;
  }
  
  clearErrorState();
  attempts++;

  const diff = Math.abs(secretNumber - guess);

  if (guess === secretNumber) {
    message.style.color = "green";
    message.textContent = `🎉 Поздравляем! Вы угадали число за ${attempts} попыток!`;
    guessInput.disabled = true;
    checkBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
    pauseMusic();
  } else if (attempts >= maxAttempts) {
    message.style.color = "red";
    message.textContent = `Игра окончена! Вы исчерпали ${maxAttempts} попыток. Загаданное число: ${secretNumber}`;
    guessInput.disabled = true;
    checkBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
    pauseMusic();
    failSound.play();
  } else {
    if (guess < secretNumber) {
      message.textContent = "Загаданное число больше.";
    } else {
      message.textContent = "Загаданное число меньше.";
    }

    if (diff <= 5) {
      message.style.color = "green";
    } else if (diff <= 15) {
      message.style.color = "orange";
    } else {
      message.style.color = "red";
    }

    addHistory(`Попытка ${attempts}: ${guess} — ${guess < secretNumber ? "меньше" : "больше"} загаданного.`);
  }

  guessInput.value = "";
  guessInput.focus();
});

restartBtn.addEventListener("click", () => {
  buttonClick.play();
  initGame();
});

volumeControl.addEventListener("input", () => {
  gameMusic.volume = volumeControl.value;
});

toggleMusic.addEventListener("click", () => {
  buttonClick.play();
  if (musicPlaying) {
    pauseMusic();
    toggleMusic.textContent = "Музыка Вкл";
  } else {
    playMusic();
    toggleMusic.textContent = "Музыка Выкл";
  }
});

// Убираем красное выделение при вводе
guessInput.addEventListener("input", () => {
  if (guessInput.classList.contains("error")) {
    clearErrorState();
  }
});

initGame();
