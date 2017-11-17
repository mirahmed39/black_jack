// main.js
// global variables
const faceValues = ['A',2,3,4,5,6,7,8,9,10, 'J', 'Q', 'K'];
const suits = ['♥', '♦', '♣', "♠"];
let currentComputerScore = 0;
let currentPlayerScore = 0;
const GAME_VALUE = 21;
const specialCardValues = {'J':10, 'K':10, 'Q':10, 'A1':1, 'A2': 11};


//make sure the document loads before the main is run.
document.addEventListener('DOMContentLoaded', main);
function main() {
    document.querySelector('.playBtn').addEventListener('click', handlePlay);
}

function handlePlay(event) {
    document.querySelector('form').style.display = "none";
    event.preventDefault();

    const initialValues = document.querySelector('#startValues').value.split(',');

    /*
    if the user does not put anything on initialVlaues, it
    will look like ['']. So having a length of 1 means that the
    user did not put anything and we have to generate all 52 cards.
     */
    let numberOfCardsToGenerate = 0;
    if (initialValues.length === 1)
        numberOfCardsToGenerate = 52;
    else
        numberOfCardsToGenerate = 52 - initialValues.length;

    let deck = generateDeck(numberOfCardsToGenerate, initialValues);
    const card1 = dealCard(deck);
    const card2 = dealCard(deck);
    const card3 = dealCard(deck);
    const card4 = dealCard(deck);

    // create a h1 element which will contain the name of the game and will be inserted before the form.
    const headerTag = document.createElement('h1');
    headerTag.appendChild(document.createTextNode("BlackJack"));
    document.getElementsByClassName('start')[0].insertBefore(headerTag, document.forms[0]);

    //get the element inside which all other elements will be appended.
    const game = document.getElementsByClassName('game')[0];
    const computerScoreDiv = document.createElement("div");
    const computerCardContainer = document.createElement("div");
    const playerScoreDiv = document.createElement("div");
    const playerCardContainer = document.createElement("div");

    //giving class names
    computerScoreDiv.classList.add('computer-score');
    computerCardContainer.classList.add('computer-card-container');
    playerScoreDiv.classList.add('player-score');
    playerCardContainer.classList.add('player-card-container');

    //create two button for player ("hit" and "stand") amd give them class names.
    const hitButton = document.createElement('button');
    const standButton = document.createElement('button');
    hitButton.classList.add('hit-button');
    standButton.classList.add('stand-button');
    hitButton.textContent = "Hit";
    standButton.textContent = "Stand";

    // append the above divs inside the game div
    game.appendChild(computerScoreDiv);
    game.appendChild(computerCardContainer);
    game.appendChild(playerScoreDiv);
    game.appendChild(playerCardContainer);
    game.appendChild(hitButton);
    game.appendChild(standButton);

    // create paragraph to show the text of computer and player total
    //const computerScorePara = createElement('p');
    computerScoreDiv.innerHTML = "Computer Hand - Total: <span id='computer-score'>?</span>";
    playerScoreDiv.innerHTML = "Player Hand - Total: <span id='player-score'></span>";

    //create a element to show the result of the game
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result-container');
    game.appendChild(resultDiv);
    const result = document.createElement('p');
    result.classList.add('result');
    resultDiv.appendChild(result);

    // finally adding a button which will start over the game onclick
    const restartButton = game.appendChild(document.createElement('button'));
    restartButton.textContent = "Restart Game";
    restartButton.classList.add('startover');

    // showing the initial cards and score once the game begins
    addCard(computerCardContainer, "computer", card1);
    addCard(computerCardContainer, "computer", card3);
    addCard(playerCardContainer, "player", card2);
    addCard(playerCardContainer, "player", card4);
    //showComputerScore();
    showPlayerScore();

    //getting the initial computer cards and setting the second one to blur.
    const computerCards = computerCardContainer.childNodes;
    const playerCards = playerCardContainer.childNodes;
    computerCards[1].style.backgroundImage = "url('../images/backside.jpg')";
    computerCards[1].style.backgroundPosition = "center";
    computerCards[1].style.color = "transparent";
    computerCards[1].classList.add('covered-card');
    computerCards[0].classList.add('leftmost-card');
    playerCards[0].classList.add('leftmost-card');


    // now it's all about the hit and stand buttons
    hitButton.addEventListener('click', function () {
        const card = dealCard(deck);
        addCard(playerCardContainer, "player", card);
        showPlayerScore();
        if(currentPlayerScore > GAME_VALUE) {
            showResult("Computer");
        }
    });

    /*
    when the player hits the stand button, we have series of things to perform.
    keep dealing cards until the computer score exceeds the game value or computer
    reaches its threshold (we will set it to 19). if the computer exceeds the game value
    that means the player has won. If the computer's current score is the threshold, then
    both player's and computer's current scores are compared. Whoever's close to 21 wins
    the game.
     */
    standButton.addEventListener('click', function () {
        const computerStandScore = 19;
        while(currentComputerScore !== computerStandScore && currentComputerScore < GAME_VALUE ) {
            const card = dealCard(deck);
            addCard(computerCardContainer, "computer", card);
        }
        // check all the cases to determine who's the winner
        if(currentComputerScore === computerStandScore) {
            if (currentComputerScore > currentPlayerScore)
                showResult("Computer");
            else if (currentComputerScore < currentPlayerScore)
                showResult("Player");
            else
                showResult("tie");
        }
        if(currentComputerScore > currentPlayerScore && currentComputerScore === GAME_VALUE )
            showResult("Computer");
        else if(currentComputerScore > currentPlayerScore && currentComputerScore > GAME_VALUE)
            showResult("Player");
        else if(currentComputerScore === currentPlayerScore)
            showResult("tie");
        showComputerScore();
        computerCards[1].style.backgroundImage = "none";
        computerCards[1].style.color = "black";
    });
    // handler for the restart button
    restartButton.addEventListener('click', function () {
       window.location.reload();
    });

}

