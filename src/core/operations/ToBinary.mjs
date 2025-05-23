/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {BIN_DELIM_OPTIONS} from "../lib/Delim.mjs";
import {toBinary} from "../lib/Binary.mjs";

/**
 * To Binary operation
 */
class ToBinary extends Operation {

    /**
     * ToBinary constructor
     */
    constructor() {
        super();

        this.name = "转换为 二进制";
        this.module = "Default";
        this.description = "将输入数据以二进制字符串形式显示。<br><br>例如：<code>Hi</code> 转换为 <code>01001000 01101001</code>";
        this.infoURL = "https://wikipedia.org/wiki/Binary_code";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "分隔符",
                "type": "option",
                "value": BIN_DELIM_OPTIONS
            },
            {
                "name": "字节长度",
                "type": "number",
                "value": 8
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        input = new Uint8Array(input);
        const padding = args[1] ? args[1] : 8;
        return toBinary(input, args[0], padding);
    }

    /**
     * Highlight To Binary
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        const delim = Utils.charRep(args[0] || "Space");
        pos[0].start = pos[0].start * (8 + delim.length);
        pos[0].end = pos[0].end * (8 + delim.length) - delim.length;
        return pos;
    }

    /**
     * Highlight To Binary in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        const delim = Utils.charRep(args[0] || "Space");
        pos[0].start = pos[0].start === 0 ? 0 : Math.floor(pos[0].start / (8 + delim.length));
        pos[0].end = pos[0].end === 0 ? 0 : Math.ceil(pos[0].end / (8 + delim.length));
        return pos;
    }

}

export default ToBinary;
