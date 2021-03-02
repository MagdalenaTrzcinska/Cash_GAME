class Game {
    btnPlaceBet = document.querySelector("button.placeBet");
    board = document.querySelector(".board");
    historyDiv = document.querySelector(".history");
    betAccountInput = document.querySelector("#betAmount");
    moneySpan = document.querySelector(".wallet-money span");
    btnMax = document.querySelector("button.max");
    countdown;
    multiplier;
    interval2;
    standardMultiplier = 1;

    counter = 31;

    wallet2 = {
        avaiableMoney: null,
        bet: null,
        autoCashout: null,
        history: []
    };

    constructor() {
        this.b = new Base2();
        this.t = new Timer2();
        this.acc();
    }

    acc() {
        let account = this.b.al();
        this.wallet2.avaiableMoney = account;
        this.moneySpan.innerHTML = this.wallet2.avaiableMoney;
        //this.base();
    }

    base() {
        this.btnMax.addEventListener('click', () => this.betAccountInput.value = this.wallet2.avaiableMoney);

        this.btnPlaceBet.addEventListener('click', () => {
            if (this.btnPlaceBet.innerHTML === 'Place Bet') {
                this.addPlaceBet();
            } else {
                if (this.board.innerHTML !== "0.00x") {
                    this.win();
                }
            }
            this.cal();

        });
    }

    start() {
        this.btnPlaceBet.innerHTML = 'Place Bet';
        setTimeout(() => {
            this.board.style.backgroundColor = '#4ea196';
            this.countdown = setInterval(this.startCountdown.bind(this), 800);
        }, 5000);
    }

    startCountdown() {
        this.btnPlaceBet.disabled = false;
        if (this.counter >= 1) {
            this.board.innerHTML = this.counter + "s";
            this.counter--;
        } else if (this.counter < 1) {
            //calcOfProbability();
        }
    }




    calcOfProbability() {
        Math.random() < 0.7 ? this.drawingTheMultiplier(1) : drawingTheMultiplier(15);
        this.cal();
        this.interval2 = setInterval(this.timer.bind(this), 20);
        clearInterval(this.countdown);
    }

    drawingTheMultiplier(min) {
        this.multiplier = ((Math.random() * 15) + min).toFixed(2);
    }

    cal() {
        this.btnPlaceBet.innerHTML === 'Cash Out...' ? this.btnPlaceBet.innerHTML = 'Place Bet' : this.btnPlaceBet.innerHTML = 'Cash Out...';
        this.btnPlaceBet.classList.toggle("btn-warning");
        this.btnPlaceBet.classList.toggle("btn-success");
        this.btnPlaceBet.classList.toggle("text-dark");
    }

    timer() {
        if (this.standardMultiplier < this.multiplier) {
            this.board.innerHTML = this.standardMultiplier.toFixed(2) + "x";
            this.standardMultiplier += 0.01;
        } else {
            this.multiplierInterruption();
        }
    }

    multiplierInterruption() {
        this.addToHis();
        this.board.innerHTML = "0.00x";
        this.board.style.backgroundColor = '#ff6666';
        clearInterval(this.interval2);
        this.standardMultiplier = 1;
        this.counter = 30;
        this.start();
    }

    addToHis() {
        this.wallet2.history.unshift(this.multiplier);
        this.historyDiv.innerHTML = "";
        this.wallet2.history.forEach((one) => this.historyDiv.innerHTML += one + "x<br/>")
    }

    win() {
        let win = this.wallet2.bet * this.standardMultiplier.toFixed(2);

        this.wallet2.avaiableMoney += win;
        localStorage.setItem('account', this.wallet2.avaiableMoney);
        this.moneySpan.value = this.wallet2.avaiableMoney;
        this.moneySpan.innerHTML = this.wallet2.avaiableMoney;
        this.btnPlaceBet.disabled = true;
    }

    addPlaceBet() {
        this.wallet2.bet = this.betAccountInput.value;
        this.wallet2.avaiableMoney -= this.wallet2.bet;
        localStorage.setItem('account', this.wallet2.avaiableMoney);
        this.betAccountInput.value = '';
        this.moneySpan.innerHTML = this.wallet2.avaiableMoney;
        this.btnPlaceBet.disabled = true;
        this.cal();
    }
}

class Base2 {
    account = localStorage.getItem('account');

    al() {
        if (this.account === null) {
            localStorage.setItem('account', 1000);
            this.account = localStorage.getItem('account');
        }
        return this.account;
    }
}


class Timer2{
    counter = 31;



}



const game = new Game();
game.start();
