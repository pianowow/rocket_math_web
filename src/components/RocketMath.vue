<script setup >
  import { onMounted, ref } from 'vue'
/**
 *   Rocket Math by Chris Irwin and Olivia Irwin
 *   Displays arithmetic problems for 2nd and 3rd grade math
 *
 */

/**
 * Game state object
 */
let gameState = ref({
    score: 0,
    currentAnswer: 0,
    hints: []
});
let questionText = ref('');
let operator = ref('m');
let answerInput = ref('');
let hintText = ref('');

/**
 * Generates a new math problem.
 * @param {string} operation - The type of operation: 'a' (add), 's' (subtract), 'm' (multiply), 'd' (divide).
 * @returns {Array} An array containing [number1, operator, number2, answer].
 */
function new_question(operation) {
    let num1, num2, operator, answer;
    switch (operation) {
        case 's': // Subtraction: num1 - num2 = answer
            operator = '-';
            num2 = Math.floor(Math.random() * 9) + 1; // number to subtract
            answer = Math.floor(Math.random() * 9) + 1; // the answer
            num1 = num2 + answer; // The starting number, ensuring no negative results
            break;
        case 'a': // Addition: num1 + num2 = answer
            operator = '+';
            num1 = Math.floor(Math.random() * 12) + 1;
            num2 = Math.floor(Math.random() * 12) + 1;
            answer = num1 + num2;
            break;
        case 'm': // Multiplication: num1 * num2 = answer
            operator = 'x';
            num1 = Math.floor(Math.random() * 11) + 2;
            num2 = Math.floor(Math.random() * 11) + 2;
            answer = num1 * num2;
            break;
        case 'd': // Division: num1 / num2 = answer
            operator = '÷';
            num2 = Math.floor(Math.random() * 11) + 2; // the divisor
            answer = Math.floor(Math.random() * 11) + 2; // the answer
            num1 = num2 * answer; // The dividend, ensuring a whole number result
            break;
        default:
            throw new Error(`Invalid operation specified: ${operation}`);
    }
    return {num1, operator, num2, answer};
}


/**
 * Creates a new question and displays it in the question div.
 */
function display_new_question() {
    const problem = new_question(operator.value);
    gameState.value.currentAnswer = problem.answer;
    create_hint();
    questionText.value = `${problem.num1} ${problem.operator} ${problem.num2} = ?`;
    answerInput.value = '';
}

/**
 * Checks the user's submitted answer.
 */
function check_answer() {
    const userAnswer = parseInt(answerInput.value, 10);
    if (userAnswer === gameState.value.currentAnswer) {
        // Correct! Increment score.
        if (hintText.value) {
           gameState.value.score++;
        } else {
           gameState.value.score += 5;
        }
        // Load the next question immediately.
        display_new_question();
    } else {
        // Incorrect. You could add feedback here, like shaking the box.
        console.log(`Incorrect. You answered ${userAnswer}, but the answer was ${gameState.value.currentAnswer}`);
        // After the shake, load the next question.
        shakeElement('answer_input', display_new_question);
    }
    hintText.value = '';
}

/**
 * Shakes a DOM element to provide visual feedback, e.g., for an incorrect answer.
 * @param {string} elementId - The ID of the element to shake (without the #).
 * @param {function} [onComplete] - Optional callback to run after the animation.
 */
function shakeElement(elementId, onComplete) {
    const element = document.getElementById(`${elementId}`);
    const originalColor = element.style.backgroundColor;
    element.style.backgroundColor = "red";
    element.classList.add('shake-active');
    setTimeout(() => {
      element.classList.remove('shake-active');
      element.style.backgroundColor = originalColor ;
    }, 300); // Match the animation duration
    if (onComplete) {
         onComplete();
    }
}


function create_hint() {
   // first get the answer
   const rightAnswer = gameState.value.currentAnswer;
   // then make four random wrong answers
   let wrongAnswers = [];
   while (wrongAnswers.length < 4) {
      let candidate = Math.floor(Math.random() * 144) + 1;
      if (candidate != rightAnswer && !wrongAnswers.includes(candidate)) {
         wrongAnswers.push(candidate);
      }
   }
   // then mix them all together randomly
   let hints = wrongAnswers;
   hints.push(rightAnswer);
   hints.sort(() => Math.random() - 0.5);
   gameState.value.hints = hints;
}

function illuminate_hint() {
   // show all of the possible answers
   hintText.value = 'Possible answers: ' + gameState.value.hints.join(', ');
}

onMounted( () => {
    display_new_question();
});

</script>

