/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { bitOp, not } from "../lib/BitwiseOp.mjs";

/**
 * NOT operation
 */
class NOT extends Operation {

    /**
     * NOT constructor
     */
    constructor() {
        super();

        this.name = "非";
        this.module = "Default";
        this.description = "返回每个字节的反码。";
        this.infoURL = "https://wikipedia.org/wiki/Bitwise_operation#NOT";
        this.inputType = "ArrayBuffer";
        this.outputType = "byteArray";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        input = new Uint8Array(input);
        return bitOp(input, null, not);
    }

    /**
     * Highlight NOT
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
     * Highlight NOT in reverse
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

export default NOT;
