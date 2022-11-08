function reset() {

}

class Game {
    constructor(playerBalance) {
        this.playerBalance = playerBalance;
        this.playerScore = 0;
        this.botScore = 0;
        this.currBet = 0;
    }
}

function game() {
    let game = new Game();
    let betSubmitBtn = document.querySelector("#bet-button");

    betSubmitBtn.addEventListener('click', (event) => {
        let betField = document.querySelector("#bet-field");
        game.playerBalance = betField.value;
        document.querySelector('#curr-balance').textContent = game.playerBalance;

        document.querySelector("#bet-field").setAttribute("disabled", "");
    })
}

game()