<template>
    <body>
    <div class="wrapper">
        <img class="rocket-top" src="/images/rocket_top.png"/>
        <header class="header">
            <h1>Rocket Math</h1>
            <p>By Olivia Irwin and her dad, Chris Irwin</p>
        </header>
        <main>
            <section class="question">
               <div id="question_div">
                 <div id="question_text">{{ questionText }}</div>
                  <div class="operator_div">
                      <select id="operator_select" v-model='operator' @change='display_new_question'>
                          <option value="a">+</option>
                          <option value="s">-</option>
                          <option value="m" selected>x</option>
                          <option value="d">÷</option>
                      </select>
                  </div>
                </div>
            </section>
            <section class="hint">
              <div id="hint_text">{{ hintText }}</div>
            </section>
            <section class="answer">
                <label for="answer_input" class="visually-hidden">Your Answer</label>
                <input v-model="answerInput" type="text" id="answer_input" placeholder="Answer"
                @keyup.enter = "check_answer">
                <input type="button" id="submit_button" value="Submit" @click='check_answer'>
               <div id="hint">
                  <button class="button" id="hint_button" @click = "illuminate_hint">
                     <svg height="50px" width="50px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                         viewBox="0 0 279.682 279.682" xml:space="preserve">
                        <g>
                        <path style="fill:currentColor" d="M143.25,55.486c-41.06,0-74.465,33.405-74.465,74.465c0,16.824,5.511,32.711,15.938,45.939
                           c1.998,2.536,4.15,5.033,6.23,7.448c6.212,7.208,12.078,14.017,14.166,21.675c0.045,0.165,0.438,1.773,0.38,7.247l-0.01,0.791
                           c-0.063,4.444-0.147,10.528,4.352,15.091c3.081,3.125,7.399,4.645,13.204,4.645h40.272c6.268,0,10.774-1.534,13.776-4.689
                           c4.061-4.267,3.789-9.779,3.608-13.427c-0.032-0.645-0.066-1.296-0.074-1.944c-0.065-5.48,0.345-7.025,0.362-7.09
                           c2.121-7.657,8.993-15.732,15.057-22.855c2.023-2.377,3.934-4.622,5.714-6.879c10.431-13.23,15.944-29.12,15.944-45.951
                           C217.705,88.892,184.305,55.486,143.25,55.486z M189.982,166.614c-1.607,2.036-3.429,4.178-5.358,6.445
                           c-7.07,8.307-15.084,17.722-18.089,28.572c-0.429,1.546-0.988,4.395-0.905,11.273c0.01,0.835,0.049,1.675,0.091,2.507
                           c0.032,0.657,0.075,1.523,0.071,2.209c-0.528,0.086-1.325,0.166-2.475,0.166h-40.272c-1.276,0-2.022-0.135-2.405-0.237
                           c-0.198-0.977-0.17-3.007-0.152-4.287l0.012-0.844c0.072-6.919-0.483-9.789-0.907-11.348c-2.98-10.936-10.575-19.749-17.275-27.524
                           c-2.066-2.398-4.019-4.664-5.813-6.942c-8.32-10.557-12.718-23.232-12.718-36.654c0-32.789,26.676-59.465,59.465-59.465
                           c32.783,0,59.455,26.676,59.455,59.465C202.705,143.379,198.306,156.058,189.982,166.614z"/>
                        <path style="fill:currentColor" d="M161.766,239.564h-37.041c-7.995,0-14.5,6.505-14.5,14.5v11.117c0,7.995,6.505,14.5,14.5,14.5
                           h37.041c7.995,0,14.5-6.505,14.5-14.5v-11.117C176.266,246.069,169.761,239.564,161.766,239.564z M161.266,264.682h-36.041v-10.117
                           h36.041V264.682z"/>
                        <path style="fill:currentColor" d="M143.245,45.779c4.143,0,7.5-3.357,7.5-7.5V7.5c0-4.143-3.357-7.5-7.5-7.5
                           c-4.143,0-7.5,3.357-7.5,7.5v30.779C135.745,42.422,139.103,45.779,143.245,45.779z"/>
                        <path style="fill:currentColor" d="M241.917,34.598c-2.858-2.995-7.606-3.106-10.604-0.248l-22.77,21.73
                           c-2.997,2.859-3.107,7.607-0.248,10.604c1.474,1.544,3.448,2.322,5.427,2.322c1.86,0,3.725-0.688,5.177-2.074l22.77-21.731
                           C244.666,42.342,244.776,37.594,241.917,34.598z"/>
                        <path style="fill:currentColor" d="M264.273,109.599c-0.004,0-0.008,0-0.012,0l-29.311,0.047c-4.143,0.007-7.495,3.37-7.488,7.512
                           c0.007,4.139,3.363,7.488,7.5,7.488c0.004,0,0.008,0,0.012,0l29.311-0.047c4.143-0.007,7.495-3.37,7.488-7.512
                           C271.767,112.948,268.41,109.599,264.273,109.599z"/>
                        <path style="fill:currentColor" d="M74.386,64.684c2.859-2.996,2.749-7.743-0.248-10.604l-22.77-21.73
                           c-2.994-2.858-7.742-2.749-10.604,0.248c-2.859,2.996-2.749,7.743,0.248,10.604l22.77,21.731c1.452,1.386,3.315,2.074,5.177,2.074
                           C70.937,67.006,72.912,66.228,74.386,64.684z"/>
                        <path style="fill:currentColor" d="M44.729,109.646l-29.31-0.047c-0.004,0-0.008,0-0.012,0c-4.137,0-7.493,3.351-7.5,7.488
                           c-0.007,4.142,3.346,7.505,7.488,7.512l29.31,0.047c0.004,0,0.008,0,0.012,0c4.137,0,7.493-3.351,7.5-7.488
                           C52.225,113.016,48.872,109.652,44.729,109.646z"/>
                        </g>
                     </svg>
                  </button>
               </div>
            </section>
            <div class="score">Score: <span id="score_text">{{ gameState.score }}</span></div>
        </main>
        <img src="/images/rocket_bottom.png" class="rocket-bottom"/>
    </div>
    </body>
