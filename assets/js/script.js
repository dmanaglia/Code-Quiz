//defining the object Score with its parameters
function Score(name, score, time) {
    this.usrName = name;
    this.percent = score;
    this.timeTaken = time;
}
//defining the object Question with its parameters
function Question(question, answers, answer) {
    this.questionString = question;
    this.answerList = answers;
    this.correctAnswer = answer;
}
//defining a constant array list variable that will hold all the questions of the quiz
//making it const so it cannot be changed it can only be referenced
const questionList = [new Question(
    "Commonly used data types DO NOT include:",
    ["1. Strings", "2. Booleans", "3. Alerts", "4. Numbers"],
    "3. Alerts"), new Question(
    "The condition in an if else statement is enclosed within _____.",
    ["1. Quotes", "2. Curly brackets", "3. Parentheses", "4. Square brackets"],
    "3. Parentheses"), new Question(
    "Arrays in JavaScript can be used to store _____.",
    ["1. Numbers and strings", "2. Other arrays", "3. Booleans", "4. All of the above"],
    "4. All of the above"), new Question(
    "String values must be enclosed within _____ when being assinged to variables.",
    ["1. Commas", "2. Curly brackets", "3. Quotes", "4. Parentheses"],
    "3. Quotes"), new Question(
    "A very useful tool during development and debugging for printing content to the debugger is:",
    ["1. JavaScript", "2. Terminal / Bash", "3. for loops", "4. console.log"],
    "4. console.log")];