/*
given the number of cards as an input, it generates the a deck
containing given number of cards shuffled. initialValues is the array
containing the cards to be put on top of the deck.
 */
function generateDeck(numberOfCards, initialValues) {
    let deck = []; // will later contain array of card objects.
    if (numberOfCards === 52) {
        for(let i = 0; i < faceValues.length; i++) {
            for(let j = 0; j < suits.length; j++) {
                // if the face is special then don't parseInt.
                if(faceValues[i] !== 'J' && faceValues[i] !== 'K' && faceValues[i] !== 'Q' && faceValues[i] !== 'A')
                    deck.push({face: parseInt(faceValues[i]), suit: suits[j]});
                else
                    deck.push({face: faceValues[i], suit: suits[j]});
            }
        }
        return shuffleDeck(deck);
    } else {
        let initialDeck = [];
        for(let i = 0; i < initialValues.length; i++) {
            // by default gives the suit "hearts" for the initial face values.
            // if the face is special then don't parseInt.
            if(initialValues[i] !== 'J' && initialValues[i] !== 'K' && initialValues[i] !== 'Q' && initialValues[i] !== 'A')
                initialDeck.push({face: parseInt(initialValues[i]), suit: suits[0]});
            else
                initialDeck.push({face: initialValues[i], suit: suits[0]});
        }
        // we need to add the rest of the cards under the default ones.
        for(let i = 0; i < faceValues.length; i++) {
            for(let j = 0; j < suits.length; j++) {
                if(faceValues[i] !== 'J' && faceValues[i] !== 'K' && faceValues[i] !== 'Q' && faceValues[i] !== 'A')
                    deck.push({face: parseInt(faceValues[i]), suit: suits[j]});
                else
                    deck.push({face: faceValues[i], suit: suits[j]});
            }
        }
        let shuffledDeck = shuffleDeck(deck);
        let reversedInitialValues = initialDeck.reverse();
        console.log(reversedInitialValues);
        shuffledDeck.push(...reversedInitialValues);
        return shuffledDeck;
    }
}

// this is taken from stack overflow.
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleDeck(deck) {
    let shuffledDeck = deck.slice();
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = shuffledDeck[i];
        shuffledDeck[i] = shuffledDeck[j];
        shuffledDeck[j] = temp;
    }
    return shuffledDeck;
}

function dealCard(deck) {
    return deck.pop();
}

function showComputerScore() {
    const target = document.getElementById('computer-score');
    target.textContent = currentComputerScore;
}

function showPlayerScore() {
    const target = document.getElementById('player-score');
    target.textContent = currentPlayerScore;
}

function addCard(containerName,  turn, card) {
    if (turn === 'computer') {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.textContent = card.face + "  " + card.suit;
        containerName.appendChild(cardDiv);
        //check if the card has special faces such as: J, K, Q or A
        if (card.face === 'J' || card.face === 'K' || card.face === 'Q')
            currentComputerScore += specialCardValues[card.face];
        else if(card.face === 'A') {
            if (currentComputerScore + specialCardValues['A2'] > GAME_VALUE && currentComputerScore + specialCardValues['A1'] <= GAME_VALUE)
                currentComputerScore += specialCardValues['A1'];
            else if (currentComputerScore + specialCardValues['A2'] <= GAME_VALUE)
                currentComputerScore += specialCardValues['A2'];
        }
        else
            currentComputerScore += card.face;
    } else if(turn === 'player') {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.textContent = card.face + "  " + card.suit;
        containerName.appendChild(cardDiv);
        //check if the card has special faces such as: J, K, Q or A
        if (card.face === 'J' || card.face === 'K' || card.face === 'Q')
            currentPlayerScore += specialCardValues[card.face];
        else if(card.face === 'A') {
            if (currentPlayerScore + specialCardValues['A2'] > GAME_VALUE && currentPlayerScore + specialCardValues['A1'] <= GAME_VALUE)
                currentPlayerScore += specialCardValues['A1'];
            else if (currentPlayerScore + specialCardValues['A2'] <= GAME_VALUE)
                currentPlayerScore += specialCardValues['A2'];
        }
        else
            currentPlayerScore += card.face;
    }
}

function showResult(whoWon) {
    const result = document.getElementsByClassName('result')[0];
    if(whoWon !== 'tie')
        result.textContent = whoWon + " has won!!!";
    else
        result.textContent = "It's a tie!!!";
}