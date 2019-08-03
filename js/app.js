
let movesCounter = 0;
let lockCardsCounter = 0;
let openCardsArray = [];


/**
 * @description shuffle an array, Shuffle function from http://stackoverflow.com/a/2450976

 * @param {array} array - array which intended to shuffle his elements
 * @returns array with a random shuffle 
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/**
 * @description shuffle play randomly
 */
function shufflePlay() {

    const iconNodeList = document.querySelectorAll(".card .fa");
    const iconArray = Array.from(iconNodeList);


    const shuffleIconArray = shuffle(iconArray);

    const cards = document.querySelectorAll(".card");
    cards.forEach(function (card, currentIndex) {
        card.innerHTML = shuffleIconArray[currentIndex].outerHTML;
    });
}

shufflePlay();


let isTimerOpen = false;
function startTimer() {
    if (!isTimerOpen) {
        isTimerOpen = true;
        timer();
    }
}

var deck = document.querySelector(".deck");
deck.addEventListener("click", function (event) {
    startTimer();
    if (event.target !== deck && event.target.className === "card" && (openCardsArray.length === 0 || openCardsArray.length === 1)) {
        displayCard(event.target);
        //stars node list wich include stars of header and stars in congratulation popup
        hideStar(2, 1);
        hideStar(5, 4);
    }
});
/**
 * @description hide stars based on conditon of moves in both congratulation popup and head stars
 * @param {integer} thirdStar - position of last star need to hide in  stars node list 
 * @param {integer} secondStar - position of middle star need to hide in  stars node list 
 */
let hideStar = (function () {
    let stars = document.querySelectorAll(".fa-star");
    return function (thirdStar, secondStar) {
        if (movesCounter >= 9 && movesCounter <= 15) {
            stars[thirdStar].className = "fa fa-star hide-star";

        } else if (movesCounter > 15) {
            stars[secondStar].className = "fa fa-star hide-star";
        }
    };
})();

/**
 * @description display the card's symbol
 * @param {HTMLElement} eventTarget - card that was clicked 
 */
function displayCard(eventTarget) {
    eventTarget.className = "card open show";
    openCards(eventTarget);
}

//count the number of moves that produced matching cards
/**
 * @description 
 * @param {HTMLElement} eventTarget - card that was clicked 
 */
function openCards(eventTarget) {
    openCardsArray.push(eventTarget);
    if (openCardsArray.length === 2) {
        const firstCard = openCardsArray[0].querySelector(".fa");
        const secondCard = openCardsArray[1].querySelector(".fa");

        const hasMatchingCards = firstCard.className
            === secondCard.className;
        if (hasMatchingCards) {
            lockCards();
            incrementMovesCounter();
        } else {
            setTimeout(resetCards, 500);
            incrementMovesCounter();

        }
    }
}

// if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
/**
 * @description lock the cards in the open position
 */
function lockCards() {
    openCardsArray[0].className = "card match";
    openCardsArray[1].className = "card match";
    openCardsArray = [];
    lockCardsCounter++;
    congratulationPopup()
}

/**
 * @description popup congrats message when you win game 
 */

function congratulationPopup() {
    if (lockCardsCounter === 8) {
        let modal = document.querySelector(".modal");
        modal.className = "modal modal-appear";
        clearInterval(idSetInterval);
    }
}

// if the cards do not match, remove the cards from the list and hide the card's symbol 
//(put this functionality in another function that you call from this one)
/**
 * @description remove the cards from the list and hide the card's symbol 
 */
function resetCards() {
    openCardsArray[0].className = "card";
    openCardsArray[1].className = "card";
    openCardsArray = [];
}

//increment the move counter and display it on the page (put this functionality in another function that you call from this one)
function incrementMovesCounter() {
    const moves = document.querySelectorAll(".moves");
    movesCounter++;
    //moves for header
    moves[0].innerHTML = movesCounter;
    //moves for congratulation popup
    moves[1].innerHTML = movesCounter;
}

/**
 * @description set up timer
 */
let idSetInterval = 0;
function timer() {
    var minutesLabel = document.querySelectorAll(".minutes");
    var secondsLabel = document.querySelectorAll(".seconds");
    var totalSeconds = 0;
    idSetInterval = setInterval(setTime, 1000);

    function setTime() {
        ++totalSeconds;
        secondsLabel[0].innerHTML = pad(totalSeconds % 60);
        secondsLabel[1].innerHTML = pad(totalSeconds % 60);
        minutesLabel[0].innerHTML = pad(parseInt(totalSeconds / 60));
        minutesLabel[1].innerHTML = pad(parseInt(totalSeconds / 60));
    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }
}

//restart button on the header of screen 
const restartButton = document.querySelector(".restart");
restartButton.addEventListener("click", function () {
    reset();
    shufflePlay();
    openCardsArray = [];
});

/**
 * @description reset the game board, the timer, the moves, and the star rating.
 */
function reset() {
    //reset the game board
    const cards = document.querySelectorAll(".card");
    cards.forEach(function (card) {
        card.className = "card";
    });

    //reset the timer
    clearInterval(idSetInterval);
    let minutes = document.querySelectorAll(".minutes");
    minutes[0].innerText = "00";
    minutes[1].innerText = "00";
    let seconds = document.querySelectorAll(".seconds");
    seconds[0].innerText = "00";
    seconds[1].innerText = "00";

    isTimerOpen = false;

    //reset start rating
    const stars = document.querySelectorAll(".fa-star");
    stars.forEach(function (star) {
        star.className = "fa fa-star";
    });

    movesCounter = 0;

    //restart moves
    const moves = document.querySelectorAll(".moves");
    moves[0].innerHTML = movesCounter;
    moves[1].innerHTML = movesCounter;
}

//modal box when user win
const acceptPlayAgain = document.querySelector(".fa-check");
acceptPlayAgain.addEventListener("click", function () {
    reset();
    let modal = document.querySelector(".modal");
    modal.className = "modal";
    shufflePlay();
});
