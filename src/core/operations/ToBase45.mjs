/**
 * @author Thomas Weißschuh [thomas@t-8ch.de]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import {ALPHABET, highlightToBase45, highlightFromBase45} from "../lib/Base45.mjs";
import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * To Base45 operation
 */
class ToBase45 extends Operation {

    /**
     * ToBase45 constructor
     */
    constructor() {
        super();

        this.name = "转换为 Base45";
        this.module = "Default";
        this.description = "Base45 是一种使用受限符号集编码任意字节数据的表示法，这些符号集可以方便地供人类使用和计算机处理。 高基数进制会产生比十进制或十六进制系统更短的字符串。 Base45 针对 QR 码的使用进行了优化。";
        this.infoURL = "https://wikipedia.org/wiki/List_of_numeral_systems";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "字符集",
                type: "string",
                value: ALPHABET
            }
        ];

        this.highlight = highlightToBase45;
        this.highlightReverse = highlightFromBase45;
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (!input) return "";
        input = new Uint8Array(input);
        const alphabet = Utils.expandAlphRange(args[0]);

        const res = [];

        for (const pair of Utils.chunked(input, 2)) {
            let b = 0;
            for (const e of pair) {
                b *= 256;
                b += e;
            }

            let chars = 0;
            do {
                res.push(alphabet[b % 45]);
                chars++;
                b = Math.floor(b / 45);
            } while (b > 0);

            if (chars < 2) {
                res.push("0");
                chars++;
            }
            if (pair.length > 1 && chars < 3) {
                res.push("0");
            }
        }


        return res.join("");

    }

}

export default ToBase45;
