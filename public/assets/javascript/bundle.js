(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process){
const fs = require('fs')
const path = require('path')

/*
 * Parses a string or buffer into an object
 * @param {(string|Buffer)} src - source to be parsed
 * @returns {Object} keys and values from src
*/
function parse (src) {
  const obj = {}

  // convert Buffers before splitting into lines and processing
  src.toString().split('\n').forEach(function (line) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]

      // default undefined or missing values to empty string
      let value = keyValueArr[2] || ''

      // expand newlines in quoted values
      const len = value ? value.length : 0
      if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
        value = value.replace(/\\n/gm, '\n')
      }

      // remove any surrounding quotes and extra spaces
      value = value.replace(/(^['"]|['"]$)/g, '').trim()

      obj[key] = value
    }
  })

  return obj
}

/*
 * Main entry point into dotenv. Allows configuration before loading .env
 * @param {Object} options - options for parsing .env file
 * @param {string} [options.path=.env] - path to .env file
 * @param {string} [options.encoding=utf8] - encoding of .env file
 * @returns {Object} parsed object or error
*/
function config (options) {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding = 'utf8'

  if (options) {
    if (options.path) {
      dotenvPath = options.path
    }
    if (options.encoding) {
      encoding = options.encoding
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }))

    Object.keys(parsed).forEach(function (key) {
      if (!process.env.hasOwnProperty(key)) {
        process.env[key] = parsed[key]
      }
    })

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

module.exports.config = config
module.exports.load = config
module.exports.parse = parse

}).call(this,require('_process'))
},{"_process":5,"fs":3,"path":4}],2:[function(require,module,exports){
(function (process){
require('dotenv').config()

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
var initialResultPageCountdown = 3;
var totalRounds = 10;
var x;
var val;
//Get questions

var queryURL = "https://opentdb.com/api.php?amount=1&type=multiple";

var giphyURLyay = `https://api.giphy.com/v1/gifs/random?api_key=n6q7sJhuhM8tW1dasOaL7OklQKYULAdw&tag=yay&rating=G`;

var giphyURLsad = `https://api.giphy.com/v1/gifs/random?api_key=n6q7sJhuhM8tW1dasOaL7OklQKYULAdw&tag=sad&rating=G`;



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
                        $("#resultMessage").html("You got " + correctNum + " questions correct and " + incorrectNum + " incorrect. <br> You did not answer " + missedNum + " questions.");
                        pubQuiz.findHappyGif();
                        clearInterval(resultCountDown);
                    } else {
                        $("#resultType").text("Game Over! You Lose");
                        $("#resultMessage").html("You got " + incorrectNum+ " questions incorrect and " + correctNum + " correct. <br> You did not answer " + missedNum + " questions." );
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
            console.log(giphyURLsad);
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
        $("#resultMessage").html("Sorry, you did not answer in time. <br> The correct answer is: " + correctAnswerString);
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
        $("#resultMessage").html("The correct answer is: " + correctAnswerString);
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
}).call(this,require('_process'))
},{"_process":5,"dotenv":1}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":5}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[2]);
