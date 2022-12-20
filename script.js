const VALUES = [1, 1, 2, 7, 8, 9, 10, 11];
const SUIT = ["kule", "listy", "žaludy", "srdce"];
const RANK = ["svršek", "spodek", "král", "sedma", "osmička", "devítka", "desítka", "eso"];
const LIVES_MAX = 3;

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

class CardStack {
    constructor() {
        this.cards = [];
    }

    toString() {
        let retStr = "";
        let n = this.cards.length;
        for (let i = 0; i < n - 1; i++) {
            retStr += this.cards[i].toString() + ", ";
        }
    
        if (n != 0) {
            retStr += this.cards[n - 1].toString();
        }
    
        return retStr;
    }

    toStringWithBreak() {
        let retStr = "";
        let n = this.cards.length;
        for (let i = 0; i < n; i++) {
            retStr += `${this.cards[i].toString()} (${this.cards[i].value})<br/>`;
        }

        return retStr;
    }
}

class Hand extends CardStack {
    constructor() {
        super();
        this.sum = 0;
    }

    add(card) {
        this.cards.push(card);
        this.sum += card.value;
    }    
}

class Deck extends CardStack {
    constructor() {
        super();

        //generate ordered deck
        this.ordered = [];
        SUIT.forEach(suit => {
            let i = 0;
            RANK.forEach(rank => {
                this.ordered.push(new Card(suit, rank, VALUES[i]));
                i++;
            })
        });
    }

    shuffleNew() {
        //uses the Fisher-Yates shuffle algorhitm
        //traverse array &
        //swap element at current position with random one not yet visited
        this.cards = [...this.ordered];
        for(let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));

            let tmpSwap = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = tmpSwap;
        }
    }

    dealCard() {
        if (this.cards.length == 0) {
            this.shuffleNew();
        }
        return this.cards.pop();
    }
}

class Game {
    constructor() {
        this.initialBet = 0;
        this.playerBalance = 0;
        this.livesLeft = LIVES_MAX;

        this.currBet = 0;

        this.deck = new Deck();
        this.playerCards = new Hand();
        this.botCards = new Hand();
    }

    hit() {
        this.playerCards.add(this.deck.dealCard());
        document.querySelector('#player-cards').innerHTML = this.playerCards.toStringWithBreak(); 
        document.querySelector('#player-sum').textContent = this.playerCards.sum;

        if(this.playerCards.sum > 21) {
            this.stay();
        }
    }

    stay() {
        this.botPlay();

        let resultStr = "";
        if (this.playerCards.sum > 21) {
            resultStr = "Součet je přes 21, prohrál jste!"
            this.playerBalance = this.playerBalance - this.currBet;
        }
        else if (this.playerCards.sum > this.botCards.sum
                 || this.botCards.sum > 21) {
            resultStr = "VÝHRA!!!";
            this.playerBalance = this.playerBalance + this.currBet;
        }
        else if (this.playerCards.sum < this.botCards.sum) {
            resultStr = "Prohrál jste...";
            this.playerBalance = this.playerBalance - this.currBet;
        }
        else {
            resultStr = "Stejné součty, sázky se vrací."
        }

        this.alertRoundResult(resultStr);
        this.nextRound();
    }

    alertRoundResult(resultStr) {
        alert(`${resultStr}\n` +
              `Váš součet je ${this.playerCards.sum}, počítač měl ${this.botCards.sum}\n` +
              `Vaše karty: ${this.playerCards.toString()}\n` +
              `Počítače karty: ${this.botCards.toString()}\n`);
    }

    nextRound() {
        if (this.playerBalance <= 0) {
            this.livesLeft--;
            let healthBar = document.querySelector("#healthbar");
            updateBar(healthBar, this.livesLeft);
            if (this.livesLeft > 0) {
                alert(`Jste bez peněz!\n` +
                `Máte ${this.livesLeft} zbývající životy, bank byl doplněn.\n` );
                this.playerBalance = this.initialBet;
                this.deck.shuffleNew();
            }
            else {
                alert(`Jste bez peněz i životů!\n` +
                `Prosím použijte tlačítko restart pro novou hru.\n`);
            }
        }
        
        document.querySelector('#curr-balance').textContent = this.playerBalance;

        //reset counter vars for next round
        this.playerCards = new Hand();
        this.botCards = new Hand();
        
        document.querySelectorAll('.round .resetable').forEach(elem => {
            elem.textContent = "0";
        });

        toggleBetPlayButtons();
        document.querySelector('#bet-field').focus();
    }

    botPlay() {
        while (this.botCards.sum < 17) {
            this.botCards.add(this.deck.dealCard());
        }
    }
}

