export class Cookie {
    getCookie() {
        let account = localStorage.getItem('account');
        if (account === null) {
            localStorage.setItem('account', 1000);
            account = localStorage.getItem('account');
        }
        return account;
    }

    setCookie(amount) {
        localStorage.setItem('account', amount);
    }
}
