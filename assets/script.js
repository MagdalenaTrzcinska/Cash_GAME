import {Wallet} from "./Panel.js";
import {Timer} from "./Timer.js";

class Game {
    static currentMultiplier;
    interval;
    multiplierValue;

    board = document.querySelector(".board");

    historyDiv = document.querySelector(".history");
    placeBetBtn = document.querySelector("button.placeBet");


    constructor() {
        this.timer = new Timer();
        this.wallet = new Wallet();

        this.placeBetBtn.addEventListener('click', () => {
            if (this.placeBetBtn.innerHTML === 'Place Bet') {
                this.wallet.addPlaceBet();
            } else if (this.board.textContent !== "0.00x") {
                this.win();
            }
        });
    }

    win() {
        this.wallet.win(Game.currentMultiplier.toFixed(2));
    }

    start() {
        Game.currentMultiplier = 1;

        setTimeout(() => {
            this.board.style.backgroundColor = '#4ea196';
            this.placeBetBtn.disabled = false;
            this.interval = setInterval(this.startCountdown.bind(this), 800);
        }, 5000);
    }

    startCountdown() {
        let counter2 = this.timer.returnTimer();
        if (counter2) {
            this.board.textContent = counter2;
        } else if (!counter2) {
            this.calcOfProbability();
        }
    }

    calcOfProbability() {
        this.multiplierValue = this.getMultiplierValue();
        clearInterval(this.interval);
        this.buttonChange();
        this.changeDisabled();
        this.interval = setInterval(this.multiplierCounter.bind(this), 20);
    }

    changeDisabled() {
        this.wallet.panel.bet == null || this.wallet.panel.bet === '' || this.wallet.panel.bet == 0 ? this.placeBetBtn.disabled = true : this.placeBetBtn.disabled = false;
    }

    buttonChange() {
        this.placeBetBtn.innerHTML === 'Cash Out...' ? this.placeBetBtn.innerHTML = 'Place Bet' : this.placeBetBtn.innerHTML = 'Cash Out...';
        this.placeBetBtn.classList.toggle("btn-warning");
        this.placeBetBtn.classList.toggle("btn-success");
        this.placeBetBtn.classList.toggle("text-dark");
    }

    getMultiplierValue() {
        return Math.random() < 0.7 ? this.drawingTheMultiplier(1) : this.drawingTheMultiplier(15);
    }

    drawingTheMultiplier(min) {
        return ((Math.random() * 15) + min).toFixed(2);
    }

    multiplierCounter() {
        let current = this.returnA(this.multiplierValue);
        if (current) {
            this.changeText(current.toFixed(2) + "x");
            if (this.wallet.panel.autoCashout) {
                this.wallet.panel.checkAuto();
            }
        } else {
            this.multiplierInterruption();
        }
    }

    multiplierInterruption() {
        this.addToHis(this.multiplierValue);
        this.changeText("0.00x");
        this.board.style.backgroundColor = '#ff6666';
        clearInterval(this.interval);
        this.buttonChange();
        this.start();
    }

    addToHis(value) {
        this.historyDiv.textContent = "";
        this.wallet.panel.historyOfMultipliers.unshift(value);
        this.wallet.panel.historyOfMultipliers.forEach((one) => this.historyDiv.innerHTML += one + "x<br/>")
    }

    changeText(text) {
        this.board.textContent = text;
    }

    returnA(multiplierValue) {
        if (Game.currentMultiplier < multiplierValue) {
            Game.currentMultiplier += 0.01;
            if (this.wallet.panel.autoCashout) {
                this.checkAuto(Game.currentMultiplier);
            }
            return Game.currentMultiplier;
        } else {
            return false;
        }
    }

    checkAuto(current) {
        let cashout;
        for (let i of this.wallet.panel.autoCashout) {
            if (this.wallet.panel.autoCashout.charAt(i) === '.') {
                cashout = this.wallet.panel.autoCashout;
                break;
            } else
                cashout = this.wallet.panel.autoCashout + '.00';
        }
        if (cashout == current.toFixed(2)) {
            new Game().win();
        }
    }
}


const game = new Game();
game.start();
