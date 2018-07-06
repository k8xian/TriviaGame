//variables

var roundNum = 0;
var incorrectNum = 0;
var correctNum = 0;
var missedNum = 0;
var timeCounter = 10;
var initialTime = 15;
var answerArray = [];
var shuffledAnswers = [];
var randomAssignment = "";
var correctAnswerString = "";
var randomSlotCorrect;
var countDown;
var totalRounds = 10;
var x;
var val;

//Get questions

var queryURL = "https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple";



//object o functions
var pubQuiz = {

    newGame: function() {
        roundNum = 0;
        incorrectNum = 0;
        correctNum = 0;
        $("#timer").text("time remaining: " + initialTime);
        $('input[name=guess]').attr('checked',false);
        this.questionFill(); 
        val = null;
    },

    resetRound: function(){
        answerArray = [];
        shuffledAnswers = [];
        $("#radio1", "#radio2", "#radio3", "#radio4").text();
        $("#questionText").text();
        $("#resultType").text();
        $("#resultMessage").text();

    },

    pullQuestions: function(){
        $.ajax({
            url: queryURL,
            method: "GET"
                }).then(function(response) {
            console.log(queryURL);
            $("#questionText").html(response.results[0].question);

            // save the correct answer variable
            correctAnswerString = response.results[0].correct_answer;

            //push correct answer string to array
            answerArray.push(correctAnswerString);
            console.table(answerArray);

            //push incorrect answers to array
            console.table(response.results[0].incorrect_answers);

            for (var i=0; i<response.results[0].incorrect_answers.length; i++){
                answerArray.push(response.results[0].incorrect_answers[i]);
            }
            console.table(answerArray);

            pubQuiz.shuffleArray(answerArray);
            console.table(shuffledAnswers);

            $("#radio1").text(shuffledAnswers[0]);
            $("#radio2").text(shuffledAnswers[1]);
            $("#radio3").text(shuffledAnswers[2]);
            $("#radio4").text(shuffledAnswers[3]);

            x = shuffledAnswers.indexOf(correctAnswerString);
            console.log(x + " is the index of " + correctAnswerString);

        // While there remain elements to shuffle…
        });
    },

    shuffleArray: function(array){
        
        var n = array.length, i;
        // While there remain elements to shuffle…
        while (n) {
      
          // Pick a remaining element…
          i = Math.floor(Math.random() * n--);
      
          // And move it to the new array.
          shuffledAnswers.push(array.splice(i, 1)[0]);
        }
        return shuffledAnswers;
    },

    questionFill: function() {
        //reset round
        pubQuiz.resetRound();

        //pull in questions
        pubQuiz.pullQuestions();

        roundNum++;
        timeCounter = initialTime;
        console.log("round number = " + roundNum);
        $("#roundNumber").text("Question #" + roundNum);
        $("#questionView").show();
        $("#resultView").hide();
          
        pubQuiz.timeoutFunction();
    },

    showResult: function() {
        //if statement for win or loss
        $("#questionView").hide();
        $("#resultView").show();
        $("#continueButton").text("Continue");
        //add to the number of rounds that continue
    },

    timeoutFunction: function(){
         //if question times out, this.showResult();
        countDown = setInterval(decrement, 1000);
        function decrement() {
            if (timeCounter > 0) {
                timeCounter--;
              //   console.log(timeCounter);
                $("#timer").text("time remaining: " + timeCounter);
             }
            if (timeCounter === 0) {
                 clearInterval(countDown);
                 pubQuiz.tooLate();
            }
        }
         console.log(countDown);
         console.log(timeCounter);
    },

    stopTimer: function(){
        clearInterval(countDown);
    },

    continueGame: function() {
        $("#continueButton").text("Continue");
    },

    //if you don't answer in time
    tooLate: function(){
        missedNum++;
        pubQuiz.showResult();
        $("#resultType").text("Time's Up!");
        $("#resultMessage").text("Sorry, you did not answer in time");

    },

    // if you got the question right
    correctAnswer: function() {
        correctNum++;
        pubQuiz.showResult();
        $("#resultType").text("Correct!");
        $("#resultMessage").text("You got it right!");
    },

    //if you got the question wrong
    incorrectAnswer: function() {
        incorrectNum++;
        pubQuiz.showResult();
        $("#resultType").text("Incorrect!");
        $("#resultMessage").text("The correct answer is: " + correctAnswerString);
    },

};


pubQuiz.newGame();


//onclick events
$(document).on("click", "#continueButton", function(){

    if (roundNum >= totalRounds) {
        console.log(correctNum);
        console.log(incorrectNum);
        console.log(missedNum);
        pubQuiz.showResult();  
        $("#continueButton").text("New Game").addClass("newGameButton");  

        if (correctNum >= 7) {
            $("#resultType").text("Game Over! You Won!");
            $("#resultMessage").text("You got " + correctNum + " questions correct");
        } else {
            $("#resultType").text("Game Over! You Lose");
            $("#resultMessage").text("You got " + incorrectNum+ " questions wrong");
        }

    } else {
        pubQuiz.questionFill();
    };
    
});

$(document).on("click", ".newGameButton", function(){
    pubQuiz.newGame();
});

$(document).on("click", "#submit", function(event) {
    val = $( "input[type=radio][name=guess]:checked" ).val();
    console.log("val= " + val);
    pubQuiz.stopTimer();
    //incorrect
    if (val == x) {
        pubQuiz.correctAnswer();
    } else {
        pubQuiz.incorrectAnswer();
    }
  });


  //logic for correctly assigning values



//have container timeout unless radio button is selected
    //if container timesout it shows result view and shows timeout message
    //if correct radio button is selected, it shows winning screen
    //if incorrect radio button is selected, it shows correct answer with incorrect title

    //listen for click of button

    //after ten questions, log the question of correct or incorrect answers
    //start a new game when a button is clicked


//write questions to empty container