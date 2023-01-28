function Score(name, score, time) {
    this.usrName = name;
    this.percent = score;
    this.timeTaken = time;
}
function Question(question, answers, answer) {
    this.questionString = question;
    this.answerList = answers;
    this.correctAnswer = answer;
}
const questionList = [];
questionList.push(new Question(
    "Commonly used data types DO NOT include:",
    ["1. Strings", "2. Booleans", "3. Alerts", "4. Numbers"],
    "3. Alerts"));
questionList.push(new Question(
    "The condition in an if else statement is enclosed within _____.",
    ["1. Quotes", "2. Curly brackets", "3. Parentheses", "4. Square brackets"],
    "2. Curly brackets"));
questionList.push(new Question(
    "Arrays in JavaScript can be used to store _____.",
    ["1. Numbers and strings", "2. Other arrays", "3. Booleans", "4. All of the above"],
    "4. All of the above"));
questionList.push(new Question(
    "String values must be enclosed within _____ when being assinged to variables.",
    ["1. Commas", "2. Curly brackets", "3. Quotes", "4. Parentheses"],
    "3. Quotes"));
questionList.push(new Question(
    "A very useful tool during development and debugging for printing content to the debugger is:",
    ["1. JavaScript", "2. Terminal / Bash", "3. for loops", "4. console.log"],
    "4. console.log"));

var unansweredQuestionList = null;
var currentQuestionIndex = null;
var currentQuestion = null;

var correct = 0;
var timeStarted = 0;
var totalTime = 0;
var highscores = "";
if(localStorage.getItem("highscores") !== ""){
    highscores = localStorage.getItem("highscores");
}

const mainEl = document.querySelector("#main");
const headerEl = document.querySelector("#header");
var timerEl;

function goToStart() {
    clearMain();
    var viewHighscoresEl = document.createElement("a");
    viewHighscoresEl.textContent = "View Highscores";
    headerEl.appendChild(viewHighscoresEl);
    viewHighscoresEl.addEventListener("click", viewHighscores);
    timerEl = document.createElement("p");
    headerEl.appendChild(timerEl);
    
    var welcomeHeader = document.createElement("h1");
    var welcomePara = document.createElement("p");
    var startQuizBtn = document.createElement("button");

    welcomeHeader.textContent = "Coding Quiz Challenge";
    welcomePara.textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae fugiat commodi quia porro provident ratione vitae accusamus tenetur nisi, obcaecati esse! Aperiam ducimus magni veniam reprehenderit voluptates doloribus doloremque iusto.";
    startQuizBtn.textContent = "Strart Quiz";

    mainEl.appendChild(welcomeHeader);
    mainEl.appendChild(welcomePara);
    mainEl.appendChild(startQuizBtn);

    startQuizBtn.addEventListener("click", startTime);
    unansweredQuestionList = questionList.slice(0);
    correct = 0;
}

function startTime(){
    timeStarted = Date.now();
    nextQuestion();
}

function stopTime(){
    totalTime = (Date.now() - timeStarted) / 1000;
    timerEl.textContent = "";
    printResult();
}

var timerInterval;
var secondsLeft;

function nextQuestion() {
    clearMain();
    currentQuestionIndex = Math.floor(Math.random() * unansweredQuestionList.length);
    currentQuestion = unansweredQuestionList[currentQuestionIndex];
    var questionEl = document.createElement("h1");
    var ulEl = document.createElement("ul");
    var choice1 = document.createElement("button");
    var choice2 = document.createElement("button");
    var choice3 = document.createElement("button");
    var choice4 = document.createElement("button");
 
    questionEl.textContent = currentQuestion.questionString
    choice1.textContent = currentQuestion.answerList[0];
    choice2.textContent = currentQuestion.answerList[1];
    choice3.textContent = currentQuestion.answerList[2];
    choice4.textContent = currentQuestion.answerList[3];

    mainEl.appendChild(questionEl);
    mainEl.appendChild(ulEl);
    ulEl.appendChild(choice1);
    ulEl.appendChild(choice2);
    ulEl.appendChild(choice3);
    ulEl.appendChild(choice4);

    choice1.addEventListener("click", checkanswer);
    choice2.addEventListener("click", checkanswer);
    choice3.addEventListener("click", checkanswer);
    choice4.addEventListener("click", checkanswer);

    secondsLeft = 15;
    timerEl.textContent = secondsLeft + " seconds left";
    timerInterval = setInterval(function() {
        secondsLeft--;
        timerEl.textContent = secondsLeft + " seconds left";
        if(secondsLeft === 0){
            clearInterval(timerInterval);
            alert("You ran out of time! Moving on to the next question...");
            unansweredQuestionList.splice(currentQuestionIndex, 1);
            if(unansweredQuestionList[0]){
                nextQuestion();
            } else{
                stopTime();
            }
        }
    }, 1000);
}

