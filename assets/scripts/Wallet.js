import {Cookie} from "./Cookie.js";
import {Panel} from "./Panel.js";

export class Wallet {
    btnMax = document.querySelector("button.max");
    autoCashoutInput = document.querySelector("#autoCashout");
    betAccountInput = document.querySelector("#betAmount");
    walletSpan = document.querySelector(".wallet_money span");
    placeBetBtn = document.querySelector("button.placeBet");

    panel = new Panel(0, 0, 0, []);

    constructor() {
        this.cookie = new Cookie();
        this.btnMax.addEventListener('click', () => this.betAccountInput.value = this.panel.moneyAvailable);
        this.autoCashoutInput.addEventListener('change', () => this.panel.autoCashout = this.autoCashoutInput.value);

        this.downloadingFromCookie();
    }

    downloadingFromCookie() {
        this.panel.moneyAvailable = this.cookie.getCookie();
        this.walletSpan.innerHTML = this.panel.moneyAvailable;
    }

    addPlaceBet() {
        if (+this.betAccountInput.value <= this.panel.moneyAvailable && +this.betAccountInput.value > 0 && +this.betAccountInput.value !== 0) {
            this.placeBetBtn.disabled = true;
            this.panel.bet = +this.betAccountInput.value;
            this.panel.moneyAvailable -= this.panel.bet;
            this.updateMoney();
        } else {
            alert('invalid bet');
            throw {message: 'Invalid bet'};
        }
        this.betAccountInput.value = '';
    }

    win(multiplier) {
        let win = this.panel.bet * multiplier;
        this.panel.moneyAvailable += win;
        this.updateMoney();
    }

    updateMoney() {
        this.cookie.setCookie(this.panel.moneyAvailable);
        this.walletSpan.textContent = this.panel.moneyAvailable;
        this.placeBetBtn.disabled = true;
    }
}
