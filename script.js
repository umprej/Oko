const VALUES = [1, 1, 2, 7, 8, 9, 10, 11];

function reset() {

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
        if(this.playerScore > 21) {
            this.stay();
        }
        document.querySelector('#player-sum').textContent = this.playerScore;

    }

    stay() {
        this.botScore = botPlay();
        alert(`Your score is ${this.playerScore}, bot scored ${this.botScore}`);
    }
}

function game() {
    let game = new Game();

    
    //initial bet
    let betButton = document.querySelector("#bet-button");
    betButton.addEventListener('click', (event) => {
        let betField = document.querySelector("#bet-field");
        game.playerBalance = betField.value;
        document.querySelector('#curr-balance').textContent = game.playerBalance;

        document.querySelectorAll('.bet').forEach(elem =>
            elem.style.display = "none");

        game.hit();
    });

    //hit
    let hitButton = document.querySelector("#hit-button");
    hitButton.addEventListener('click', (event) => {
        game.hit();
    });

    //stay
    let stayButton = document.querySelector("#stay-button");
    stayButton.addEventListener('click', (event) => {
        game.stay();
    });


}

game()
