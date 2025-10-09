/**
 *   Rocket Math by Chris Irwin and Olivia Irwin
 *   Displays arithmetic problems for 2nd and 3rd grade math
 *   
 *   Future plans:
 *   - Hint system (more points for no hint, partial credit for hints
 *     hints would be like displaying multiple choice answers
 *
 */
 
/**
 * Game state object
 * Using a single object is cleaner than multiple global variables.
 */
let gameState = {
    score: 0,
    currentAnswer: 0,
    hints: []
};


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
    const problem = new_question(document.getElementById('operator_select').value);
    gameState.currentAnswer = problem.answer;
    create_hint();
    const question_text = `${problem.num1} ${problem.operator} ${problem.num2} = ?`;
    document.getElementById('question_text').innerText = question_text;
    let ans_input = document.getElementById('answer_input');  
    ans_input.value = ''
    ans_input.focus();
}

/**
 * Checks the user's submitted answer.
 */
function check_answer() {
    const userAnswer = parseInt(document.getElementById('answer_input').value, 10);
    if (userAnswer === gameState.currentAnswer) {
        // Correct! Increment score.
        if (document.getElementById("hint_text").innerText) {
           gameState.score++;
        } else {
           gameState.score += 5;
        }
        document.getElementById('score_text').innerText = gameState.score;
        // Load the next question immediately.
        display_new_question();
    } else {
        // Incorrect. You could add feedback here, like shaking the box.
        console.log(`Incorrect. You answered ${userAnswer}, but the answer was ${gameState.currentAnswer}`);
        // After the shake, load the next question.
        if (document.getElementById('shake_enabled_checkbox').checked) {
            shakeElement('answer_input', display_new_question);
        } else {
            display_new_question();
        }
    }
    document.getElementById("hint_text").innerText = '';
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

// This function hides the modal and its backdrop.
function hideModal() {
    const settingsModal = document.getElementById('settings_modal');
    const settingsBackdrop = document.getElementById('settings_modal_backdrop');
    settingsModal.style.display = 'none';
    settingsBackdrop.style.display = 'none';
}

function create_hint() {
   // first get the answer
   const rightAnswer = gameState.currentAnswer;
   // then make four random wrong answers
   let wrongAnswers = [];
   while (wrongAnswers.length < 4) {
      let candidate = Math.floor(Math.random() * 144) + 1;
      if (candidate != rightAnswer && !wrongAnswers.includes(candidate)) {
         wrongAnswers.push(candidate);
      }
   }
   // then mix them all together randomly
   hints = wrongAnswers;
   hints.push(rightAnswer);
   hints.sort(() => Math.random() - 0.5);
   gameState.hints = hints;
}

function illuminate_hint() {
   // show all of the possible answers
   document.getElementById('hint_text').innerText = 'Possible answers: ' + gameState.hints.join(', ');
}

document.addEventListener('DOMContentLoaded', function () {
    display_new_question();
    document.getElementById('operator_select').addEventListener('change', display_new_question);
    document.getElementById('submit_button').addEventListener('click', check_answer);
    document.getElementById('answer_input').addEventListener('keypress', function(e) {
        if (e.which === 13) { // 13 is the key code for Enter
            check_answer();
        }
    });
    document.getElementById('hint_button').addEventListener('click', illuminate_hint);
    
    // Get references to the modal elements from the HTML.
    const settingsModal = document.getElementById('settings_modal');
    const settingsBackdrop = document.getElementById('settings_modal_backdrop');
    const closeButton = document.getElementById('close-button');

    // When the settings button (cog) is clicked, toggle the modal's visibility.
    document.getElementById('settings_toggle_button').addEventListener('click', function() {
        settingsModal.style.display = 'block';
        settingsBackdrop.style.display = 'block';
    });

    // When the close button (×) or the backdrop is clicked, hide the modal.
    closeButton.addEventListener('click', hideModal);
    settingsBackdrop.addEventListener('click', hideModal);
    
});
