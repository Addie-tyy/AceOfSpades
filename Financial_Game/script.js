let currentLevel = "easy";
let currentQuestionIndex = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const explanationEl = document.getElementById("explanation");
const levelEl = document.getElementById("level");
const scoreEl = document.getElementById("score");

function loadQuestion() {
  const questionData = questions[currentLevel][currentQuestionIndex];
  questionEl.textContent = questionData.question;
  optionsEl.innerHTML = "";
  explanationEl.style.display = "none";
  nextBtn.disabled = true;

  questionData.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => selectAnswer(index, questionData.answer);
    optionsEl.appendChild(button);
  });
}

function selectAnswer(selected, correct) {
  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach((button, index) => {
    if (index === correct) button.classList.add("correct");
    if (index === selected && selected !== correct) button.classList.add("wrong");
  });

  explanationEl.textContent =
    selected === correct
      ? "Correct! " + questions[currentLevel][currentQuestionIndex].explanation
      : "Wrong! " + questions[currentLevel][currentQuestionIndex].explanation;

  explanationEl.style.display = "block";
  nextBtn.disabled = false;

  if (selected === correct) score += 10;
  scoreEl.textContent = `Score: ${score}`;
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions[currentLevel].length) {
    if (currentLevel === "easy") {
      currentLevel = "medium";
    } else if (currentLevel === "medium") {
      currentLevel = "hard";
    } else {
      alert("Congratulations! You completed all levels.");
      return;
    }
    currentQuestionIndex = 0;
    levelEl.textContent = `Level: ${
      currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)
    }`;
  }
  loadQuestion();
}

nextBtn.addEventListener("click", nextQuestion);

loadQuestion();
