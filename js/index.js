let btnStart = document.getElementById("startQuiz");
let startQuizContainer = document.getElementById("home");
let quizPanel = document.getElementById("quizPanel");
let resultContainer = document.getElementById("resultContainer");

let correctAnswer = document.getElementById("correctAnswer");
let wrongAnswer = document.getElementById("wrongAnswer");
let skipAnswer = document.getElementById("skipAnswer");
let totalQuestion = document.getElementById("totalQuestion");
let resultTotal = document.getElementById("resultTotal");
let allResultTotal = document.getElementById("allResultTotal");

let btnContinue = document.getElementById("btnContinue");

btnContinue.addEventListener("click", function () {
  stopTimer();

  correctAnswer.innerHTML = 0;
  wrongAnswer.innerHTML = 0;
  skipAnswer.innerHTML = 0;
  totalQuestion.innerHTML = 0;

  resultTotal.innerHTML = 0;
  allResultTotal.innerHTML = 0;

  window.location.reload();
});

let correctAnswerCount = 0;
let skippedQuestion = 0;
let wrongAnswerCount = 0;

btnStart.addEventListener("click", startQuiz);

function startQuiz() {
  if (btnStart && startQuizContainer) {
    quizPanel.style.display = "block";
    btnStart.style.display = "none";
    startQuizContainer.style.display = "none";
    displayQuestion();
  }
}

// Global variables to store the timer interval and remaining time
let timerInterval;
let remainingTime;

