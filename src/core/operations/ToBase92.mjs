/**
 * @author sg5506844 [sg5506844@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import { base92Chr } from "../lib/Base92.mjs";
import Operation from "../Operation.mjs";

/**
 * To Base92 operation
 */
class ToBase92 extends Operation {
    /**
     * ToBase92 constructor
     */
    constructor() {
        super();

        this.name = "转换为 Base92";
        this.module = "Default";
        this.description = "Base92 是一种使用一组受限符号编码任意字节数据的表示法，这些符号可以方便地被人使用并被计算机处理。";
        this.infoURL = "https://wikipedia.org/wiki/List_of_numeral_systems";
        this.inputType = "string";
        this.outputType = "byteArray";
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const res = [];
        let bitString = "";

        while (input.length > 0) {
            while (bitString.length < 13 && input.length > 0) {
                bitString += input[0].charCodeAt(0).toString(2).padStart(8, "0");
                input = input.slice(1);
            }
            if (bitString.length < 13)
                break;
            const i = parseInt(bitString.slice(0, 13), 2);
            res.push(base92Chr(Math.floor(i / 91)));
            res.push(base92Chr(i % 91));
            bitString = bitString.slice(13);
        }

        if (bitString.length > 0) {
            if (bitString.length < 7) {
                bitString = bitString.padEnd(6, "0");
                res.push(base92Chr(parseInt(bitString, 2)));
            } else {
                bitString = bitString.padEnd(13, "0");
                const i = parseInt(bitString.slice(0, 13), 2);
                res.push(base92Chr(Math.floor(i / 91)));
                res.push(base92Chr(i % 91));
            }
        }

        return res;

    }
}

export default ToBase92;