function checkanswer(event) {
    clearInterval(timerInterval);
    if(currentQuestion.correctAnswer === event.target.innerHTML){
        correct++;
    } else {
        //manipulate DOM to display //false
    }
    unansweredQuestionList.splice(currentQuestionIndex, 1);
    if(unansweredQuestionList[0]){
        nextQuestion();
    } else{
        stopTime();
    }
}

function printResult() {
    clearMain();
    
    var resultHeader = document.createElement("h1");
    var resultScore = document.createElement("p");
    var usrForm = document.createElement("form");
    var inputInfo = document.createElement("p")
    var nameInput = document.createElement("input");
    var submitResult = document.createElement("button");
    

    resultHeader.textContent = "Quiz finished!";
    resultScore.textContent = "You finished with a score of " + correct + "/5 in " + totalTime + " seconds.";
    inputInfo.textContent = "Enter your name: ";
    submitResult.textContent = "Submit";
    
    mainEl.appendChild(resultHeader);
    mainEl.appendChild(resultScore);
    mainEl.appendChild(usrForm)
    usrForm.appendChild(inputInfo);
    usrForm.appendChild(nameInput);
    usrForm.appendChild(submitResult);

    submitResult.addEventListener("click", function(event) {
        event.preventDefault();
        var percentCorrect = 0;
        if(correct > 0) {
            percentCorrect = (correct / 5) * 100;
        }

        var usrScore = new Score(nameInput.value, percentCorrect, totalTime);
        logScore(usrScore);
    });
    }

function logScore(newScore) {
    scoreStr = newScore.usrName + " " + newScore.percent + "% " + newScore.timeTaken + " seconds,"
    highscores = highscores + scoreStr;
    localStorage.setItem("highscores", highscores);
    viewHighscores();
}

function viewHighscores() {
    clearInterval(timerInterval);
    clearHeader();
    clearMain();
    var scoreBoardH1 = document.createElement("h1");
    var goBack = document.createElement("button");
    var clearHighscores = document.createElement("button");
    scoreBoardH1.textContent = "Highscores:";
    goBack.textContent = "Go Back";
    clearHighscores.textContent = "Clear Highscores";
    mainEl.appendChild(scoreBoardH1);
    printHighscores();
    mainEl.appendChild(goBack);
    mainEl.appendChild(clearHighscores);

    goBack.addEventListener("click", goToStart);
    clearHighscores.addEventListener("click", function() {
        highscores = "";
        localStorage.setItem("highscores", highscores);
        viewHighscores();
    });
}

function printHighscores() {
    var scoreBoard = document.createElement("ol");
    mainEl.appendChild(scoreBoard);

    var scoreArray = highscores.split(",");

    //because every score str has a comma at the end there will always be an extra element with nothing in it in the score array hence length-1
    for(var i = 0; i < scoreArray.length - 1; i++) {
        var score = document.createElement("li");
        score.textContent = scoreArray[i];
        scoreBoard.appendChild(score);
    }
}

function clearMain() {
    while(mainEl.firstChild) {
        mainEl.removeChild(mainEl.firstChild)
    }
}

function clearHeader() {
    while(headerEl.firstChild) {
        headerEl.removeChild(headerEl.firstChild)
    }
}


goToStart();

