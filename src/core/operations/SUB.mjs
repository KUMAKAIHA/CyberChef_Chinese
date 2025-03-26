/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { bitOp, sub, BITWISE_OP_DELIMS } from "../lib/BitwiseOp.mjs";

/**
 * SUB operation
 */
class SUB extends Operation {

    /**
     * SUB constructor
     */
    constructor() {
        super();

        this.name = "减";
        this.module = "Default";
        this.description = "使用给定的密钥对输入进行减法 (例如 <code>fe023da5</code>)，MOD 255";
        this.infoURL = "https://wikipedia.org/wiki/Bitwise_operation#Bitwise_operators";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
        this.args = [
            {
                "name": "密钥",
                "type": "toggleString",
                "value": "",
                "toggleValues": BITWISE_OP_DELIMS
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const key = Utils.convertToByteArray(args[0].string || "", args[0].option);

        return bitOp(input, key, sub);
    }

    /**
     * Highlight SUB
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
     * Highlight SUB in reverse
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

export default SUB;
