# TriviaGame

* By Kate Christian
* k8xian.github.io
* for Northwestern University's Full Stack Flex Coding Bootcamp

## gameplay

* Answer the trivia questions by selecting the radio buttons, they are generated through the Open Trivia Database API
* If you lose, you will see the correct answer, and regardless, a gif celebrating or mocking your result will appear
    * this GIF is also pulled in from the Giphy API
* After ten rounds you will be informed whether you won or lost the game based on whether you achieved at least 7 correct answers

## development

* The assignment called for hard-coded questions and fixed gifs, this usees an API for both. 
* There is some goofiness with the API that is pulling in info, most of the questions have only four results, but there is no way to filter for questions, I'm still looking into workarounds for this

## other info

I am the sole maintainer of this code.


## credits
* Trivia Questions
    * Open Trivia Database https://opentdb.com/

* Background Image
    *  https://pixabay.com/en/ireland-pub-dublin-irish-irish-pub-2345992/

* Gifs
    * giphy.com


*Original assignment below:

####### Instructions ########
# JavaScript Assignment 2


* Please submit both the deployed Github.io link to your homework AND the link to the Github Repository!

### Before You Begin

1. Create a GitHub repo called `TriviaGame`, then clone the repo to your computer.

2. Create a file inside of the `TriviaGame` folder called `index.html`. This is where you'll mark up all of your HTML.
3. Don't forget to include a script tag with the jQuery library.

4. Create a folder inside of the `TriviaGame` folder called `assets`.
5. Inside `assets`, create three folders: `css`, `javascript`, `images`

   * In your `css` folder, create a `style.css` file.
   * In your `javascript` folder, create an `app.js` file; here you'll write all of your JavaScript and jQuery.
   * In your `images` folder, save whatever images you'd like to use in this exercise.

6. Choose a game to build from your options below. 

### Option Two: Advanced Assignment (Timed Questions)

![Advanced](Images/2-advanced.jpg)

**[Click Here to Watch the demo](advanced-trivia-demo.mov)**.

* You'll create a trivia game that shows only one question until the player answers it or their time runs out.

* If the player selects the correct answer, show a screen congratulating them for choosing the right option. After a few seconds, display the next question -- do this without user input.

* The scenario is similar for wrong answers and time-outs.

  * If the player runs out of time, tell the player that time's up and display the correct answer. Wait a few seconds, then show the next question.
  * If the player chooses the wrong answer, tell the player they selected the wrong option and then display the correct answer. Wait a few seconds, then show the next question.

* On the final screen, show the number of correct answers, incorrect answers, and an option to restart the game (without reloading the page).

### Reminder: Submission on BCS

* Please submit both the deployed Github.io link to your homework AND the link to the Github Repository!

- - -

### Minimum Requirements

Attempt to complete homework assignment as described in instructions. If unable to complete certain portions, please pseudocode these portions to describe what remains to be completed. Adding a README.md as well as adding this homework to your portfolio are required as well and more information can be found below.

- - -

### Create a README.md

Add a `README.md` to your repository describing the project. Here are some resources for creating your `README.md`. Here are some resources to help you along the way:

* [About READMEs](https://help.github.com/articles/about-readmes/)

* [Mastering Markdown](https://guides.github.com/features/mastering-markdown/)

- - -

### Add To Your Portfolio

After completing the homework please add the piece to your portfolio. Make sure to add a link to your updated portfolio in the comments section of your homework so the TAs can easily ensure you completed this step when they are grading the assignment. To receive an 'A' on any assignment, you must link to it from your portfolio.

- - -

### A Few Last Notes

* Styling and theme are completely up to you. Get creative!

* Remember to deploy your assignment to Github Pages.

*If you have any questions about this project or the material we have covered, please post them in the community channels in slack so that your fellow developers can help you! If you're still having trouble, you can come to office hours for assistance from your instructor and TAs.

  **Good Luck!**
