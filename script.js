const VALUES = [1, 1, 2, 7, 8, 9, 10, 11];
function resetElems() {
    document.querySelectorAll('div.resetable').forEach(elem =>
        elem.textContent = 0);
    document.querySelector('#bet-field').value = 1;
}

function dealCard() {
    return VALUES[Math.floor(Math.random() * VALUES.length)];
}

function botPlay() {
    let sum = dealCard();
    while (sum < 17) {
        sum += dealCard();
    }
    return sum;
}

class Game {
    constructor(playerBalance) {
        this.playerBalance = playerBalance;
        this.playerScore = 0;
        this.botScore = 0;
        this.currBet = 0;
    }

    hit() {
        this.playerScore += dealCard();
        document.querySelector('#player-sum').textContent = this.playerScore;

        if(this.playerScore > 21) {
            this.stay();
        }
    }

    stay() {
        this.botScore = botPlay();
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
        alert(`${resultStr}\nYour score is ${this.playerScore}, bot scored ${this.botScore}`);
        console.log(this.playerBalance);
        this.nextRound();
    }

    nextRound() {
        if (this.playerBalance <= 0) {
            alert("You're out of money!");
        }
        
        document.querySelector('#curr-balance').textContent = this.playerBalance;
        this.playerScore = 0;
        this.botScore = 0;
        document.querySelectorAll('.round .resetable').forEach(elem => {
            elem.textContent = "0";
        });

        toggleBetPlayButtons();
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

function game() {
    let game = new Game();

    let buyInButton = document.querySelector('#buy-in-button');
    let betButton = document.querySelector('#bet-button');
    let hitButton = document.querySelector('#hit-button');
    let stayButton = document.querySelector('#stay-button');
    let resetButton = document.querySelector('#reset-button');

    hitButton.setAttribute('disabled', '');
    stayButton.setAttribute('disabled', '');

    //buy in
    buyInButton.addEventListener('click', (event) => {
        let buyInField = document.querySelector('#buy-in-field');
        game.playerBalance = parseInt(buyInField.value);
        document.querySelector('#curr-balance').textContent = game.playerBalance;
        toggleDisplay(document.querySelector('.buy-in'));
        toggleDisplay(document.querySelector('.playing'));
    })

    //bet
    betButton.addEventListener('click', (event) => {
        let betField = document.querySelector('#bet-field');
        game.currBet = parseInt(betField.value);
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
        document.querySelectorAll('.bet').forEach(elem => toggleDisplay(elem));
    })


}

game()
