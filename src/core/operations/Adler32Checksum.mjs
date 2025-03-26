/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * Adler-32 Checksum operation
 */
class Adler32Checksum extends Operation {

    /**
     * Adler32Checksum constructor
     */
    constructor() {
        super();

        this.name = "Adler-32 校验和";
        this.module = "Crypto";
        this.description = "Adler-32 是一种校验和算法，由 Mark Adler 于 1995 年发明，是 Fletcher 校验和的改进版本。与相同长度的循环冗余校验相比，它牺牲了可靠性以换取速度（更偏向于后者）。<br><br>Adler-32 比 Fletcher-16 更可靠，但比 Fletcher-32 稍逊。";
        this.infoURL = "https://wikipedia.org/wiki/Adler-32";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const MOD_ADLER = 65521;
        let a = 1,
            b = 0;
        input = new Uint8Array(input);

        for (let i = 0; i < input.length; i++) {
            a += input[i];
            b += a;
        }

        a %= MOD_ADLER;
        b %= MOD_ADLER;

        return Utils.hex(((b << 16) | a) >>> 0, 8);
    }

}

export default Adler32Checksum;
