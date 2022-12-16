const VALUES = [1, 1, 2, 7, 8, 9, 10, 11];
const SUIT = ["kule", "listy", "žaludy", "srdce"];
const RANK = ["svršek", "spodek", "král", "sedma", "osmička", "devítka", "desítka", "eso"];

class Card {
    constructor(suit, rank, value) {
        this.suit = suit;
        this.rank = rank;
        this.value = value;
    }

    //předem se omlouvám za tenhle přístup raději než nadefinovat si seznam všech karet
    //až moc pozdě jsem si uvědomil bolesti českého skloňování
    toString() {
        let retStr = "";

        if (this.suit == "kule") {
            retStr += "kulov";
        }
        else if (this.suit == "listy") {
            retStr += "listov";
        }
        else if (this.suit == "žaludy") {
            retStr += "žaludsk";
        }
        else {
            retStr += "srdcov";
        }

        if (this.value < 3) {
            retStr += "ý";
        }
        else if (this.value < 11) {
            retStr += "á"
        }
        else {
            retStr += "é"
        }

        retStr += " " + this.rank;

        return retStr;
    }
}

class Deck {
    constructor() {
        this.ordered = [];
        this.shuffled = [];

        //generate ordered deck
        SUIT.forEach(suit => {
            let i = 0;
            RANK.forEach(rank => {
                this.ordered.push(new Card(suit, rank, VALUES[i]));
                i++;
            })
        });
    }

    print() {
        this.ordered.forEach(card => {
            console.log(card.toString);
        })
    }

    shuffle() {
        //uses the Fisher-Yates shuffle algorhitm
        //traverse array &
        //swap element at current position with random one not yet visited
        this.shuffled = this.ordered;
        for(let i = this.ordered.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));

            let tmpSwap = this.shuffled[i];
            this.shuffled[i] = this.shuffled[j];
            this.shuffled[j] = tmpSwap;
        }
    }

    dealCard() {
        if (this.shuffled.length == 0) {
            this.shuffle();
        }
        return this.shuffled.pop();
    }
}

function resetElems() {
    document.querySelectorAll('div.resetable').forEach(elem =>
        elem.textContent = 0);
    document.querySelector('#bet-field').value = 1;
    document.querySelector('#buy-in-field').value = 10;
    
    if (document.querySelector('.buy-in').style.display == 'none') {
        toggleDisplay(document.querySelector('.buy-in'));
        toggleDisplay(document.querySelector('.playing'));
    }
}

class Game {
    constructor() {
        this.initialBet = 0;
        this.playerBalance = 0;
        this.livesLeft = 3;

        this.playerScore = 0;
        this.botScore = 0;
        this.currBet = 0;

        this.deck = new Deck();
        this.playerCards = [];
        this.botCards = [];
    }

    hit() {
        let card = this.deck.dealCard();
        this.playerCards.push(card);
        this.playerScore += card.value;
        document.querySelector('#player-sum').textContent = this.playerScore;

        if(this.playerScore > 21) {
            this.stay();
        }
    }

    stay() {
        this.botScore = this.botPlay();
        let resultStr = "";
        if (this.playerScore > 21) {
            resultStr = "You went bust!"
            this.playerBalance = this.playerBalance - this.currBet;
        }
        else if (this.playerScore > this.botScore || this.botScore > 21) {
            resultStr = "YOU WIN!!!";
            this.playerBalance = this.playerBalance + this.currBet;
        }
        else if (this.playerScore < this.botScore) {
            resultStr = "You lost...";
            this.playerBalance = this.playerBalance - this.currBet;
        }
        else {
            resultStr = "You've tied."
        }

        this.alertRoundResult(resultStr);
        this.nextRound();
    }

    alertRoundResult(resultStr) {
        function cardsToString(cards) {
            let retStr = "";
            let n = cards.length;
            for (let i = 0; i < n - 1; i++) {
                retStr += cards[i].toString() + ", ";
            }

            if (n != 0) {
                retStr += cards[n - 1].toString();
            }

            return retStr;
        }

        alert(`${resultStr}\n` +
              `Your score is ${this.playerScore}, bot scored ${this.botScore}\n` +
              `You cards: ${cardsToString(this.playerCards)}\n` +
              `Bot cards: ${cardsToString(this.botCards)}\n`);
        console.log(this.playerBalance);
    }

