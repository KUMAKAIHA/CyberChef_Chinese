/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { bitOp, or, BITWISE_OP_DELIMS } from "../lib/BitwiseOp.mjs";

/**
 * OR operation
 */
class OR extends Operation {

    /**
     * OR constructor
     */
    constructor() {
        super();

        this.name = "或";
        this.module = "Default";
        this.description = "将输入与给定的密钥进行 OR 运算。<br>例如：<code>fe023da5</code>";
        this.infoURL = "https://wikipedia.org/wiki/Bitwise_operation#OR";
        this.inputType = "ArrayBuffer";
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
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const key = Utils.convertToByteArray(args[0].string || "", args[0].option);
        input = new Uint8Array(input);

        return bitOp(input, key, or);
    }

    /**
     * Highlight OR
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
     * Highlight OR in reverse
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

export default OR;
