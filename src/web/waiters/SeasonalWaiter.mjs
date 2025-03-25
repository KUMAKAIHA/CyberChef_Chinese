/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

/**
 * Waiter to handle seasonal events and easter eggs.
 */
class SeasonalWaiter {

    /**
     * SeasonalWaiter constructor.
     *
     * @param {App} app - The main view object for CyberChef.
     * @param {Manager} manager - The CyberChef event manager.
     */
    constructor(app, manager) {
        this.app = app;
        this.manager = manager;
    }


    /**
     * Loads all relevant items depending on the current date.
     */
    load() {
        // Konami code
        this.kkeys = [];
        window.addEventListener("keydown", this.konamiCodeListener.bind(this));

        // CyberChef Challenge
        log.info("恭喜你，你已完成 CyberChef 挑战 #1！\n\n本次挑战探讨了十六进制编码。欲了解更多，请访问 wikipedia.org/wiki/Hexadecimal。\n\n本次挑战的代码是 9d4cbcef-be52-4751-a2b2-8338e6409416 （请保密）。\n\n下一个挑战可在 https://pastebin.com/GSnTAmkV 找到。");
    }


    /**
     * Listen for the Konami code sequence of keys. Turn the page upside down if they are all heard in
     * sequence.
     * #konamicode
     */
    konamiCodeListener(e) {
        this.kkeys.push(e.keyCode);
        const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        for (let i = 0; i < this.kkeys.length; i++) {
            if (this.kkeys[i] !== konami[i]) {
                this.kkeys = [];
                break;
            }
            if (i === konami.length - 1) {
                $("body").children().toggleClass("konami");
                this.kkeys = [];
            }
        }
    }

}

export default SeasonalWaiter;