    nextRound() {
        if (this.playerBalance <= 0) {
            this.livesLeft--;
            let healthBar = document.querySelector("#healthbar");
            updateBar(healthBar, this.livesLeft);
            if (this.livesLeft > 0) {
                alert(`You're out of money!\n` +
                `You have ${this.livesLeft} lives remaining.\n`);
                this.playerBalance = this.initialBet;
            }
            else {
                alert(`You're out of money and lives!\n` +
                `Please reset the game if you want to play again.\n`);
            }
        }
        

        document.querySelector('#lives').textContent = this.livesLeft;
        document.querySelector('#curr-balance').textContent = this.playerBalance;

        //reset counter vars for next round
        this.deck.shuffle();
        this.playerCards = [];
        this.botCards = [];
        this.playerScore = 0;
        this.botScore = 0;
        document.querySelectorAll('.round .resetable').forEach(elem => {
            elem.textContent = "0";
        });

        toggleBetPlayButtons();
        document.querySelector('#bet-field').focus();
    }

    botPlay() {
        let card = this.deck.dealCard();
        let sum = card.value;
        this.botCards.push(card);
        while (sum < 17) {
            card = this.deck.dealCard();
            this.botCards.push(card);
            sum += card.value;
        }
        return sum;
    }
}

function toggleBetPlayButtons() {
    let betButton = document.querySelector('#bet-button');
    let hitButton = document.querySelector('#hit-button');
    let stayButton = document.querySelector('#stay-button');
    
    if (betButton.hasAttribute('disabled')) {
        betButton.removeAttribute('disabled');
        hitButton.setAttribute('disabled', '');
        stayButton.setAttribute('disabled', '');
    }
    else {
        betButton.setAttribute('disabled', '');
        hitButton.removeAttribute('disabled');
        stayButton.removeAttribute('disabled');
    }
}

function toggleDisplay(elem) {
    if (elem.style.display == 'none') {
        elem.style.display = 'flex';
    }
    else {
        elem.style.display = 'none';
    }
}

function drawHeart(ctx, x, y, size, color) {
    ctx.beginPath();
    ctx.fillStyle = color;

    let arcRadius = size / 4;
    ctx.arc(x - arcRadius, y, arcRadius, 0, Math.PI, true);
    ctx.arc(x + arcRadius, y, arcRadius, 0, Math.PI, true)
    ctx.moveTo(x + arcRadius * 2, y)
    ctx.lineTo(x, y + (arcRadius) * 2.8);
    ctx.lineTo(x - arcRadius * 2, y);
    ctx.closePath();
    ctx.fill();
}

function updateBar(bar, heartCount) {

    ctx = bar.getContext("2d");
    ctx.clearRect(0, 0, bar.width, bar.height);

    let heartSize = bar.height / 2 + 10;
    let gapSize = heartSize / 3;
    let x = (bar.width - (heartCount * heartSize + (heartCount - 1) * gapSize) + heartSize) / 2;

    for (let i = 0; i < heartCount; i++) {
        drawHeart(ctx, x, bar.height / 3, heartSize, "red");
        x += heartSize + gapSize;
    }
}

function game() {
    let game = new Game();
    
    let buyInButton = document.querySelector('#buy-in-button');
    let betButton = document.querySelector('#bet-button');
    let hitButton = document.querySelector('#hit-button');
    let stayButton = document.querySelector('#stay-button');
    let resetButton = document.querySelector('#reset-button');

    hitButton.setAttribute('disabled', '');
    stayButton.setAttribute('disabled', '');

    let healthBar = document.querySelector("#healthbar");
    updateBar(healthBar, game.livesLeft);

    //buy in
    buyInButton.addEventListener('click', (event) => {
        let buyInField = document.querySelector('#buy-in-field');
        let buyInInput = parseInt(buyInField.value);
        if (Number.isNaN(buyInInput) || buyInInput < 10) {
            alert("Please enter a numberic bet above 10.")
            return;
        }
        game.playerBalance = buyInInput;
        game.initialBet = buyInInput;
        document.querySelector('#curr-balance').textContent = game.playerBalance;
        toggleDisplay(document.querySelector('.buy-in'));
        toggleDisplay(document.querySelector('.playing'));
    })

    //bet
    betButton.addEventListener('click', (event) => {
        let betField = document.querySelector('#bet-field');
        let betInput = parseInt(betField.value);
        if (Number.isNaN(betInput) || betInput < 1 || betInput > game.playerBalance) {
            alert("Please enter a numeric bet above 1 that you can afford.")
            return;
        }
        game.currBet = betInput;
        document.querySelector('#curr-bet').textContent = game.currBet;
        toggleBetPlayButtons();
        game.hit();
    });

    //hit
    hitButton.addEventListener('click', (event) => {
        game.hit();
    });

    //stay
    stayButton.addEventListener('click', (event) => {
        game.stay();
    });

    //reset
    resetButton.addEventListener('click', (event) => {
        resetElems();
        game = new Game();
        })
}

game()
