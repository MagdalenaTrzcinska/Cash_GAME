const walletSpan = document.querySelector(".wallet-money span");
const betAccountInput = document.querySelector("#betAmount");
const autoCashoutInput = document.querySelector("#autoCashout");
const placeBetBtn = document.querySelector("button.placeBet");
const btnMax = document.querySelector("button.max");
const board = document.querySelector(".board");
const historyDiv = document.querySelector(".history");

const panel = {
    moneyAvailable: null,
    bet: null,
    autoCashout: null,
    historyOfMultipliers: []
};

let interval;
let multiplierValue;
let counter;
let currentMultiplier;

btnMax.addEventListener('click', () => betAccountInput.value = panel.moneyAvailable);
autoCashoutInput.addEventListener('change', () => panel.autoCashout = autoCashoutInput.value);

start();
downloadingFromCookie();

function start() {
    currentMultiplier = 1;
    counter = 30;
    //placeBetBtn.innerHTML = 'Place Bet';
    setTimeout(() => {
        board.style.backgroundColor = '#4ea196';
        placeBetBtn.disabled = false;
        interval = setInterval(startCountdown, 800);
    }, 5000);
}

function downloadingFromCookie() {
    let account = localStorage.getItem('account');
    if (account === null) {
        account = localStorage.setItem('account', 1000);
        account = localStorage.getItem('account');
    }

    account = 1000;
    panel.moneyAvailable = account;
    walletSpan.innerHTML = panel.moneyAvailable;
}

function startCountdown() {
    if (counter >= 1) {
        board.innerHTML = counter;
        counter--;
    } else if (counter < 1) {
        calcOfProbability();
    }
}

function calcOfProbability() {
    Math.random() < 0.7 ? drawingTheMultiplier(1) : drawingTheMultiplier(15);
    //buttonChange();
    clearInterval(interval);
    buttonChange();
    alert(panel.bet);
    if (panel.bet == null || panel.bet == '' || panel.bet == 0) {
        placeBetBtn.disabled = true;
    } else {
        placeBetBtn.disabled = false;
    }
    interval = setInterval(timer, 20);
}

function drawingTheMultiplier(min) {
    multiplierValue = ((Math.random() * 15) + min).toFixed(2);
}

function buttonChange() {
    placeBetBtn.innerHTML === 'Cash Out...' ? placeBetBtn.innerHTML = 'Place Bet' : placeBetBtn.innerHTML = 'Cash Out...';
    placeBetBtn.classList.toggle("btn-warning");
    placeBetBtn.classList.toggle("btn-success");
    placeBetBtn.classList.toggle("text-dark");
}

function timer() {
    if (currentMultiplier < multiplierValue) {
        board.innerHTML = currentMultiplier.toFixed(2) + "x";
        currentMultiplier += 0.01;
    } else {
        multiplierInterruption();
    }

}

function multiplierInterruption() {
    addToHis();
    board.innerHTML = "0.00x";
    board.style.backgroundColor = '#ff6666';
    clearInterval(interval);
    buttonChange();
    start();
}

function addToHis() {
    historyDiv.innerHTML = "";
    panel.historyOfMultipliers.unshift(multiplierValue);
    panel.historyOfMultipliers.forEach((one) => historyDiv.innerHTML += one + "x<br/>")
}

////////

placeBetBtn.addEventListener('click', () => {
    if (placeBetBtn.innerHTML === 'Place Bet') {
        placeBetBtn.disabled = true;
        addPlaceBet();
    } else {
        if (board.innerHTML !== "0.00x") {
            win();
        }
    }
    //buttonChange();
});

function win() {
    let win = panel.bet * currentMultiplier.toFixed(2);
    panel.moneyAvailable += win;
    a();
}

function addPlaceBet() {
    if (betAccountInput.value <= panel.moneyAvailable) {
        panel.bet = betAccountInput.value;
        panel.moneyAvailable -= panel.bet;
        betAccountInput.value = '';
        a();
        //buttonChange();
    } else {
        alert("nie masz wystarczająco środków");
        betAccountInput.value = '';
        return;
    }
}

function a() {
    localStorage.setItem('account', panel.moneyAvailable);
    walletSpan.innerHTML = panel.moneyAvailable;
    placeBetBtn.disabled = true;
}