function toggleBetPlayButtons() {
    let betButton = document.querySelector('#bet-button');
    let leaveButton = document.querySelector('#leave-button');
    let hitButton = document.querySelector('#hit-button');
    let stayButton = document.querySelector('#stay-button');
    
    if (betButton.hasAttribute('disabled')) {
        betButton.removeAttribute('disabled');
        leaveButton.removeAttribute('disabled');
        hitButton.setAttribute('disabled', '');
        stayButton.setAttribute('disabled', '');
    }
    else {
        betButton.setAttribute('disabled', '');
        leaveButton.setAttribute('disabled', '');
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
    ctx.arc(x + arcRadius, y, arcRadius, 0, Math.PI, true);
    ctx.moveTo(x + arcRadius * 2, y);
    ctx.lineTo(x, y + (arcRadius) * 2.8);
    ctx.lineTo(x - arcRadius * 2, y);
    ctx.closePath();
    ctx.fill();
}

function drawSadFace(ctx, x, y, size, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    let arcRadius = size / 4;
    ctx.arc(x - size / 2, y, arcRadius, 0, 2 * Math.PI, true);
    ctx.arc(x + size / 2, y, arcRadius, 0, 2 * Math.PI, true);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y + size / 1.6, arcRadius, 0, -1 * Math.PI, true);
    ctx.stroke();
}

function updateBar(bar, heartCount) {

    ctx = bar.getContext("2d");
    ctx.clearRect(0, 0, bar.width, bar.height);

    let heartSize = bar.height / 2 + 10;
    if (heartCount > 0) {
        let gapSize = heartSize / 3;
        let x = (bar.width - (heartCount * heartSize + (heartCount - 1) * gapSize) + heartSize) / 2;

        for (let i = 0; i < heartCount; i++) {
            drawHeart(ctx, x, bar.height / 3, heartSize, "red");
            x += heartSize + gapSize;
        }
    }
    else {
        drawSadFace(ctx, bar.width / 2, bar.height / 3, heartSize, "black");
    }
}

function game() {
    let game = new Game();
    
    let buyInButton = document.querySelector('#buy-in-button');
    let leaveButton = document.querySelector('#leave-button');
    let betButton = document.querySelector('#bet-button');
    let hitButton = document.querySelector('#hit-button');
    let stayButton = document.querySelector('#stay-button');
    let resetButton = document.querySelector('#reset-button');

    hitButton.setAttribute('disabled', '');
    stayButton.setAttribute('disabled', '');

    let healthBar = document.querySelector("#healthbar");
    updateBar(healthBar, game.livesLeft);

    buyInButton.addEventListener('click', (event) => {
        let buyInField = document.querySelector('#buy-in-field');
        let buyInInput = parseInt(buyInField.value);
        if (Number.isNaN(buyInInput) || buyInInput < 10) {
            alert("Prosím zadejte číslo větší než 10.")
            return;
        }
        game.playerBalance = buyInInput;
        game.initialBet = buyInInput;
        document.querySelector('#curr-balance').textContent = game.playerBalance;
        toggleDisplay(document.querySelector('.buy-in'));
        toggleDisplay(document.querySelector('.playing'));
    })

    leaveButton.addEventListener('click', (event) => {
        if (confirm("Opravdu chcete přestat hrát?")) {
            alert(`Děkujeme za hru.\n` +
            `Začal jste s rozpočtem ${game.initialBet * (LIVES_MAX)} a odcházíte s ${game.playerBalance + game.initialBet * (game.livesLeft - 1)}.\n`);
        }

        betButton.setAttribute('disabled', '');
        leaveButton.setAttribute('disabled', '');
        document.querySelector('#curr-balance').innerHTML = "<i><b>MONEY WITHDRAWN</b></i>";

    })

    betButton.addEventListener('click', (event) => {
        let betField = document.querySelector('#bet-field');
        let betInput = parseInt(betField.value);
        if (Number.isNaN(betInput) || betInput < 1 || betInput > game.playerBalance) {
            alert("Prosím zadejte numerickou částku, kterou si můžete dovolit.")
            return;
        }
        game.currBet = betInput;
        document.querySelector('#curr-bet').textContent = game.currBet;
        toggleBetPlayButtons();
        game.hit();
    });

    hitButton.addEventListener('click', (event) => {
        game.hit();
    });

    stayButton.addEventListener('click', (event) => {
        game.stay();
    });

    resetButton.addEventListener('click', (event) => {
        document.querySelectorAll('div.resetable').forEach(elem =>
            elem.textContent = 0);

        document.querySelector('#bet-field').value = 1;
        document.querySelector('#buy-in-field').value = 10;
        
        if (document.querySelector('.buy-in').style.display == 'none') {
            toggleDisplay(document.querySelector('.buy-in'));
            toggleDisplay(document.querySelector('.playing'));
        }

        if (betButton.hasAttribute('disabled')) {
            toggleBetPlayButtons();
        }

        game = new Game();

        let healthBar = document.querySelector("#healthbar");
        updateBar(healthBar, game.livesLeft);
    });
}

game()
