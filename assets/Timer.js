export class Timer {
    constructor() {
        this.counterValue = 30;
    }

    returnTimer() {
        if (this.counterValue >= 1) {
            return this.counterValue--;
        } else {
            return false;
        }
    }
}
