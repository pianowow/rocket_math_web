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
    const problem = new_question($('#operator_select').val());
    gameState.currentAnswer = problem.answer;
    create_hint();
    const question_text = `${problem.num1} ${problem.operator} ${problem.num2} = ?`;
    $('#question_text').text(question_text);
    $('#answer_input').val('').focus();
}

/**
 * Checks the user's submitted answer.
 */
function check_answer() {
    const userAnswer = parseInt($('#answer_input').val(), 10);
    $("#hint_text").text('');
    if (userAnswer === gameState.currentAnswer) {
        // Correct! Increment score.
        gameState.score++;
        $('#score_text').text(`${gameState.score}`);
        // Load the next question immediately.
        display_new_question();
    } else {
        // Incorrect. You could add feedback here, like shaking the box.
        console.log(`Incorrect. You answered ${userAnswer}, but the answer was ${gameState.currentAnswer}`);
        // After the shake, load the next question.
        if ($('#shake_enabled_checkbox').is(':checked')) {
            shakeElement('answer_input', display_new_question);
        } else {
            display_new_question();
        }
    }
}

/**
 * Shakes a DOM element to provide visual feedback, e.g., for an incorrect answer.
 * @param {string} elementId - The ID of the element to shake (without the #).
 * @param {function} [onComplete] - Optional callback to run after the animation.
 */
function shakeElement(elementId, onComplete) {
    const element = $(`#${elementId}`);
    const originalColor = element.css('background-color');
    element.css('background-color','red');
   
    // Animate requires a non-static position.
    element.css('position', 'relative');
    
    // A short series of animations to create a shake effect, then run the callback.
    element.animate({ left: '-=10px' }, 50)
        .animate({ left: '+=20px' }, 100)
        .animate({ left: '-=20px' }, 100)
        .animate({ left: '+=10px' }, 50)    
        .promise().done(function() { 
            element.css('background-color', originalColor); 
            if (onComplete) {
                onComplete();
            }
        });
}

// This function hides the modal and its backdrop.
function hideModal() {
    const settingsModal = $('#settings_modal');
    const settingsBackdrop = $('#settings_modal_backdrop');
    settingsModal.hide();
    settingsBackdrop.hide();
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
   $('#hint_text').text('Possible answers: ' + gameState.hints.join(', '));
}

$(document).ready(function () {
    display_new_question();
    $('#operator_select').on('change', display_new_question);
    $('#submit_button').on('click', check_answer);
    $('#answer_input').on('keypress', function(e) {
        if (e.which === 13) { // 13 is the key code for Enter
            check_answer();
        }
    });
    $('#hint_button').on('click', illuminate_hint);
    
    // Get references to the modal elements from the HTML.
    const settingsModal = $('#settings_modal');
    const settingsBackdrop = $('#settings_modal_backdrop');
    const closeButton = $('.close-button');

    // When the settings button (cog) is clicked, toggle the modal's visibility.
    $('#settings_toggle_button').on('click', function() {
        settingsModal.toggle();
        settingsBackdrop.toggle();
    });

    // When the close button (×) or the backdrop is clicked, hide the modal.
    closeButton.on('click', hideModal);
    settingsBackdrop.on('click', hideModal);
    
});