//want to keep track of all unanswered questions so no questions are repeated
var unansweredQuestionList;
//keeping track of the current question index that will refer to the unansweredQuestionList
//so that once the current question is answered it can be removed from the unanswered list
var questionIndex;
//making the currect question object a global variable since it will be referenced in multiple functions
var currentQuestion;
//global variable that keeps track of the amount of how many correct answeres the user has gotten
var correct;
//will hold the exact time the quiz is started
var timeStarted;
//will hold the exact time it took the user to complete the quiz (finish time - start time)
var totalTime;
//logs the time at which the game was paused when the user presses the view highscores link during the quiz
var timePauseStart;
//records the amount of time the game was paused if the user presses the view highscores link during the quiz
var totalPausedTime;
//the seconds left global variable will constantly be updated in many different function and will update HTML's timer element
var secondsLeft;
//the timer interval needs to be global because it will need to be stoped on different circumstances in different functions
var timerInterval;
//the variable highscores is a string that holds the info on all the scores logged by a given user
//could have used JSON but build the local variable functionality before we coved that in class so I left it as string
var highscores = "";
//a truthy check to see if there is any data already stored in the local variable highschores
//if there is no data it skips to line 62
if(localStorage.getItem("highscores")){
    //if there is data it retrievs the highscores string
    highscores = localStorage.getItem("highscores");
}
//constant variable containing the header element which I gave the id "header" in HTML for clarity
const headerEl = document.querySelector("#header");
//constant variable containing the main section which I gave the id "main" in HTML for clarity
//neither of these elements will be changed so they are const variables, I will just be adding and removing children to them
const mainEl = document.querySelector("#main");
//all these elements are defined globally because I will be referencing and changing them in multiple functions
var viewHighscoresEl = document.createElement("a");
var timerEl = document.createElement("p");
var choice1 = document.createElement("button");
var choice2 = document.createElement("button");
var choice3 = document.createElement("button");
var choice4 = document.createElement("button");
var answerInfoEl = document.createElement("h3");
//webpage starts at the init functions
function init() {
    //when the init function is called from another function, the main element should be cleared
    clearMain();
    //these 4 lines update the header, puts in a link to view highscores on the left with an event listener that will go to the viewHighscores function if clicked
    //appends the empty timer element so it is ready to be updated once the quiz starts
    viewHighscoresEl.textContent = "View Highscores";
    headerEl.appendChild(viewHighscoresEl);
    viewHighscoresEl.addEventListener("click", viewHighscores);
    headerEl.appendChild(timerEl);
    
    //next 9 lines create the elements, add text and append them to the main section on the page
    var welcomeHeader = document.createElement("h1");
    var welcomePara = document.createElement("p");
    var startQuizBtn = document.createElement("button");
    welcomeHeader.textContent = "Coding Quiz Challenge";
    welcomePara.textContent = "Welcome to the Coding Quiz Challenge! Ready to test your coding knowledge? You will have 75 seconds to complete 5 multiple choice questions. If you select the wrong answer 15 seconds will be deducted from your time left so be careful! If you run out of time the remaining questions will be counted as incorrect. If at any point you wish to pause the quiz just click 'View Highscores' in the top left and your current progress will be paused. Final scores are primarily ranked by what percentage of questions you get correct. If you get 100% you can always get a better score by completing the quiz faster! Good Luck!";
    startQuizBtn.textContent = "Start Quiz";
    mainEl.appendChild(welcomeHeader);
    mainEl.appendChild(welcomePara);
    mainEl.appendChild(startQuizBtn);

    //creates a unique id for the startPara since I want to give it different styles from the other paragraph elements created later
    //rather than typing the styles out here they are in the style sheet
    welcomePara.setAttribute("id", "startPara");

    //adds an event listener to the start button that will trigger the startTime function when clicked
    startQuizBtn.addEventListener("click", startTime);
    //last 4 lines are the starting values for these key variables whenever a usr starts the quiz
    //in case the user goes through the quiz more than once this resets them to their proper values each time
    //copies all questions from question list into unanswered question list
    unansweredQuestionList = questionList.slice(0);
    //resets number of correct answers to zero
    correct = 0;
    //resets seconds left to the amound of time user has to complete the quiz, I chose 75
    secondsLeft = 75;
    //resets any paused timed recorded previously to zero
    totalPausedTime = 0;
}
//start time function stores the exact time the quiz is started (Date.now returns exact number of milliseconds since 1970)
function startTime(){
    timeStarted = Date.now();
    //triggers the nextQuestion function which will print a question to the page
    nextQuestion();
}
//the start of the after quiz functionality, if the user runs out of time or if they complete all questions this function is called
function stopTime(){
    //stored the total amound of time taken by the user and converts the number of milliseconds into amount of seconds
    totalTime = ((Date.now() - timeStarted) - totalPausedTime) / 1000;
    //removes any text from the timerEl since that should only be displayed during the quiz
    timerEl.textContent = "";
    //resets questionIndex from what it was last (0) to undefined
    //this way going to the viewHighscores function will work as intended and restarting the quiz will work as intended
    questionIndex = undefined;
    //moves on to the printResult function
    printResult();
}
//function is called if the user clicks "view highscores" during the quiz
//this way their time spent viewing the highscores doesn't count against their time taken on the actual quiz
function pauseTime(){
    timePauseStart = Date.now();
}
//function is called when the user clicks "resume quiz" while viewing the highscores
function resumeTime(){
    //since it is total time paused if the user "pauses" twice it will keep track of the total by adding any previous value to the new amound of totalPausedTime
    totalPausedTime = totalPausedTime + (Date.now() - timePauseStart);
    nextQuestion();
}

