const walletSpan = document.querySelector(".wallet-money span");
const betAccountInput = document.querySelector("#betAmount");
const btnMax = document.querySelector("button.max");
const autoCashoutInput = document.querySelector("#autoCashout");
const placeBetBtn = document.querySelector("button.placeBet");
const historyDiv = document.querySelector(".history");
const board = document.querySelector(".board");

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
    multiplierValue = Math.random() < 0.7 ? drawingTheMultiplier(1) : drawingTheMultiplier(15);
    clearInterval(interval);
    buttonChange();
    panel.bet == null || panel.bet === '' || panel.bet == 0 ? placeBetBtn.disabled = true : placeBetBtn.disabled = false;
    interval = setInterval(timer, 20);
}

function drawingTheMultiplier(min) {
    return ((Math.random() * 15) + min).toFixed(2);
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
        checkAuto();
    } else {
        multiplierInterruption();
    }
}

function checkAuto() {
    let cashout;

    for (let i of panel.autoCashout) {
        if (panel.autoCashout.charAt(i) === '.')
            break;
        else
            cashout = panel.autoCashout + '.00';

    }
    if (cashout == currentMultiplier.toFixed(2)) {
        win();
    }
}

function multiplierInterruption() {
    addToHis();
    board.textContent = "0.00x";
    board.style.backgroundColor = '#ff6666';
    clearInterval(interval);
    buttonChange();
    start();
}

function addToHis() {
    historyDiv.textContent = "";
    panel.historyOfMultipliers.unshift(multiplierValue);
    panel.historyOfMultipliers.forEach((one) => historyDiv.innerHTML += one + "x<br/>")
}

placeBetBtn.addEventListener('click', () => {
    if (placeBetBtn.innerHTML === 'Place Bet') {
        placeBetBtn.disabled = true;
        addPlaceBet();
    } else if (board.textContent !== "0.00x") {
        win();
    }
});

function win() {
    let win = panel.bet * currentMultiplier.toFixed(2);
    panel.moneyAvailable += win;
    updateMoney();
}

function addPlaceBet() {
    if (betAccountInput.value <= panel.moneyAvailable && betAccountInput.value > 0 && betAccountInput.value !== 0) {
        panel.bet = betAccountInput.value;
        panel.moneyAvailable -= panel.bet;
        betAccountInput.value = '';
        updateMoney();
    } else {
        alert('invalid bet');
        betAccountInput.value = '';
        throw {message: 'Invalid bet'};
    }
}

function updateMoney() {
    localStorage.setItem('account', panel.moneyAvailable);
    walletSpan.textContent = panel.moneyAvailable;
    placeBetBtn.disabled = true;
}
