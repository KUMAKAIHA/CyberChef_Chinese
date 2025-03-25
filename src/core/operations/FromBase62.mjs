/**
 * @author tcode2k16 [tcode2k16@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import BigNumber from "bignumber.js";
import Utils from "../Utils.mjs";


/**
 * From Base62 operation
 */
class FromBase62 extends Operation {

    /**
     * FromBase62 constructor
     */
    constructor() {
        super();

        this.name = "从 Base62 转换";
        this.module = "数据格式";
        this.description = "Base62 是一种使用受限符号集编码任意字节数据的表示法，这些符号集可以方便地供人类使用并由计算机处理。 高基数会产生比十进制或十六进制系统更短的字符串。";
        this.infoURL = "https://wikipedia.org/wiki/List_of_numeral_systems";
        this.inputType = "string";
        this.outputType = "byteArray";
        this.args = [
            {
                name: "字母表",
                type: "string",
                value: "0-9A-Za-z"
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        if (input.length < 1) return [];
        const alphabet = Utils.expandAlphRange(args[0]).join("");
        const BN62 = BigNumber.clone({ ALPHABET: alphabet });

        const re = new RegExp("[^" + alphabet.replace(/[[\]\\\-^$]/g, "\\{{input}}") + "]", "g");
        input = input.replace(re, "");

        // Read number in using Base62 alphabet
        const number = new BN62(input, 62);
        // Copy to new BigNumber object that uses the default alphabet
        const normalized = new BigNumber(number);

        // Convert to hex and add leading 0 if required
        let hex = normalized.toString(16);
        if (hex.length % 2 !== 0) hex = "0" + hex;

        return Utils.convertToByteArray(hex, "Hex");
    }

}

export default FromBase62;