function nextQuestion() {
    //first the function clears any elements already in the main section (whether they are elements from init function or previous question elements)
    clearMain();
    //also removes any header elements so there are no duplicates
    clearHeader();
    //the header elements need to be re-created and defined (necessary when this function is called from viewHighscores function)
    viewHighscoresEl.textContent = "View Highscores";
    headerEl.appendChild(viewHighscoresEl);
    viewHighscoresEl.addEventListener("click", viewHighscores);
    headerEl.appendChild(timerEl);
    //if there the global variable questionIndex has not been defined yet it retrievs a random index from the unanswered question list
    //this way the quiz's questions are always changing up so the user can't memorize the order
    //if the global variable has been defined then the user was viewing the highscores and clicked "resume quiz" so the question is reset
    if(questionIndex === undefined) {
        questionIndex = Math.floor(Math.random() * unansweredQuestionList.length);
    }
    //sets the current question to that index
    currentQuestion = unansweredQuestionList[questionIndex];
    //next 2 lines define the local variables containing the question element and the unordered list element
    var questionEl = document.createElement("h1");
    var ulEl = document.createElement("ul");
    
    //sets the text content of the question element to the current question Object's questionString value
    questionEl.textContent = currentQuestion.questionString
    //sets the global variables containing the answer button elements to the answer list values of the current question Object
    choice1.textContent = currentQuestion.answerList[0];
    choice2.textContent = currentQuestion.answerList[1];
    choice3.textContent = currentQuestion.answerList[2];
    choice4.textContent = currentQuestion.answerList[3];

    //appends the question element to the main element first so it is at the top of the main section
    mainEl.appendChild(questionEl);
    //adjusts some unique styling for the question element so it looks good visualy
    questionEl.setAttribute("style", "text-align:left; margin-bottom:0;");
    //next appends the unordered list to the main element
    mainEl.appendChild(ulEl);
    //next 4 lines append the 4 answere buttons to the unordered list element
    ulEl.appendChild(choice1);
    ulEl.appendChild(choice2);
    ulEl.appendChild(choice3);
    ulEl.appendChild(choice4);
    //lastly appends the global variable answerInfoEl so it will appear below the unordered list
    //there is no text in the answerInfoEl until the user selects an answer
    mainEl.appendChild(answerInfoEl);

    //adds event listeners to each answer button that will be triggered on mouse up
    //rather than click or mouse down since the button color is going to change if the answer is right or wrong
    //don't want to give any info away until the user has definently selected that perticular choice
    //if any button is clicked it will call the checkAnswer function 
    choice1.addEventListener("mouseup", checkAnswer);
    choice2.addEventListener("mouseup", checkAnswer);
    choice3.addEventListener("mouseup", checkAnswer);
    choice4.addEventListener("mouseup", checkAnswer);

    //also adds event listeners that act live a :hover psuedo class
    //since the color of the button is going to change to green or red based on if the choice is right or wrong
    //the later change of the background color of the button will override a hover psuedo class so I made them event listeners
    choice1.addEventListener("mouseenter", turnPink);
    choice1.addEventListener("mouseleave", turnPurple);
    choice2.addEventListener("mouseenter", turnPink);
    choice2.addEventListener("mouseleave", turnPurple);
    choice3.addEventListener("mouseenter", turnPink);
    choice3.addEventListener("mouseleave", turnPurple);
    choice4.addEventListener("mouseenter", turnPink);
    choice4.addEventListener("mouseleave", turnPurple);

    //since the timerEl has aleady been appending to the header in the init function this just adds text to show the time left
    timerEl.textContent = secondsLeft + " seconds left";
    //line 210 displays the initial starting time since any code in the anonymous function below will take exactly one iteration to display
    //then it sets the interval to decrement the time left by one every second
    timerInterval = setInterval(function() {
        secondsLeft--;
        //updates the timerEl every iteration to display the number counting down
        timerEl.textContent = secondsLeft + " seconds left";
        //if secondsLeft reaches zero the interval is stopped, an alert pops up informing the user they are out of time and the after quiz functionality is started
        if(secondsLeft === 0){
            clearInterval(timerInterval);
            alert("You ran out of time. Click OK to view your results.")
            stopTime();
        }
    }, 1000); //1000 indicates number of milliseconds in between each iteration (1 second)
}
//simple function meant used by the choice buttons that changes the background color to pink
function turnPink (event){
    event.target.setAttribute("style", "background-color: pink;");
}
//simple function meant used by the choice buttons that changes the background color to purple
function turnPurple (event){
    event.target.setAttribute("style", "background-color: purple;");
}
//function is called if choice button is clicked (specifically on the mouseup)
function checkAnswer(event) {
    //pauses the timerInterval while the answer is being checked and the display is being shown
    //timerInterval will re-initiate if a new question is displayed after current question
    clearInterval(timerInterval);
    //checks to see if the current question's correct answer (previously stored in the question object) matches the text value of the choiced clicked on by user
    if(currentQuestion.correctAnswer === event.target.innerHTML){
        //if the choice matches (was correct) then changes the background color of the event target or button pressed to green
        event.target.setAttribute("style", "background-color:green;");
        answerInfoEl.textContent = "Correct!";
        //also changes the answerInfoEl text to "correct" and makes the text color green
        //the answerInfoEl was already appended in the nextQuestion function underneath the unordered list element 
        //since the answerInfoEl's visibitlity is hidden by default also makes the element visible
        answerInfoEl.setAttribute("style", "visibility:visible; color:green");
        //also increments the correct global variable by one to reflect the user got the question correct
        correct++;
    } else {
        //similar response if the choice selected by the user doesn't match the correct answer, first the button will turn red
        event.target.setAttribute("style", "background-color:red;");
        //sets the answerInfoEl text to Wrong! and sets the text color to red
        answerInfoEl.textContent = "Wrong!";
        answerInfoEl.setAttribute("style", "visibility:visible; color:red");
        //also decreases the amount of time left which is stored in the global variable secondsLeft by 10
        //if there is fifteen seconds or less left then just sets the time left to 0 to avoid displaying a negative number
        if(secondsLeft > 15){
            secondsLeft = secondsLeft - 15;
        } else {
            secondsLeft = 0;
        }
        //and immediately updates the timer element to show the decrease in seconds left
        timerEl.textContent = secondsLeft + " seconds left";
    }
    
    //also it is important to remove all event listeners before the function call the display answer function
    //the next function will essentially pause the quiz for one second in order to display the answerInfoEl and any accomanying change in styling
    //rather than immeadiately move on to the next question and display the answerInfoEl for the first second of the next question I think this looks better
    //because the quiz will be paused it is essential the user cannot click on the answer twice or any other button and break the code
    //easies way is to just remove the event listeners and re-initiate them when the next question is loaded
    viewHighscoresEl.removeEventListener("click", viewHighscores);
    event.target.removeEventListener("mouseleave", turnPurple);
    choice1.removeEventListener("mouseup", checkAnswer);
    choice1.removeEventListener("mouseenter", turnPink);
    choice2.removeEventListener("mouseup", checkAnswer);
    choice2.removeEventListener("mouseenter", turnPink);
    choice3.removeEventListener("mouseup", checkAnswer);
    choice3.removeEventListener("mouseenter", turnPink);
    choice4.removeEventListener("mouseup", checkAnswer);
    choice4.removeEventListener("mouseenter", turnPink);
    //goes on to display the answer for one second
    displayAnswer(event);
}

