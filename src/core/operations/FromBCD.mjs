/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import {ENCODING_SCHEME, ENCODING_LOOKUP, FORMAT} from "../lib/BCD.mjs";
import BigNumber from "bignumber.js";

/**
 * From BCD operation
 */
class FromBCD extends Operation {

    /**
     * FromBCD constructor
     */
    constructor() {
        super();

        this.name = "从 BCD 转换";
        this.module = "Default";
        this.description = "二进制编码的十进制 (BCD) 是一种将十进制数字进行二进制编码的方式，其中每个十进制数字由固定数量的位表示，通常为四位或八位。有时会使用特殊的位模式来表示符号。";
        this.infoURL = "https://wikipedia.org/wiki/Binary-coded_decimal";
        this.inputType = "string";
        this.outputType = "BigNumber";
        this.args = [
            {
                "name": "方案",
                "type": "option",
                "value": ENCODING_SCHEME
            },
            {
                "name": "压缩",
                "type": "boolean",
                "value": true
            },
            {
                "name": "带符号",
                "type": "boolean",
                "value": false
            },
            {
                "name": "输入格式",
                "type": "option",
                "value": FORMAT
            }
        ];
        this.checks = [
            {
                pattern: "^(?:\\d{4} ){3,}\\d{4}$",
                flags: "",
                args: ["8 4 2 1", true, false, "Nibbles"]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {BigNumber}
     */
    run(input, args) {
        const encoding = ENCODING_LOOKUP[args[0]],
            packed = args[1],
            signed = args[2],
            inputFormat = args[3],
            nibbles = [];

        let output = "",
            byteArray;

        // Normalise the input
        switch (inputFormat) {
            case "Nibbles":
            case "Bytes":
                input = input.replace(/\s/g, "");
                for (let i = 0; i < input.length; i += 4) {
                    nibbles.push(parseInt(input.substr(i, 4), 2));
                }
                break;
            case "Raw":
            default:
                byteArray = new Uint8Array(Utils.strToArrayBuffer(input));
                byteArray.forEach(b => {
                    nibbles.push(b >>> 4);
                    nibbles.push(b & 15);
                });
                break;
        }

        if (!packed) {
            // Discard each high nibble
            for (let i = 0; i < nibbles.length; i++) {
                nibbles.splice(i, 1); // lgtm [js/loop-iteration-skipped-due-to-shifting]
            }
        }

        if (signed) {
            const sign = nibbles.pop();
            if (sign === 13 ||
                sign === 11) {
                // Negative
                output += "-";
            }
        }

        nibbles.forEach(n => {
            if (isNaN(n)) throw new OperationError("Invalid input");
            const val = encoding.indexOf(n);
            if (val < 0) throw new OperationError(`Value ${Utils.bin(n, 4)} is not in the encoding scheme`);
            output += val.toString();
        });

        return new BigNumber(output);
    }

}

export default FromBCD;
