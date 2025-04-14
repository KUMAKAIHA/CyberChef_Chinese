/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {ALPHABET_OPTIONS} from "../lib/Base32.mjs";


/**
 * From Base32 operation
 */
class FromBase32 extends Operation {

    /**
     * FromBase32 constructor
     */
    constructor() {
        super();

        this.name = "从 Base32 转换";
        this.module = "Default";
        this.description = "Base32 是一种使用受限符号集编码任意字节数据的表示法，这些符号集可以方便地供人类使用和计算机处理。它使用的字符集比 Base64 小，通常使用大写字母和数字 2 到 7。";
        this.infoURL = "https://wikipedia.org/wiki/Base32";
        this.inputType = "string";
        this.outputType = "byteArray";
        this.args = [
            {
                name: "字符集",
                type: "editableOption",
                value: ALPHABET_OPTIONS
            },
            {
                name: "移除非字符集字符",
                type: "boolean",
                value: true
            }
        ];
        this.checks = [
            {
                pattern: "^(?:[A-Z2-7]{8})+(?:[A-Z2-7]{2}={6}|[A-Z2-7]{4}={4}|[A-Z2-7]{5}={3}|[A-Z2-7]{7}={1})?$",
                flags: "",
                args: ["A-Z2-7=", false]
            },
            {
                pattern: "^(?:[0-9A-V]{8})+(?:[0-9A-V]{2}={6}|[0-9A-V]{4}={4}|[0-9A-V]{5}={3}|[0-9A-V]{7}={1})?$",
                flags: "",
                args: ["0-9A-V=", false]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        if (!input) return [];

        const alphabet = args[0] ?
                Utils.expandAlphRange(args[0]).join("") : "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
            removeNonAlphChars = args[1],
            output = [];

        let chr1, chr2, chr3, chr4, chr5,
            enc1, enc2, enc3, enc4, enc5, enc6, enc7, enc8,
            i = 0;

        if (removeNonAlphChars) {
            const re = new RegExp("[^" + alphabet.replace(/[\]\\\-^]/g, "\\{{input}}") + "]", "g");
            input = input.replace(re, "");
        }

        while (i < input.length) {
            enc1 = alphabet.indexOf(input.charAt(i++));
            enc2 = alphabet.indexOf(input.charAt(i++) || "=");
            enc3 = alphabet.indexOf(input.charAt(i++) || "=");
            enc4 = alphabet.indexOf(input.charAt(i++) || "=");
            enc5 = alphabet.indexOf(input.charAt(i++) || "=");
            enc6 = alphabet.indexOf(input.charAt(i++) || "=");
            enc7 = alphabet.indexOf(input.charAt(i++) || "=");
            enc8 = alphabet.indexOf(input.charAt(i++) || "=");

            chr1 = (enc1 << 3) | (enc2 >> 2);
            chr2 = ((enc2 & 3) << 6) | (enc3 << 1) | (enc4 >> 4);
            chr3 = ((enc4 & 15) << 4) | (enc5 >> 1);
            chr4 = ((enc5 & 1) << 7) | (enc6 << 2) | (enc7 >> 3);
            chr5 = ((enc7 & 7) << 5) | enc8;

            output.push(chr1);
            if ((enc2 & 3) !== 0 || enc3 !== 32) output.push(chr2);
            if ((enc4 & 15) !== 0 || enc5 !== 32) output.push(chr3);
            if ((enc5 & 1) !== 0 || enc6 !== 32) output.push(chr4);
            if ((enc7 & 7) !== 0 || enc8 !== 32) output.push(chr5);
        }

        return output;
    }

}

export default FromBase32;