function displayAnswer(event){
    //this function will pause the quiz in order to display the sying for just one second
    displayCount = 1;
    //creates a new variable that is the interval for the answer display
    var answerInterval = setInterval(function() {
        //it immediately removes any changes in the styling since the code within the an Interval function takes one iteration to execute
        //sets the answerInfoEl visibility back to hidden and changes the button clicked background color back to purple
        answerInfoEl.setAttribute("style", "visibility:hidden;");
        event.target.setAttribute("style", "background-color: purple;");
        displayCount--;
        if(displayCount === 0){
            //stops this current interval
            clearInterval(answerInterval);
            //removes the current question from the unanswered question list
            unansweredQuestionList.splice(questionIndex, 1);
            questionIndex = undefined;
            //checks to see if there are any more unanswered questions AND if the user still has time remaining
            if(unansweredQuestionList[0] && secondsLeft > 0){
                //if so goes back to the nextQuestion function
                nextQuestion();
            } else if (unansweredQuestionList[0] && secondsLeft <= 0) { //secondsLeft really can't be negative because of lines 257-261 but just in case <=
                //if there are more questions but the user has run out of time because of the wrong answer penalty there should be a unique response
                //informs the user that they have ran out of time
                alert("You ran out of time. Click OK to view your results.");
                viewHighscoresEl.addEventListener("click", viewHighscores);
                //then starts the after quiz functionality
                stopTime();
            }
            else{
                //if there are no more questions left then the code moves on to post quiz functionality
                stopTime();
            }
        }
    }, 1000);
}
//quiz is finished by first calling stopTime function which then calls the printResult function
function printResult() {
    //removes any child elements in the main section from the last question
    clearMain();
    // adds event listener to skip to the viewHighscore function if the user doesn't want to log their score
    viewHighscoresEl.addEventListener("click", viewHighscores);
    //declares variable that store the necessary elements for the results display
    var resultHeader = document.createElement("h1");
    var resultScore = document.createElement("p");
    var usrForm = document.createElement("form");
    var inputInfo = document.createElement("p")
    var nameInput = document.createElement("input");
    var submitResult = document.createElement("button");
    
    //adds the appropriate text to the new elements
    resultHeader.textContent = "Quiz finished!";
    resultScore.textContent = "You finished with a score of " + correct + "/" + questionList.length + " in " + totalTime.toFixed(2) + " seconds.";
    inputInfo.textContent = "Enter your name: ";
    submitResult.textContent = "Submit";
    
    //appends the new elements onto the main section
    mainEl.appendChild(resultHeader);
    mainEl.appendChild(resultScore);
    mainEl.appendChild(usrForm)
    //appends these three elements to the form element
    usrForm.appendChild(inputInfo);
    usrForm.appendChild(nameInput);
    usrForm.appendChild(submitResult);

    //creates an event listener for the submit button
    submitResult.addEventListener("click", function(event) {
        //prevents the page from refreshing since the event handler is within a form element
        event.preventDefault(); 
        //makes sure the nameInput doesnt have a colon or semicolon since I uses those to split up the score string in logScore it wouldn't log the score properly
        //I added this before we covered JSON in class and it was easier to leave it
        if(nameInput.value.includes(";") || nameInput.value.includes(":")) {
            alert("Your name cannot include a semicolon ';' or a colon ':'");
        } else {
            //local variable to hold the percentage score of the users quiz
            var percentCorrect = 0; 
            // makes sure the user got at least one question correct if not than percent can remain zero since cant divide by zero
            if(correct > 0) {
                //calculates the percent so that if any questions are added to the questionList it will remain accurate 
                percentCorrect = (correct / questionList.length) * 100;
            }
            //creates a new object Score with the users name they put into the nameInput element, 
            //their calculated percentage score,
            //and the total time taken global variable calculated in the stopTime function
            var usrScore = new Score(nameInput.value, percentCorrect, totalTime);
            //passes the new usrScore object to the logScore function
            logScore(usrScore);
        }
    });
    }
