/**
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
/**
 * Vigenère Decode operation
 */
class VigenèreDecode extends Operation {

    /**
     * VigenèreDecode constructor
     */
    constructor() {
        super();

        this.name = "Vigenère 解码";
        this.module = "Ciphers";
        this.description = "Vigenere 密码是一种通过使用一系列基于关键字字母的不同凯撒密码来加密字母文本的方法。 它是一种简单的多字母替换形式。";
        this.infoURL = "https://wikipedia.org/wiki/Vigenère_cipher";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥",
                "type": "string",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const alphabet = "abcdefghijklmnopqrstuvwxyz",
            key = args[0].toLowerCase();
        let output = "",
            fail = 0,
            keyIndex,
            msgIndex,
            chr;

        if (!key) throw new OperationError("未输入密钥");
        if (!/^[a-zA-Z]+$/.test(key)) throw new OperationError("密钥必须仅包含字母");

        for (let i = 0; i < input.length; i++) {
            if (alphabet.indexOf(input[i]) >= 0) {
                chr = key[(i - fail) % key.length];
                keyIndex = alphabet.indexOf(chr);
                msgIndex = alphabet.indexOf(input[i]);
                // Subtract indexes from each other, add 26 just in case the value is negative,
                // modulo to remove if necessary
                output += alphabet[(msgIndex - keyIndex + alphabet.length) % 26];
            } else if (alphabet.indexOf(input[i].toLowerCase()) >= 0) {
                chr = key[(i - fail) % key.length].toLowerCase();
                keyIndex = alphabet.indexOf(chr);
                msgIndex = alphabet.indexOf(input[i].toLowerCase());
                output += alphabet[(msgIndex + alphabet.length - keyIndex) % 26].toUpperCase();
            } else {
                output += input[i];
                fail++;
            }
        }

        return output;
    }

    /**
     * Highlight Vigenère Decode
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return pos;
    }

    /**
     * Highlight Vigenère Decode in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return pos;
    }

}

export default VigenèreDecode;
