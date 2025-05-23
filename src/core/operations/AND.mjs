/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { bitOp, and, BITWISE_OP_DELIMS } from "../lib/BitwiseOp.mjs";

/**
 * AND operation
 */
class AND extends Operation {

    /**
     * AND constructor
     */
    constructor() {
        super();

        this.name = "与";
        this.module = "Default";
        this.description = "将输入与给定密钥进行按位与运算。<br>例如：<code>fe023da5</code>";
        this.infoURL = "https://wikipedia.org/wiki/Bitwise_operation#AND";
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

        return bitOp(input, key, and);
    }

    /**
     * Highlight AND
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
     * Highlight AND in reverse
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

export default AND;
