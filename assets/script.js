const board = document.querySelector(".board");
const placeBetBtn = document.querySelector("button.placeBet");

let currentMultiplier;

class Panel {
    btnMax = document.querySelector("button.max");
    autoCashoutInput = document.querySelector("#autoCashout");
    betAccountInput = document.querySelector("#betAmount");
    walletSpan = document.querySelector(".wallet-money span");

    historyDiv = document.querySelector(".history");

    panel = {
        moneyAvailable: null,
        bet: null,
        autoCashout: null,
        historyOfMultipliers: []
    };

    constructor() {
        this.btnMax.addEventListener('click', () => this.betAccountInput.value = this.panel.moneyAvailable);
        this.autoCashoutInput.addEventListener('change', () => this.panel.autoCashout = this.autoCashoutInput.value);

        placeBetBtn.addEventListener('click', () => {
            if (placeBetBtn.innerHTML === 'Place Bet') {
                this.addPlaceBet();
            } else if (board.textContent !== "0.00x") {
                new Game().win();
            }
        });

        this.downloadingFromCookie();
    }

    downloadingFromCookie() {
        let account = localStorage.getItem('account');
        if (account === null) {
            account = localStorage.setItem('account', 1000);
            account = localStorage.getItem('account');
        }
        this.panel.moneyAvailable = account;
        this.walletSpan.innerHTML = this.panel.moneyAvailable;
    }

    changeDisabled() {
        this.panel.bet == null || this.panel.bet === '' || this.panel.bet == 0 ? placeBetBtn.disabled = true : placeBetBtn.disabled = false;
    }

    addPlaceBet() {
        if (+this.betAccountInput.value <= this.panel.moneyAvailable && +this.betAccountInput.value > 0 && +this.betAccountInput.value !== 0) {
            placeBetBtn.disabled = true;
            this.panel.bet = +this.betAccountInput.value;
            this.panel.moneyAvailable -= this.panel.bet;
            this.updateMoney();
        } else {
            alert('invalid bet');
            throw {message: 'Invalid bet'};
        }
        this.betAccountInput.value = '';
    }

    updateMoney() {
        localStorage.setItem('account', this.panel.moneyAvailable);
        this.walletSpan.textContent = this.panel.moneyAvailable;
        placeBetBtn.disabled = true;
    }

    addToHis(value) {
        this.historyDiv.textContent = "";
        this.panel.historyOfMultipliers.unshift(value);
        this.panel.historyOfMultipliers.forEach((one) => this.historyDiv.innerHTML += one + "x<br/>")
    }

    checkAuto(current) {
        let cashout;
        for (let i of this.panel.autoCashout) {
            if (this.panel.autoCashout.charAt(i) === '.') {
                cashout = this.panel.autoCashout;
                break;
            } else
                cashout = this.panel.autoCashout + '.00';
        }
        if (cashout == current.toFixed(2)) {
            new Game().win();
        }
    }

    buttonChange() {
        placeBetBtn.innerHTML === 'Cash Out...' ? placeBetBtn.innerHTML = 'Place Bet' : placeBetBtn.innerHTML = 'Cash Out...';
        placeBetBtn.classList.toggle("btn-warning");
        placeBetBtn.classList.toggle("btn-success");
        placeBetBtn.classList.toggle("text-dark");
    }
}

class Counter {
    counterValue;
    constructor() {
        this.panel2 = new Panel();
        this.counterValue = 30;
    }

    returnCounter() {
        if (this.counterValue >= 1) {
            return this.counterValue--;
        } else {
            return false;
        }
    }

    returnA(multiplierValue) {
        if (currentMultiplier < multiplierValue) {
             currentMultiplier += 0.01;
            if (this.panel2.panel.autoCashout) {
                this.panel2.checkAuto(currentMultiplier);
            }
            return currentMultiplier;
        } else {
            return false;
        }
    }

    mV() {
        return  Math.random() < 0.7 ? this.drawingTheMultiplier(1) : this.drawingTheMultiplier(15);
    }

    drawingTheMultiplier(min) {
        return ((Math.random() * 15) + min).toFixed(2);
    }
}
class Pomoc {
    changeText(text) {
        board.textContent = text;
    }
}

class Game extends Pomoc {
    interval;
    multiplierValue;

    constructor() {
        super();
        this.panel2 = new Panel();
        this.counter = new Counter();
    }

    start() {
        currentMultiplier = 1;
        setTimeout(() => {
            board.style.backgroundColor = '#4ea196';
            placeBetBtn.disabled = false;
            this.interval = setInterval(this.startCountdown.bind(this), 800);
        }, 5000);
    }

    startCountdown() {
        let counter2 = this.counter.returnCounter();
        if(counter2) {
            board.textContent = counter2;
        } else if (!counter2) {
            this.calcOfProbability();
        }
    }

    calcOfProbability() {
        this.multiplierValue = this.counter.mV();
        clearInterval(this.interval);
        this.panel2.buttonChange();
        this.panel2.changeDisabled(); //////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.interval = setInterval(this.timer.bind(this), 20);
    }


    timer() {
        let current = this.counter.returnA(this.multiplierValue);
        if (current) {
            this.changeText(current.toFixed(2) + "x");
            if (this.panel2.panel.autoCashout) {
                this.panel2.checkAuto();
            }
        } else {
            this.multiplierInterruption();
        }
    }

    multiplierInterruption() {
        this.panel2.addToHis(this.multiplierValue);
        this.changeText("0.00x");
        board.style.backgroundColor = '#ff6666';
        clearInterval(this.interval);
        this.panel2.buttonChange();
        this.start();
    }

    win() {
        let win = this.panel.bet * currentMultiplier.toFixed(2);
        this.panel.moneyAvailable += win;
        this.panel2.updateMoney();
    }
}

const game = new Game();
game.start();



