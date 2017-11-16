// main.js
// global variables
const faceValues = ['A',2,3,4,5,6,7,8,9,10, 'J', 'Q', 'K'];
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
let computerTurn = false;
let playerTurn = true;
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
    document.querySelector('.start').style.display = "none";
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

    //get the element inside which all other elements will be appended.
    const game = document.getElementsByClassName('game')[0];
    console.log("class name is:", game.classList);
    const computerScoreDiv = document.createElement("div");
    const computerCardContainer = document.createElement("div");
    const playerScoreDiv = document.createElement("div");
    const playerCardContainer = document.createElement("div");

    //giving class names
    computerScoreDiv.classList.add('computer-score');
    computerCardContainer.classList.add('computer-card-container');
    playerScoreDiv.classList.add('player-score');
    playerCardContainer.classList.add('player-card-container');

    //create two button for player ("hit" and "stand")
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
    computerScoreDiv.innerHTML = "Computer Hand - Total: <span id='computer-score'></span>";
    playerScoreDiv.innerHTML = "Player Hand - Total: <span id='player-score'></span>";

    // showing the initial cards and score once the game begins
    addCard(computerCardContainer, "computer", card1);
    addCard(computerCardContainer, "computer", card3);
    addCard(playerCardContainer, "player", card2);
    addCard(playerCardContainer, "player", card4);
    showComputerScore();
    showPlayerScore();




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
                deck.push({face: faceValues[i], suit: suits[j]});
            }
        }
        return shuffleDeck(deck);
    } else {
        let initialDeck = [];
        for(let i = 0; i < initialValues.length; i++) {
            // by default gives the suit "hearts" for the initial face values.
            initialDeck.push({face: parseInt(initialValues[i]), suit: suits[0]});
        }
        // we need to add the rest of the cards under the default ones.
        for(let i = 0; i < faceValues.length; i++) {
            for(let j = 0; j < suits.length; j++) {
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

function createElement(elementToCreate) {
    return document.createElement(elementToCreate);
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
        if (card.face === 'J' || card.face === 'K' || card.face === 'Q' || card.face === 'A')
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