//log score function takes care of formatting and adding the new score to the highscore string and then updating the local storage variable highscores
function logScore(newScore) {
    //each score has 3 values, seperated by colons and each score is seperated by a semicolon 
    //so the long highscore string is easy to split back into its original state
    scoreStr = newScore.usrName + ":" + newScore.percent + ":" + newScore.timeTaken + ";";
    //adds the score string to the global highscore string
    highscores = highscores + scoreStr;
    //updates the local storage variable highscores to the new value of the global highscore string
    localStorage.setItem("highscores", highscores);
    //moves on to the view highscores function
    viewHighscores();
}

function viewHighscores() {
    //in case the view highscores link is pressed during the actual quiz we must stop the interval so it does not continue to run on
    clearInterval(timerInterval);
    if(questionIndex !== undefined){
        //pause time is just its own function for clarity
        pauseTime();
    }
    //clears the main element and the header element since we no longer need the the link to view highscore or timer since we are viewing highscores
    clearHeader();
    clearMain();
    //creates necessary elements and assigns text to them for the scoreboard
    var scoreBoardH1 = document.createElement("h1");
    var goBack = document.createElement("button");
    var clearHighscores = document.createElement("button");
    scoreBoardH1.textContent = "Your Highscores:";
    //if the user was in the middle of the quiz the button text will say resume quiz
    //if not the button will say go to start
    if(questionIndex !== undefined){
        goBack.textContent = "Resume Quiz";
    } else {
        goBack.textContent = "Go to Start"
    }
    clearHighscores.textContent = "Clear Highscores";
    mainEl.appendChild(scoreBoardH1);
    //because I want the scoreboard header to have unique styling I just assigned an ID and did the styling in css
    scoreBoardH1.setAttribute("id", "scoreBoardH1");
    //creates the ordered list element that will be where the highscores go
    var scoreBoardEl = document.createElement("ol");
    //appends the scoreBoardEl to the sheet then sends the element to the print scores function since that is a lot of code I seperated it for some clarity
    mainEl.appendChild(scoreBoardEl);
    printHighscores(scoreBoardEl);
    //after the scores have been added to the scoreboardEl then I add the buttons beneath the scoreBoardEl
    mainEl.appendChild(goBack);
    mainEl.appendChild(clearHighscores);

    //checks to see if the user was in the middle of the quiz and creates an event listener for the go back button accordingly
    if(questionIndex === undefined){
        goBack.addEventListener("click", init);
    } else{
        goBack.addEventListener("click", resumeTime);
    }
    //the event listener for the clear highscores button is pretty simple so I just used an anonymous function
    clearHighscores.addEventListener("click", function() {
        //first checks if there are any highscores to clear, if not then nothing will happen
        if (highscores) {
            //if there are highscores than it confirms with the user if they are sure they want to clear scores
            if (confirm("Are you sure you want to clear all scores?")) {
                //sets the highscore global string to an empty string
                highscores = "";
                //updates the local storage variable highscores to the empty string global variable highscores
                localStorage.setItem("highscores", highscores);
                //clears every child element of the scoreBoard ordered list element
                while(scoreBoardEl.firstChild) {
                    scoreBoardEl.removeChild(scoreBoardEl.firstChild);
                }
            }
        }
    });
}
//function is called anytime viewHighscores function is called, since it is a lot of code I made it a seperate function
function printHighscores(scoreBoardEl) {
    //to prevent any errors just checks to see if the string highscores is actually empty
    //if it is then it skips over this whole function and returns to the viewhighscores function with no new elements added to the scoreboard
    if(highscores){
        //if it is not empty it splits the highscore string first by the semi-colon I added to the end of every score
        var scoreStrArray = highscores.split(";");
        //prepares an empty array that will hold the score objects
        var scoreObjArray = [];
        //again I coded this before we covered JSON in class and it was simpler to just leave it at this point

        //because every score str has a semicolen at the end there will always be an extra element with nothing in it in the score array hence length-1
        for(var i = 0; i < scoreStrArray.length -1; i++){
            //splits each element of the string array by the 2 colons I added seperating the key values
            var temp = (scoreStrArray[i].split(":"));
            //creates the new object based on the values and adds them to the end of the scoreObjArray
            //multiplying the second and third value by 1 to parse it back into an number
            scoreObjArray.push(new Score(temp[0], (temp[1] *1 ), (temp[2] * 1)));
        }
        //creates a new array that will hold the sorted array of objects from best score to worst score
        var scoreArrayOrdered = [];

        //utilizing a while loop since I will not be changing I, rather I am splicing the scoreObjArray so it checks every Obj
        var i = 0;
        while(i < scoreObjArray.length) {
            //variable that will hold the index of the best score found
            var indexOfBest = 0;
            //goes through every item in the object array
            for(var j = 0; j < scoreObjArray.length; j++) {
                //Primarily checks if the percent is greater than the percent of the "indexOfBest" placeholder than the placeholder of the best score is changed
                if(scoreObjArray[j].percent > scoreObjArray[indexOfBest].percent) {
                    indexOfBest = j;
                    //if the values of the percent are equal then it checks if the j index has a lower time than the index of the best
                } else if (scoreObjArray[j].percent === scoreObjArray[indexOfBest].percent && scoreObjArray[j].timeTaken < scoreObjArray[indexOfBest].timeTaken){
                    //if the percents are equally good and the j index has less time taken then it is better and is the new placeholder
                    indexOfBest = j;
                }
            }
            //after checking every value the indexOf best is truly the best score in the ObjArray so it pushs it to the orderedArray
            scoreArrayOrdered.push(scoreObjArray[indexOfBest]);
            //then it splices that index from the Obj array so the rest of the Obj are checked for the remaining best until all are sorted
            scoreObjArray.splice(indexOfBest, 1);
        }
        //lastly the printHighscores function creates as many list elements as there are objects in the sorted score array
        for(var i = 0; i < scoreArrayOrdered.length; i++) {
            var score = document.createElement("li");
            //sets the new list element to a string format of the object
            score.textContent = scoreArrayOrdered[i].usrName + ": " + scoreArrayOrdered[i].percent + "% in " + scoreArrayOrdered[i].timeTaken.toFixed(2) + " seconds";
            //appends the new element
            scoreBoardEl.appendChild(score);
        }
    }
}
//simple function that removes all child elements of the main section
//since it is used many times I made it a function
function clearMain() {
    while(mainEl.firstChild) {
        mainEl.removeChild(mainEl.firstChild);
    }
}
//another simple function removing any child elements of the header section
function clearHeader() {
    while(headerEl.firstChild) {
        headerEl.removeChild(headerEl.firstChild);
    }
}
//when the webpage loads it will always start with the init function
init();