// Function to start the timer for the current question
function startTimer() {
  remainingTime = 60; // Set initial remaining time to 20 seconds

  // Display initial timer value
  updateTimerDisplay();

  // Start the timer interval
  timerInterval = setInterval(() => {
    remainingTime--;
    updateTimerDisplay();

    // If timer reaches 0, stop the timer and move to the next question
    if (remainingTime === 0) {
      clearInterval(timerInterval);
      skippedQuestion++;
      //alert("Time's up!");
      nextQuestion();
    }
  }, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Function to update the timer display
function updateTimerDisplay() {
  let timerDisplay = document.getElementById("timer");
  if (timerDisplay) {
    timerDisplay.textContent = `${remainingTime}s`;
  }
}

// Shuffle function to randomly shuffle the array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Shuffle the qaData array
const shuffledData = shuffle(qaData);

const maxQuestion = 20;
const selectedQuestion = shuffledData.slice(0, maxQuestion);

// Get reference to the form element
let form = document.getElementById("formData");

// Index to keep track of the current question
let currentIndex = 0;

function renderAnswers(answers) {
  // Shuffle the answers array
  shuffle(answers);

  // Render the shuffled answers in HTML
  let answersHTML = "";
  answers.forEach((answer, index) => {
    answersHTML += `
            <div class="quiz-answer">
                <input type="radio" class="radio-ans-btn" id="radio${
                  index + 1
                }" name="answer" value="${answer}" />
                <label class="radio-label" for="radio${index + 1}">
                    <span class ="radio-inner-circle">${String.fromCharCode(
                      65 + index
                    )}</span>
                    <span class ="divider"></span>
                    <span>${answer}</span>

                </label>
            </div>
        `;
  });

  return answersHTML;
}

// Function to display the current question
function displayQuestion() {
  startTimer(); // Start the timer for the current question

  let data = selectedQuestion[currentIndex];

  let div = document.createElement("div");
  div.className = "quiz-QNA";

  let answersHTML = renderAnswers(data.answers);

  div.innerHTML = `

        <div class ="loader-container" id="loader">
                <div class ="loader-wrapper">
                    <div class ="loader"></div>
                </div>
            </div>

        <div class ="quiz-header">
                <div class ="question-number d-flex align-items-center gap-2">
                    <h3 class ="question-title">Question</h3>
                    <div class="question-counting">
                        <span id="currentNumber">${
                          currentIndex + 1
                        }</span> / <span id="totalNumber">${maxQuestion}</span>
                    </div>
                </div>

                <div class ="question-timer">
                    <h3 class ="timer-icons"><i class ="fa-solid fa-stopwatch fa-lg"></i>
                    </h3>

                    <strong class="timer-counter" id="timer"></strong>
                </div>
            </div>

        <div class="quiz-question">
            <h1>${data.question}</h1>
        </div>

        <div class="quiz-answers">
            ${answersHTML}
        </div>

        <div class="btn-container text-center">
            <button class ="btn-submit" type="button" id="nextButton" onclick="skipQuestion()">Next</button>
        </div>
    `;

  if (form) {
    form.innerHTML = ""; // Clear existing content
    form.appendChild(div);
  }

  let radioButtons = div.querySelectorAll('input[name="answer"]');
  radioButtons.forEach((radio) => {
    radio.addEventListener("click", handleAnswerSelection);
  });
}

// Function to move to the next question
function nextQuestion() {
  stopTimer();

  // Increment the question index or fetch the next question from your data source
  currentIndex++; // Assuming currentIndex is a global variable representing the index of the current question

  if (currentIndex === maxQuestion) {
    quizPanel.style.display = "none";
    resultContainer.style.display = "block";

    correctAnswer.innerHTML = correctAnswerCount;
    wrongAnswer.innerHTML = wrongAnswerCount;
    skipAnswer.innerHTML = skippedQuestion;
    totalQuestion.innerHTML = maxQuestion;

    resultTotal.innerHTML = correctAnswerCount;
    allResultTotal.innerHTML = maxQuestion;

    reloadTimer();

    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  // Check if there are more questions remaining
  if (currentIndex < maxQuestion) {
    // Display the next question
    displayQuestion();
  } else {
    // If all questions have been answered, you can end the quiz or display a completion message
    //alert("Quiz completed!");
  }
}

// Function to handle when the user selects an answer
function handleAnswerSelection() {
  let selectedAnswer = document.querySelector('input[name="answer"]:checked');
  let nextButton = document.getElementById("nextButton");

  if (selectedAnswer) {
    stopTimer();

    nextButton.disabled = true;
    nextButton.style.opacity = "0.4";

    // Get the value of the selected answer
    let selectedValue = selectedAnswer.value.trim();

    // Get the correct answer for the current question
    let correctAnswer = shuffledData[currentIndex].correctAnswer;

    // Disable all answer options
    document.querySelectorAll('input[name="answer"]').forEach((input) => {
      input.disabled = true;
      if (input.value.trim() === selectedValue) {
        // Highlight the selected answer
        if (input.value.trim() === correctAnswer) {
          input.parentElement.style.backgroundColor = "rgb(17 255 160)"; // green
          input.nextElementSibling.innerHTML +=
            '<div class="right-icon"><i class="fa-solid fa-circle-check fa-lg" style="color: #ffffff;"></i></div>';
        } else {
          input.parentElement.style.backgroundColor = "rgb(255 139 152)"; // red
          input.nextElementSibling.innerHTML +=
            '<div class="wrong-icon"><i class="fa-regular fa-circle-xmark fa-lg" style="color: #ffffff;"></i></div>';
        }
      } else if (input.value.trim() === correctAnswer) {
        // Highlight the correct answer
        input.parentElement.style.backgroundColor = "rgb(17 255 160)"; // green
        input.nextElementSibling.innerHTML +=
          '<div class="right-icon"><i class="fa-solid fa-circle-check fa-lg" style="color: #ffffff;"></i></div>';
      }
    });

    // If the selected answer matches the correct answer, notify the user
    if (selectedValue === correctAnswer) {
      correctAnswerCount++;
    } else {
      wrongAnswerCount++;
    }

    // Move to the next question after a delay
    setTimeout(nextQuestion, 2000); // Move to the next question after 2 seconds (adjust as needed)
    setTimeout(showLoader, 1600);
  }
}

function skipQuestion() {
  // Get the selected answer
  let selectedAnswer = document.querySelector('input[name="answer"]:checked');

  // If no answer is selected, proceed to the next question
  if (!selectedAnswer) {
    skippedQuestion++;
    nextQuestion();
  } else {
    // If an answer is selected, handle it
    handleAnswerSelection();
  }
}

function showLoader() {
  document.getElementById("loader").style.display = "block";
  setTimeout(function () {
    document.getElementById("loader").style.display = "none";
  }, 400);
}

let reloadTimeInterval;
let remainTime;

function reloadTimer() {
  remainTime = 10;

  reloadTimeInterval = setInterval(() => {
    remainTime--;
    updateReloadTimer();

    if (remainTime === 0) {
      document.querySelector(".skipTime").innerHTML = "";
      remainTime = "";
      stopReloadTimer();
    }
  }, 1000);
}

function updateReloadTimer() {
  let reloadTimerDiv = document.getElementById("reloadTime");
  if (reloadTimerDiv) {
    reloadTimerDiv.textContent = `${remainTime}s`;
  }
}

function stopReloadTimer() {
  clearInterval(reloadTimeInterval);
}
