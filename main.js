// SETTING GAME NAME

let gameName = 'Guess The Word';
let footer = document.querySelector(`footer`)
document.title = gameName;
document.querySelector(`h1`).innerHTML = gameName
document.querySelector(`footer`).innerHTML = `${gameName} created by Youssef Mostafa`

// setting game options

let numberOffTries = 6;
let numberOffLetters = 6;
let currentTry = 1;
let numberOffHints = 3;

// Manage Hints
const getHintButton = document.querySelector(`.hints`);
getHintButton.innerHTML = `${numberOffHints} hints left!`;
getHintButton.addEventListener(`click`, getHint);

// Manage Words
let wordToGuess = ``;
let words = [`TIGERS`, `APPLES`, `REACTS`, `GRAPES`, `LEMONS`, `BREADS`, `CLOUDS`, `PLANET`, `ORANGE`, `BANANA`, `CHERRY`, `PURPLE`, `SILVER`, `GARDEN`, `MONKEY`, `ROCKET`, `WINDOW`, `STREAM`, `BRIDGE`, `CASTLE`];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

let messageArea = document.querySelector(`.message`);

// console.log(wordToGuess)

function generateInput() {
    const inputsContainer = document.querySelector(`.inputs`)
    // Create Main Try div
    for (let i = 1; i <= numberOffTries; i++) {
        const tryDiv = document.createElement(`div`);
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>${i}</span>`;

        if (i !== currentTry) tryDiv.classList.add(`disabled-inputs`);
        // Create Inputs
        for (let j = 1; j <= numberOffLetters; j++) {
            const input = document.createElement(`input`);
            input.type = `text`;
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute(`maxlength`, `1`);
            tryDiv.appendChild(input);
        }

        inputsContainer.appendChild(tryDiv)
    }
    inputsContainer.children[0].children[1].focus();

    // Disalbe all inputs except the first try
    const inputsInDisabledDiv = document.querySelectorAll(`.disabled-inputs input`);
    inputsInDisabledDiv.forEach(input => input.disabled = true);

    const inputs = document.querySelectorAll(`input`);
    inputs.forEach((input, index) => {

        // Convert input to uppercase
        input.addEventListener(`input`, function() {
            this.value = this.value.toUpperCase(); 
            // console.log(index)
            const nextInput = inputs[index + 1];
            if (nextInput) {
                nextInput.focus();
            }
        });

        input.addEventListener('keydown', function(event) {
            // console.log(event);
            const currentIndex = Array.from(inputs).indexOf(event.target);  // or this
            // console.log(currentIndex)
            if (event.key === 'ArrowRight') {
                const nextInput = currentIndex +1;
                if (nextInput < inputs.length) {
                    inputs[nextInput].focus();
                }
            }else if (event.key === 'ArrowLeft') {
                const prevInput = currentIndex -1;
                if (prevInput >= 0) {
                    inputs[prevInput].focus();
                }
            } 
        });

    });
}

const guessButton = document.querySelector(`.check`);
guessButton.addEventListener('click', handleGuesses);

const resetButton = document.querySelector(`.reset-game`);
resetButton.addEventListener(`click`, resetGame);

console.log(wordToGuess)

function handleGuesses() {
    let saccessGuess = true;
    // console.log(wordToGuess)
    for (let i = 1; i <= numberOffLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];
        
        // Game Logic
        if (letter === actualLetter) {
            // Letter is Correct and in the right place
            inputField.classList.add(`yes-in-place`);
        } else if (wordToGuess.includes(letter)) {
            // Letter is Correct and not in the right place
            inputField.classList.add(`not-in-place`);
            saccessGuess = false;
        }else {
            // Letter is not in the word
            inputField.classList.add(`no`);
            saccessGuess = false;
        }
    }

    // Check if the guess is correct
    if (saccessGuess) {
        // console.log(`You guessed the word!`);
        messageArea.innerHTML = `You guessed the word <span>${wordToGuess.toUpperCase()}</span> correctly after <span>${currentTry}</span> tries!`;

        if (numberOffHints === 3) {
           messageArea.innerHTML += `<br> <p>You didn't use any hints!</p>`; 
        }

        // Add Disabled class to all tries
        let allTries = document.querySelectorAll(`.inputs > div`)
        allTries.forEach(tryDiv => tryDiv.classList.add(`disabled-inputs`));

        // disable the buttons
        guessButton.disabled = true;
        getHintButton.disabled = true;
        guessButton.classList.add(`button-disabled`);
        getHintButton.classList.add(`button-disabled`);

    } else {
        document.querySelector(`.try-${currentTry}`).classList.add(`disabled-inputs`);
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach(input => input.disabled = true);
        currentTry++; 
        
        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        if (currentTry <= numberOffTries) {
            document.querySelector(`.try-${currentTry}`).classList.remove(`disabled-inputs`);
            nextTryInputs.forEach(input => input.disabled = false);
            nextTryInputs[0].focus(); 
        }else {
            messageArea.innerHTML = `You failed to guess the word <span>${wordToGuess.toUpperCase()}</span> after <span>${numberOffTries}</span> tries!`;
            guessButton.disabled = true;
            guessButton.classList.add(`button-disabled`);
        }
    }
} 
function getHint() {
    if (numberOffHints > 0) {
        numberOffHints--;
        getHintButton.innerHTML = `${numberOffHints} hints left!`;
    };

    if  (numberOffHints === 0) {
        getHintButton.disabled = true;
        getHintButton.classList.add(`button-disabled`);
    }

    const enabledInputs = document.querySelectorAll(`input:not([disabled])`);
    // console.log(enabledInputs)
    const emptyEnabledInputs = Array.from(enabledInputs).filter(input => input.value === '');
    // consoe.log(emptyEnabledInputs)
    
    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        // console.log(randomIndex)
        // console.log(randomIndput)
        // console.log(indexToFill)
        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        } 
    }
};


function resetGame() {
    currentTry = 1;
    numberOffHints = 3;
    getHintButton.textContent = `${numberOffHints} hints left!`;
    getHintButton.disabled = false;
    getHintButton.classList.remove(`button-disabled`);
    guessButton.disabled = false;
    guessButton.classList.remove(`button-disabled`);
    messageArea.innerHTML = ``;

    wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

    const inputsContainer = document.querySelector(`.inputs`);
    inputsContainer.innerHTML = ``;
    generateInput();
}


function handleBackspace(event) {
    if (event.key !== 'Backspace') return;

    const inputs = Array.from(document.querySelectorAll(`input:not([disabled])`));
    const currentIndex = inputs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    const currentInput = inputs[currentIndex];
    if (currentInput.value !== '') {
        currentInput.value = '';
        return;
    }

    if (currentIndex > 0) {
        const prevInput = inputs[currentIndex - 1];
        prevInput.value = '';
        prevInput.focus();
    }
}

document.addEventListener(`keydown`, handleBackspace);

window.onload = function() {
    generateInput();
};
