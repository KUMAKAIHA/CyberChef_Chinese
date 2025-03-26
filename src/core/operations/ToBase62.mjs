/**
 * @author tcode2k16 [tcode2k16@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import BigNumber from "bignumber.js";
import Utils from "../Utils.mjs";
import {toHexFast} from "../lib/Hex.mjs";

/**
 * To Base62 operation
 */
class ToBase62 extends Operation {

    /**
     * ToBase62 constructor
     */
    constructor() {
        super();

        this.name = "转换为 Base62";
        this.module = "Default";
        this.description = "Base62 是一种使用受限符号集编码任意字节数据的表示法，这些符号集可以方便地供人类使用和计算机处理。高基数进制比十进制或十六进制系统产生更短的字符串。";
        this.infoURL = "https://wikipedia.org/wiki/List_of_numeral_systems";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "字母表",
                type: "string",
                value: "0-9A-Za-z"
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        input = new Uint8Array(input);
        if (input.length < 1) return "";

        const alphabet = Utils.expandAlphRange(args[0]).join("");
        const BN62 = BigNumber.clone({ ALPHABET: alphabet });

        input = toHexFast(input).toUpperCase();

        // Read number in as hex using normal alphabet
        const normalized = new BigNumber(input, 16);
        // Copy to BigNumber clone that uses the specified Base62 alphabet
        const number = new BN62(normalized);

        return number.toString(62);
    }

}

export default ToBase62;
