const questions = [
  {
    prompt: "What is the best team in London?",
    options: ["Tottenham Hotspur", "Arsenal", "Brentford", "Chelsea"],
    answer: "Tottenham Hotspur",
  },
  {
    prompt: "What U.S. state is home to Seattle?",
    options: ["Oregon", "California", "Washington", "New York"],
    answer: "Washington",
  },
  {
    prompt: "True or False? Pigs can fly.",
    options: ["True", "False"],
    answer: "True",
  },
  {
    prompt: "What county is Milton Keynes in?",
    options: ["Bedfordshire", "Gloucestershire", "Buckinghamshire", "Northumberland"],
    answer: "Buckinghamshire",
  },
  {
    prompt: "2 + 2 = ?",
    options: ["2", "21", "4", "54"],
    answer: "4",
  },
];

const questionChip = document.getElementById("question-chip");
const questionCounter = document.getElementById("question-counter");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options");
const progressFill = document.getElementById("progress-fill");
const nextButton = document.getElementById("next-button");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const resultTitle = document.getElementById("result-title");
const resultCopy = document.getElementById("result-copy");
const restartButton = document.getElementById("restart-button");
const confettiLayer = document.getElementById("confetti-layer");

let currentQuestionIndex = 0;
let selectedAnswer = null;
let answers = [];
let confettiTimeoutId = null;

function renderQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const progressPercent = (questionNumber / questions.length) * 100;

  questionChip.textContent = `Question ${questionNumber} / ${questions.length}`;
  questionCounter.textContent = `Question ${questionNumber} of ${questions.length}`;
  questionText.textContent = currentQuestion.prompt;
  progressFill.style.width = `${progressPercent}%`;
  nextButton.textContent = questionNumber === questions.length ? "Finish Quiz" : "Next";
  nextButton.disabled = selectedAnswer === null;

  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.type = "button";
    optionButton.className = "option-button";
    optionButton.setAttribute("role", "radio");
    optionButton.setAttribute("aria-checked", "false");

    optionButton.innerHTML = `
      <span>${option}</span>
      <span class="option-indicator" aria-hidden="true"></span>
    `;

    optionButton.addEventListener("click", () => {
      if (currentQuestionIndex === 0 && option === "Arsenal") {
        disqualifyQuiz();
        return;
      }

      selectedAnswer = option;

      [...optionsContainer.children].forEach((button) => {
        button.classList.remove("selected");
        button.setAttribute("aria-checked", "false");
      });

      optionButton.classList.add("selected");
      optionButton.setAttribute("aria-checked", "true");
      nextButton.disabled = false;
    });

    optionsContainer.appendChild(optionButton);
  });
}

function showResults() {
  const score = answers.reduce((total, answer, index) => {
    return total + Number(answer === questions[index].answer);
  }, 0);

  resultTitle.textContent = "Congratulations";
  quizScreen.classList.add("hidden");
  nextButton.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  questionChip.textContent = "Completed";
  progressFill.style.width = "100%";
  resultCopy.textContent = `You got ${score} out of ${questions.length} correct. Congratulations.`;

  if (score === questions.length) {
    launchConfetti();
  }
}

function disqualifyQuiz() {
  clearConfetti();
  resultTitle.textContent = "Disqualified";
  quizScreen.classList.add("hidden");
  nextButton.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  questionChip.textContent = "Disqualified";
  progressFill.style.width = "100%";
  resultCopy.textContent = "you've been disqualified from the quiz, go back to South London";
}

function launchConfetti() {
  clearConfetti();

  const colors = ["#0d6efd", "#ffffff", "#3d3d3d", "#76acff"];
  const pieceCount = 140;

  for (let index = 0; index < pieceCount; index += 1) {
    const piece = document.createElement("span");
    const size = 8 + Math.random() * 10;
    const left = Math.random() * 100;
    const duration = 2200 + Math.random() * 1800;
    const delay = Math.random() * 280;
    const drift = -120 + Math.random() * 240;
    const spin = 360 + Math.random() * 720;

    piece.className = "confetti-piece";
    piece.style.left = `${left}%`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.8}px`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDuration = `${duration}ms`;
    piece.style.animationDelay = `${delay}ms`;
    piece.style.setProperty("--drift", `${drift}px`);
    piece.style.setProperty("--spin", `${spin}deg`);

    confettiLayer.appendChild(piece);
  }

  confettiTimeoutId = window.setTimeout(() => {
    clearConfetti();
  }, 5000);
}

function clearConfetti() {
  if (confettiTimeoutId) {
    window.clearTimeout(confettiTimeoutId);
    confettiTimeoutId = null;
  }

  confettiLayer.innerHTML = "";
}

nextButton.addEventListener("click", () => {
  answers[currentQuestionIndex] = selectedAnswer;

  if (currentQuestionIndex === questions.length - 1) {
    showResults();
    return;
  }

  currentQuestionIndex += 1;
  selectedAnswer = answers[currentQuestionIndex] ?? null;
  renderQuestion();
});

restartButton.addEventListener("click", () => {
  currentQuestionIndex = 0;
  selectedAnswer = null;
  answers = [];
  clearConfetti();

  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  nextButton.classList.remove("hidden");

  renderQuestion();
});

renderQuestion();