</template>

<style scoped>
/* CSS HEX
--mauve: #efabffff;
--tan: #FFFFAB;
--purple: #775080;
*/
/* General Body Styles */

body {
  font-family: "Delius", cursive;
  font-weight: 400;
  font-style: normal;
    background-color: #efabffff;
    color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}

/* Wrapper for the main content */
.wrapper {
    position: relative;
    background-color: #FFFFAB;
    padding: 30px 40px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    text-align: center;
}

.rocket-top {
  width: 500px;
  position: absolute;
  top: -179px;
  left: 45px;
  opacity: 0.5;
}

.rocket-bottom {
  width: 500px;
  position: absolute;
  top: 420px;
  left: 45px;
  opacity: 0.5;
}

/* Header */
.header h1 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 2.5em;
}

.header p {
    font-size: 1.2em;
    margin: -10px 0 20px;
}

/* Section spacing */
.question, .answer, .score {
    margin-bottom: 20px;
}

.question {
   display: flex;
   justify-content: center;
}

#question_div {
    position: relative;
    width: 464px;
    padding: 15px;
    background-color: #fff;
    border: 3px solid #775080;
    border-radius: 8px;
    min-height: 50px; /* Ensure consistent height */
    display: flex;
    justify-content: center;
    align-items: center;
}

#question_text {
    font-size: 2.2em;
    font-weight: bold;
    justify-content: center;
    align-items: center;

}

.operator_div {
    position: absolute;
    right: 5px;
    bottom: 5px;
}

#hint_text{
   height: 20px;
   margin-bottom: 10px;
}

#hint_button {
   padding: 0px;
   color: #775080;
   background-color: #FFFFAB;
   cursor: pointer;
}

/* Answer section */
.answer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

#answer_input {
    padding: 10px;
    font-size: 1.2em;
    border: 3px solid #775080;
    border-radius: 6px;
    transition: border-color 0.3s;
    text-align: center;
    background-color: #fff;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}

.button {
    padding: 10px;
    border: none;
    font-size: 1.2em;
    transition: border-color 0.3s;
    text-align: center;
    background-color: #fff;
    color: #FFFFAB;
    cursor: pointer;

}

#answer_input:focus {
    outline: none;
    border-color: #efabffff;
}

#submit_button {
    padding: 10px 20px;
    font-size: 1.2em;
    background-color: #fff;
    border: 3px solid #775080;
    border-radius: 6px;
    transition: background-color 0.3s;
    cursor: pointer;
}

#submit_button:hover {
    background-color: #efabffff;
}

/* Score */
.score {
    font-size: 1.2em;
    font-weight: 500;
}

#score_text {
    font-weight: bold;
}

/* Options section */
#operator_select {
    padding: 7px;
    border-radius: 5px;
    border: 3px solid #EF6F6C;
    font-size: 1em;
    border-color: #EF6F6C;
    background-color: #fff;
}

@keyframes shake-left-right {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

.shake-active {
  animation: shake-left-right 0.3s ease-in-out; /* Adjust duration and timing as needed */
}



/* Responsive design */
@media (max-width: 600px) {
    .wrapper {
        margin: 15px;
        padding: 20px;
        width: 85%;
    }

    .header h1 {
        font-size: 2em;
    }

    .header p {
       font-size: 1.1em;
    }

    #question_text {
        font-size: 1.8em;
    }

    .answer {
        flex-direction: column;
    }

    #question_text, #answer_input, #submit_button {
        width: 95%;
        box-sizing: border-box;
    }
}
</style>
