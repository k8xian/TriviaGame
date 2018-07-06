//variables

var roundNum = 0;
var incorrectNum = 0;
var correctNum = 0;
var missedNum = 0;
var timeCounter = 10;
var resultTimeCounter = 4;
var initialTime = 15;
var answerArray = [];
var shuffledAnswers = [];
var randomAssignment = "";
var correctAnswerString = "";
var randomSlotCorrect;
var countDown;
var resultCountDown;
var resultPageCountdown;
var initialResultPageCountdown = 4;
var totalRounds = 10;
var x;
var val;

//Get questions

var queryURL = "https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple";

var giphyURLyay = "https://api.giphy.com/v1/gifs/random?api_key=n6q7sJhuhM8tW1dasOaL7OklQKYULAdw&tag=yay&rating=G"

var giphyURLsad = "https://api.giphy.com/v1/gifs/random?api_key=n6q7sJhuhM8tW1dasOaL7OklQKYULAdw&tag=sad&rating=G";



//object o functions
var pubQuiz = {

    newGame: function() {
        roundNum = 0;
        incorrectNum = 0;
        correctNum = 0;
        $("#timer").text("time remaining: " + initialTime);
        $("#continueButton").hide();  

        this.questionFill(); 
        this.resetRound();
        val = null;
    },

    resetRound: function(){
        answerArray = [];
        shuffledAnswers = [];
        $("#radio1", "#radio2", "#radio3", "#radio4").text();
        $("#questionText").text();
        $("#resultType").text();
        $("#resultMessage").text();
        $("#randomGif").html();
        $('input[name=guess]').attr('checked',false);

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

            $("#radio1").html(shuffledAnswers[0]);
            $("#radio2").html(shuffledAnswers[1]);
            $("#radio3").html(shuffledAnswers[2]);
            $("#radio4").html(shuffledAnswers[3]);

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
        resultTimeCounter = initialResultPageCountdown;
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
        // $("#continueButton").text("Continue");
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

    resultTimeoutFunction: function(){
        resultCountDown = setInterval(decrement, 1000);

        function decrement() {
            if (resultTimeCounter > 0) {
                resultTimeCounter--;
                console.log(resultTimeCounter);
             }

             if (resultTimeCounter == 0) {

                if (roundNum >= totalRounds) {
                    console.log(correctNum);
                    console.log(incorrectNum);
                    console.log(missedNum);
                    pubQuiz.showResult();  
                    $("#continueButton").text("New Game").addClass("newGameButton").show();  

                    if (correctNum >= 7) {
                        $("#resultType").text("Game Over! You Won!");
                        $("#resultMessage").text("You got " + correctNum + " questions correct and " + incorrectNum + " incorrect.");
                        pubQuiz.findHappyGif();
                        clearInterval(resultCountDown);
                    } else {
                        $("#resultType").text("Game Over! You Lose");
                        $("#resultMessage").text("You got " + incorrectNum+ " questions incorrect and " + correctNum + " correct.");
                        pubQuiz.findSadGif();
                        clearInterval(resultCountDown);
                    }

                } else {
                    pubQuiz.questionFill();
                    clearInterval(resultCountDown);
                }
            };
        };
    },

    stopTimer: function(){
        clearInterval(countDown);
    },

    continueGame: function() {
        // $("#continueButton").text("Continue");
    },

    findSadGif: function(){
        $.ajax({
            url: giphyURLsad,
            method: "GET"
                }).then(function(response) {
            console.log(giphyURLboo);
            var selectedGif = "https://media.giphy.com/media/" + response.data.id + "/giphy.gif";
            console.log(selectedGif);
            $("#randomGif").html('<img src="'+ selectedGif +'" width="100%"/>');

        });
    },

    findHappyGif: function(){
        $.ajax({
            url: giphyURLyay,
            method: "GET"
                }).then(function(response) {
            console.log(giphyURLyay);
            var selectedGif = "https://media.giphy.com/media/" + response.data.id + "/giphy.gif";
            console.log(selectedGif);
            $("#randomGif").html('<img src="'+ selectedGif +'" width="100%"/>');
        });
    },

    //if you don't answer in time
    tooLate: function(){
        missedNum++;
        pubQuiz.showResult();
        $("#resultType").text("Time's Up!");
        $("#resultMessage").text("Sorry, you did not answer in time");
        pubQuiz.findSadGif();
        pubQuiz.resultTimeoutFunction();

    },

    // if you got the question right
    correctAnswer: function() {
        correctNum++;
        pubQuiz.showResult();
        $("#resultType").text("Correct!");
        $("#resultMessage").text("You got it right!");
        pubQuiz.findHappyGif();
        pubQuiz.resultTimeoutFunction();
    },

    //if you got the question wrong
    incorrectAnswer: function() {
        incorrectNum++;
        pubQuiz.showResult();
        $("#resultType").text("Incorrect!");
        $("#resultMessage").text("The correct answer is: " + correctAnswerString);
        pubQuiz.findSadGif();
        pubQuiz.resultTimeoutFunction();
    },

};


pubQuiz.newGame();


//onclick events
// $(document).on("click", "#continueButton", function(){

//     if (roundNum >= totalRounds) {
//         console.log(correctNum);
//         console.log(incorrectNum);
//         console.log(missedNum);
//         pubQuiz.showResult();  
//         $("#continueButton").text("New Game").addClass("newGameButton");  

//         if (correctNum >= 7) {
//             $("#resultType").text("Game Over! You Won!");
//             $("#resultMessage").text("You got " + correctNum + " questions correct");
//             pubQuiz.findHappyGif();
//         } else {
//             $("#resultType").text("Game Over! You Lose");
//             $("#resultMessage").text("You got " + incorrectNum+ " questions wrong");
//             pubQuiz.findSadGif();
//         }

//     } else {
//         pubQuiz.questionFill();
//     };
    
// });

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


//have container timeout unless radio button is selected
    //if container timesout it shows result view and shows timeout message
    //if correct radio button is selected, it shows winning screen
    //if incorrect radio button is selected, it shows correct answer with incorrect title

    //listen for click of button

    //after ten questions, log the question of correct or incorrect answers
    //start a new game when a button is clicked


//write questions to empty container