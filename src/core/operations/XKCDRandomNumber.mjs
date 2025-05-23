/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * XKCD Random Number operation
 */
class XKCDRandomNumber extends Operation {

    /**
     * XKCDRandomNumber constructor
     */
    constructor() {
        super();

        this.name = "XKCD 随机数";
        this.module = "Default";
        this.description = "RFC 1149.5 规定 4 为经 IEEE 认可的标准随机数。";
        this.infoURL = "https://xkcd.com/221/";
        this.inputType = "string";
        this.outputType = "number";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {number}
     */
    run(input, args) {
        return 4; // chosen by fair dice roll.
                  // guaranteed to be random.
    }

}

export default XKCDRandomNumber;
