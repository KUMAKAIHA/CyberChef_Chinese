/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Bit shift right operation
 */
class BitShiftRight extends Operation {

    /**
     * BitShiftRight constructor
     */
    constructor() {
        super();

        this.name = "右位移";
        this.module = "Default";
        this.description = "将每个字节中的位向右移动指定的数量。<br><br><i>逻辑移位</i> 在最左侧的位补零。<br><i>算术移位</i> 保留原始字节的最高有效位 (MSB)，以保持符号不变（正数或负数）。";
        this.infoURL = "https://wikipedia.org/wiki/Bitwise_operation#Bit_shifts";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                "name": "数量",
                "type": "number",
                "value": 1
            },
            {
                "name": "类型",
                "type": "option",
                "value": ["逻辑移位", "算术移位"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        const amount = args[0],
            type = args[1],
            mask = type === "逻辑移位" ? 0 : 0x80;
        input = new Uint8Array(input);

        return input.map(b => {
            return (b >>> amount) ^ (b & mask);
        }).buffer;
    }

    /**
     * Highlight Bit shift right
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
     * Highlight Bit shift right in reverse
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

export default BitShiftRight;
